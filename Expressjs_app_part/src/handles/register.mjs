import { hashPassword } from "../utils/hashPassword.mjs";
import db from "../mysqlDatabase.mjs";

export const registerBlock = (req, res) => {
    const { firstname, lastname, email, phone, password } = req.body;

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