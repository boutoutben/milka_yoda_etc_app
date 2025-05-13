import {Router} from "express";
import db from '../mysqlDatabase.mjs';

const router = Router();

router.get("/", async (req, res) => {
    try {
        const [animals] = await db.promise().query("SELECT * FROM animals WHERE isMediator=false && isAdopted=false LIMIT 2");
        const [articles] = await db.promise().query("SELECT * FROM articles LIMIT 3");
        res.json({ animals, articles }); 
    } catch (error) {
        console.error("❌ Erreur MySQL :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

export default router;
