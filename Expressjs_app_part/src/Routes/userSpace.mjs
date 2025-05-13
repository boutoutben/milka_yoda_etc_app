import { Router } from "express";
import db from "../mysqlDatabase.mjs";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [animals] = await db.promise().query(
      "SELECT animals.id, name, description, isSterile, imgName, isMediator, races, born, incompatibility, createdAt, isApprouved FROM adopter INNER JOIN animals ON animals.id = adopter.animal_id WHERE email = ? LIMIT 3",
      [req.user.email]
    );
    res.json(animals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des animaux.' });
  }
});

router.put("/",async (req, res) => {
  const {civility, lastname, firstname, age, adressePostale, email, phone} = req.body.values;
  try {
    await db.promise().query(
      "UPDATE users set civility = ?, firstname= ?, lastname=?,adressePostale=?,email=?, age=?,phone=? WHERE id=?", [civility, firstname, lastname, adressePostale,email, age, phone, req.body.id]
    );
    res.json({message: "Info mis à jour !"})
  } catch(err) {
    console.error(err);
  }
})

export default router;