const db = require("../mysqlDatabase.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { decryptData } = require("../Routes/encryptData.js");

const loginBlock = async (req, res) => {
  try {

    const data = decryptData(req.body.data);
    const {email, password, remember_me } = data.responseData.data
    const [rows] = await db.promise().query(`
      SELECT users.*, roles.name as roleName
      FROM users
      INNER JOIN roles ON users.role = roles.id
      WHERE users.email = ?
      `, [email]);

    if (rows.length === 0 ) return res.status(400).send("L'email ou le mot de passe est incorect");

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

        if (failedAttempts >= 7) {
          const lockoutTime = new Date(Date.now() + 15 * 60 * 1000); // 15 min
          updates.push("lockout_until = ?");
          values.push(lockoutTime);
        }

        

        values.push(email);
        await db.promise().query(`UPDATE users SET ${updates.join(", ")} WHERE email = ?`, values);

        return res.status(400).send("L'email ou le mot de passe est incorect");
      }

      if(user.isBlock){
        return res.status(400).send("Votre compte est bloqué suite à une infraction");
      }

      await db.promise().query("UPDATE users SET failed_attempts = 0, lockout_until = NULL WHERE email = ?", [email]);
      // If "Remember Me" is checked, extend session duration

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: remember_me ? "30d" : "1h" } // 15 minutes pour une session classique
      );

    const { id, firstname, lastname, email: userEmail, age, phone, roleName, civility, adressePostale } = user;
    const userInfo = { id, firstname, lastname, email: userEmail, age, phone, roleName, civility, adressePostale };
      const expiresIn = remember_me ? "30d" : "1h";
      res.status(200).json({ token, userInfo, expiresIn });
      } catch (err) {
          res.status(500).send("Server Error");
      }
}

module.exports = loginBlock;