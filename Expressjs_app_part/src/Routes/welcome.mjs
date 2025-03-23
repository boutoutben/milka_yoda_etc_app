import {Router} from "express";
import db from '../mysqlDatabase.mjs';

const router = Router();

router.get("/", async (req, res) => {
    try {
        const [animals] = await db.promise().query("SELECT * FROM animals");
        res.json(animals); // ✅ Envoie les données après que la requête soit terminée
    } catch (error) {
        console.error("❌ Erreur MySQL :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

export default router;
