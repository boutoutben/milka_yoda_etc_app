import { Router } from "express";
import db from "../mysqlDatabase.mjs";

const router = Router();

router.get("/", async (req, res) => {
    try{
        const articles = await db.promise().query("select * from articles");
        res.json(articles);
    }
    catch (error) {
        console.error("❌ Erreur MySQL :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
})

router.get("/:id",async(req,res) => {
    try {
        const {id} = req.params;
        const [row] = await db.promise().query("select * from articles where id = ?",[id]);
        if(row.length == 0) return ("L'article n'est pas été trouvé");
        const article = row[0];
        res.json(article);
    }
    catch(err) {
        console.error(err);
    }
})

export default router;