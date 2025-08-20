const db = require("../mysqlDatabase")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { hashPassword } = require("../utils/hashPassword.js");
const { decryptData } = require("../Routes/encryptData.js");
const emailSchema = require("../schema/emailSchema");
const loginSchema = require("../schema/LoginSchema");
const resetPasswordSchema = require("../schema/resetPasswordSchema");

dotenv.config();

const loginBlock = async (req, res) => {
  try {
    const data = decryptData(req.body.data);
    const {email, password, remember_me } = data.data
     await loginSchema.validate(data.data);
    const [rows] = await db.query(`
      SELECT users.*, roles.name as roleName
      FROM users
      INNER JOIN roles ON users.role = roles.id
      WHERE users.email = ?
    `, [email]);

    if (rows.length === 0) return res.status(400).send("L'email ou le mot de passe est incorect");

    const user = rows[0];
     if (user.lockout_until && new Date(user.lockout_until) > new Date()) {
      return res.status(403).json({
        message: "Trop de tentatives. Réessayez dans 15 min",
        lockoutUntil: user.lockout_until,
      });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        // Increase failed_attempts
        const failedAttempts = user.failed_attempts + 1;
        const updates = ["failed_attempts = ?"];
        const values = [failedAttempts];

        const LOGIN_BLOCK_DURATION_MS = process.env.NODE_ENV === 'test' ? 15000 : 15 * 60 * 1000;

        if (failedAttempts >= 7) {
          const lockoutTime = new Date(Date.now() + LOGIN_BLOCK_DURATION_MS); // 15 min
          updates.push("lockout_until = ?");
          values.push(lockoutTime);
        }

        values.push(email);
        await db.query(`UPDATE users SET ${updates.join(", ")} WHERE email = ?`, values);

        return res.status(400).send("L'email ou le mot de passe est incorect");
      }

      if(user.isBlock){
        return res.status(400).send("Votre compte est bloqué suite à une infraction");
      }

      await db.query("UPDATE users SET failed_attempts = 0, lockout_until = NULL WHERE email = ?", [email]);
      // If "Remember Me" is checked, extend session duration

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: remember_me ? "30d" : "1h" } 
      );

    const { id, firstname, lastname, email: userEmail, age, phone, roleName, civility, adressePostale } = user;
    const userInfo = { id, firstname, lastname, email: userEmail, age, phone, roleName, civility, adressePostale };
      const expiresIn = remember_me ? "30d" : "1h";
      res.status(200).json({ token, userInfo, expiresIn });
      } catch (err) {
        if (err.name === "ValidationError") {
          return res.status(400).json({
            errors: err.inner.map(e => ({
              field: e.path,
              message: e.message
            }))
          });
        }
        res.status(500).json({ error: "Erreur serveur", details: err.message });
      }
}

const forgotPassword = async (req, res) => {
  const {email} = req.body;
  try {
    await emailSchema.validate(req.body);
    const [user] = await db.query("SELECT users.id as id FROM users INNER JOIN roles ON users.role = roles.id WHERE roles.name = 'USER_ROLE' AND users.email = ?", [email]);
    if(user.length === 1) {
      const time = process.env.NODE_ENV === 'test'? 10000 : 10 * 60 * 1000
        const token = crypto.randomBytes(20).toString('hex');
        await db.query("UPDATE users SET resetToken = ?, resetTokenExpires = ? WHERE id = ?" , [token, new Date(Date.now() + time) ,user[0].id])
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'boutout.ben@gmail.com',
                pass: process.env.GMAIL_SERVICE_PASSWORD,
            },
        });
        const mailOptions = {
            from: process.env.NODE_ENV === 'test'? "test@example.com" : 'boutout.ben@gmail.com',
            to: email,
            subject: "Modifier le mot de passe",
            text: `Click sur le lien pour modifier ton mot de passe: http://localhost:5173/reset-password/${token}`
        };
        transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return res.status(500).send("Erreur lors de l'envoi de l'email.");
  }
  return res.send("Un email vous a été envoyé.");
});
    } else {
        res.status(404).send("Email non trouvé");
    }  
  } catch (err) {
    if (err.name === "ValidationError") {
          return res.status(400).json({
            errors: err.inner.map(e => ({
              field: e.path,
              message: e.message
            }))
          });
        }
    res.status(500).json({error: `Erreur server: ${err.message}`})
  }
}

const canResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const [users] = await db.query("SELECT users.id AS id, resetToken, resetTokenExpires FROM users INNER JOIN roles ON roles.id = users.role WHERE roles.name = 'USER_ROLE'");
    const condition = users.find(u => u.resetToken == token && u.resetTokenExpires > Date.now());
    if (condition) {
        res.send('Can reset password');  // ou render/redirect vers formulaire
    } else {
        res.status(404).send("Invalid or expired token");
    }  
  } catch (err) {
    res.status(500).json({error: `Erreur server: ${err.message}`})
  }
}

const resetPassword = async (req, res) => {
  try {
      const [users] = await db.query("SELECT users.id AS id, resetToken, resetTokenExpires FROM users INNER JOIN roles ON roles.id = users.role WHERE roles.name = 'USER_ROLE'");
      const data = decryptData(req.body.data);
      const  {token, password} = data.data;
      await resetPasswordSchema.validate(data.data);
      const user = users.find(user => user.resetToken === token);
      if(user) {
          const hash = hashPassword(password);
          await db.query("UPDATE users set password= ?, resetToken = null WHERE id = ?", [hash, user.id]);
          res.send("Success");
      }
      else {
        res.status(404).send("User not found");
      }
  } catch(err) {
     if (err.name === "ValidationError") {
          return res.status(400).json({
            errors: err.inner.map(e => ({
              field: e.path,
              message: e.message
            }))
          });
        }
      res.status(500).json({error: `Erreur server: ${err.message}`})
  }
}

module.exports = {loginBlock, forgotPassword, canResetPassword, resetPassword};