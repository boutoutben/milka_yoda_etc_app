const { hashPassword } = require("../utils/hashPassword.js");
const db = require("../mysqlDatabase.js");
const { decryptData } = require("../Routes/encryptData.js");

const registerBlock = (req, res) => {
    const data = decryptData(req.body.data);
    const { firstname, lastname, email, phone, password } = data.responseData.data;

    const passwordHash = hashPassword(password);

    db.connect(function(err) {
        if(err) return res.status(500).send(err);
        db.query(`SELECT * FROM users WHERE email = ?`, [email], function(err, result){
            if(err) {
                return res.status(500).send(err);
            };
            if(Object.keys(result).length > 0) {
                return res.status(200).send("Vous avez déjà un compte");
            } else {
                const sql = `INSERT INTO users (id, firstname, lastname, email, phone, password, role) VALUES (UUID(), ?, ?, ?, ?, ?,1)`;
                db.query(sql, [firstname, lastname, email, phone, passwordHash], function(err, result) {
                    if (err) return res.status(500).send(err);
                    return res.status(201).send('Inscription réussie');
                });
            }
        });
    });
}

module.exports = registerBlock;