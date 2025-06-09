const express = require("express");
const db = require('../mysqlDatabase.js');
const upload = require("../utils/uploadImg.js");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const [animals] = await db.promise().query("SELECT * FROM animals WHERE isMediator = 1 ");

        res.json(animals); // Renvoie directement un tableau d'objets
    } catch (error) {
        console.error("❌ Erreur MySQL :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

router.post("/add",upload.single("file"),  async(req, res) => {
    const {name, description, sexe, isSterile, races, born, incompatibility} = req.body;
    const file = req.file;
    
    db.promise().query("INSERT INTO animals(id, name, description, sexe, isSterile, imgName, races, born, incompatibility, isMediator, createdAt) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, true, ?)", [name, description, sexe,isSterile, file.filename, JSON.stringify(races), born, JSON.stringify(incompatibility), new Date()])
  .then(() => {
   res.send("Animal ajouter"); 
  })
  .catch((err) => {
    console.log(err)
    res.send(err);
  })
});

module.exports = router;