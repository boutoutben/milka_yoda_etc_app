const { hashPassword } = require("../utils/hashPassword.js");
const db = require("../mysqlDatabase.js");
const { decryptData } = require("../Routes/encryptData.js");

const registerBlock = async (req, res) => {
  const data = decryptData(req.body.data);
   
  if (!data.success) {
    console.error("Erreur de déchiffrement :", data.error);
    return res.status(400).send("Erreur de déchiffrement");
  }

  const { firstname, lastname, email, phone, password } = data.data;
    const passwordHash = hashPassword(password);
    try {
      const existUser = await db.query("SELECT * FROM users WHERE email = ?", [email]);
      console.log(existUser[0].length)
      if(existUser[0].length > 0) {
        return res.status(200).send("Vous avez déjà un compte");
      }
      const sql = `
    INSERT INTO users (id, firstname, lastname, email, phone, password, role)
    VALUES (UUID(), ?, ?, ?, ?, ?, 1)
  `;

  await db.query(sql, [firstname, lastname, email, phone, passwordHash]);
      return res.status(201).send("Inscription réussie");
    }
    

  catch (err) {
    return res.status(500).send("Une erreur est survenue:", err.message);
  }
}

module.exports = registerBlock;