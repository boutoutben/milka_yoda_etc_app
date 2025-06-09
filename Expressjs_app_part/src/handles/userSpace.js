const db = require("../mysqlDatabase.js");
const { decryptData } = require("../Routes/encryptData.js");

const fetchPersonnelInfo = async (req, res) => {
    try {
        const {email} = req.user;
      const [animals] = await db.promise().query(
        "SELECT animals.id, name, description, isSterile, imgName, isMediator, races, born, incompatibility, createdAt, isApprouved FROM adopter INNER JOIN animals ON animals.id = adopter.animal_id WHERE email = ? LIMIT 3",
        [email]
      );
      res.status(200).json(animals);
    } catch (error) {
      res.status(500).json({ error: `Erreur serveur: ${error.message}` });
    }
}

const setPersonnelInfo = async (req, res) => {
    const data = decryptData(req.body.data); 
    const {civility, lastname, firstname, age, adressePostale, email, phone} = data.responseData.data;
    try {
      const [result] = await db.promise().query(
        "UPDATE users SET civility = ?, firstname = ?, lastname = ?, adressePostale = ?, email = ?, age = ?, phone = ? WHERE id = ?",
        [civility, firstname, lastname, adressePostale, email, age, phone, req.body.id]
      );
  
      if (result.affectedRows === 0) {
         res.status(404).json({ message: "Aucun utilisateur trouvé avec cet ID" });
      }
  
      const [user] = await db.promise().query("SELECT users.id, firstname, lastname, email, age, phone, roles.name as roleName, civility,adressePostale FROM users INNER JOIN roles on roles.id = users.role WHERE users.id = ?", [req.body.id])
  
      res.status(200).json({ message: "Infos mises à jour !", userInfo: user[0] });
    } catch (err) {
      res.status(500).json({ error: `Erreur serveur: ${err.message}` });
    }
  }

module.exports = {
    fetchPersonnelInfo,
    setPersonnelInfo
}