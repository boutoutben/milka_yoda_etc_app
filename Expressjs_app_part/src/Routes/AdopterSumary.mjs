import { Router } from "express";
import db from '../mysqlDatabase.mjs';

const router = Router();
router.post('/', (req, res) => {
    const {civility, lastname, firstname,adressePostale, email, phone, animalCase, animalNumber, otherAnimals,lifeRoutine, haveChildren, motivation, animalPlace, child} = req.body.values;  
    const animal = req.body.animal;
    console.log(req.body);
    db.promise().query(
      "INSERT INTO adopter (id, firstname, lastname, civility, adressePostale, email, phone, animalCase, animalNumber, otherAnimals, lifeRoutine, haveChildren, motivation, animalPlace, child, animal_id) VALUES (uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        firstname,
        lastname,
        civility,
        adressePostale,
        email,
        phone,
        JSON.stringify(animalCase),    // tableau -> string JSON
        JSON.stringify(animalNumber),  // objet -> string JSON
        JSON.stringify(otherAnimals),  // tableau d'objets -> string JSON
        JSON.stringify(lifeRoutine),   // tableau -> string JSON
        haveChildren,                  // boolean (pas besoin de JSON.stringify ici)
        motivation,
        JSON.stringify(animalPlace),   // tableau -> string JSON
        JSON.stringify(child),       // tableau -> string JSON
        animal.id
      ]
    )
    db.promise().query(
      `UPDATE animals set isAdopted = true WHERE id = "${animal.id}"`
    )
.then(([result]) => {
    return res.status(201).send('Opération réussie');
}).catch((err) => {
    return res.status(500).send(err);
});
});

export default router;