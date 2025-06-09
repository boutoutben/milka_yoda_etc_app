const express = require("express");
const db = require('../mysqlDatabase.js');

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const [actions] = await db.promise().query("SELECT * FROM actions LIMIT 2")
        const [animals] = await db.promise().query("SELECT * FROM animals WHERE isMediator=false && isAdopted=false LIMIT 2");
        const [articles] = await db.promise().query("SELECT * FROM articles LIMIT 3");
        res.json({ animals, articles, actions }); 
    } catch (error) {
        console.error("❌ Erreur MySQL :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;
