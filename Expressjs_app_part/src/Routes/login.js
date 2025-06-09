const express = require("express");
const loginBlock = require("../handles/login");
const db = require("../mysqlDatabase.js");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { decryptData } = require("../Routes/encryptData");
const { hashPassword } = require("../utils/hashPassword.js");

const router = express.Router();
console.log(loginBlock);
router.post("/login", loginBlock);

router.post("/forgot-password", async (req, res) => {
    const {email} = req.body;
    const [user] = await db.promise().query("SELECT users.id as id FROM users INNER JOIN roles ON users.role = roles.id WHERE roles.name = 'USER_ROLE' AND users.email = ?", [email]);
    if(user.length === 1) {
        console.log(user);
        const token = crypto.randomBytes(20).toString('hex');
        console.log(token.length);
        await db.promise().query("UPDATE users SET resetToken = ?, resetTokenExpires = ? WHERE id = ?" , [token, new Date(Date.now() + 10 * 60 * 1000) ,user[0].id])
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'boutout.ben@gmail.com',
                pass: 'bjlr alcd jbev hxpn',
            },
        });
        const mailOptions = {
            from: 'boutout.ben@gmail.com',
            to: email,
            subject: "Modifier le mot de passe",
            text: `Click sur le lien pour modifier ton mot de passe: http://localhost:5173/reset-password/${token}`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
                console.log(error);
                res.status(500).send("Vérifier votre email pour modifier le mot de passe");
            }
        });
        res.send("Sucess")
    } else {
        res.status(404).send("Email non trouvé");
    }
});

router.get('/reset-password/:token',  async (req, res) => {
    const { token } = req.params;
    const [users] = await db.promise().query("SELECT users.id AS id, resetToken, resetTokenExpires FROM users INNER JOIN roles ON roles.id = users.role WHERE roles.name = 'USER_ROLE'");
    const condition = users.find(u => u.resetToken == token && u.resetTokenExpires > Date.now());
    console.log(token);
    console.log(condition);
    if (condition) {
        res.send('Can reset password');  // ou render/redirect vers formulaire
    } else {
        res.status(404).send("Invalid or expired token");
    }
});

router.post("/reset-password", async (req, res) => {
    const [users] = await db.promise().query("SELECT users.id AS id, resetToken, resetTokenExpires FROM users INNER JOIN roles ON roles.id = users.role WHERE roles.name = 'USER_ROLE'");
    try {
        const data = decryptData(req.body.data);
        const  {token, password} = data.responseData.data;
        const user = users.find(user => user.resetToken === token);
        if(user) {
            const hash = hashPassword(password);
            await db.promise().query("UPDATE users set password= ?, resetToken = null WHERE id = ?", [hash, user.id]);
            res.send("Success");
        }
    } catch(err) {
        console.log(err);
    }
})

module.exports = router;