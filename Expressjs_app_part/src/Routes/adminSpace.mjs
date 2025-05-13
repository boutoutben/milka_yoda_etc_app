import { Router } from "express";
import db from "../mysqlDatabase.mjs";
import { accessSync } from "fs";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [animals] = await db.promise().query(
      "SELECT adopter.id, animals.id as animalId, name, description, isSterile, imgName, isMediator, races, born, incompatibility, createdAt, isApprouved FROM adopter INNER JOIN animals ON animals.id = adopter.animal_id WHERE !isApprouved"
    );
    res.json(animals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des animaux.' });
  }
});

router.get("/adopterApprouved/:id", async (req, res) => {
    const {id} = req.params;
    try {
    const [row] = await db.promise().query(
      "SELECT adopter.id AS adopterId,firstname, lastname, civility, adressePostale, email, phone,animalCase, animalNumber, otherAnimals, lifeRoutine, haveChildren, motivation, animalPlace, child,animals.id AS animalId,name, description, isSterile, imgName, isMediator, races, born, incompatibility, createdAt, isApprouved FROM adopter INNER JOIN animals ON animals.id = adopter.animal_id WHERE adopter.id = ?",
      [id]
    );
    const data = row[0];
    const values = {
      id: data.adopterId,
      firstname: data.firstname,
      lastname: data.lastname,
      civility: data.civility,
      adressePostale: data.adressePostale,
      email: data.email,
      phone: data.phone,
      animalCase: JSON.parse(data.animalCase),
      animalNumber: JSON.parse(data.animalNumber),
      otherAnimals: JSON.parse(data.otherAnimals),
      lifeRoutine: JSON.parse(data.lifeRoutine),
      haveChildren: data.haveChildren,
      motivation: data.motivation,
      animalPlace: JSON.parse(data.animalPlace),
      child: JSON.parse(data.child)
    };

    const animal = {
      id: data.animalId,
      name: data.name,
      description: data.description,
      isSterile: data.isSterile,
      imgName: data.imgName,
      isMediator: data.isMediator,
      races: data.races,
      born: data.born,
      incompatibility: data.incompatibility,
      createdAt: data.createdAt,
      isApprouved: data.isApprouved
    };
    res.json({animal, values});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des animaux.' });
  }
});

router.delete("/refuse/:id", async (req, res) => {
    const {id} = req.params;
    const [rows] = await db.promise().query(
      "SELECT animal_id FROM adopter WHERE id = ?",
      [id]
    );

    if (rows.length > 0) {
      const animalId = rows[0].animal_id;
      await db.promise().query("UPDATE animals SET isAdopted=false WHERE id = ?", [animalId]);
      await db.promise().query("DELETE FROM adopter WHERE id = ?", [id]);
      res.json("Adoption refuser");
    } else {
      res.json("Nous n'avons pas trouver les donnée");
    }
})

router.patch("/accept/:id", async (req, res) => {
  const {id} = req.params;
  await db.promise().query("UPDATE adopter SET isApprouved=true WHERE id = ?", [id]);
  res.json("Adoption accepter");
})

export default router;