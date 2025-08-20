const db = require("../mysqlDatabase.js");
const AdopterProfileSchema = require("../schema/adoptProfileSchema.js");

const setAdopterSumary = async (req, res) => {
    try {
        await AdopterProfileSchema.validate(req.body.values);
        const {
            civility, lastname, firstname, age, adressePostale, email, phone,
            animalCase, animalNumber, otherAnimals, lifeRoutine,
            haveChildren, motivation, animalPlace, child
        } = req.body.values;  

        const animal = req.body.animal;

        await db.query(
            "INSERT INTO adopter (id, firstname, lastname, civility,age, adressePostale, email, phone, animalCase, animalNumber, otherAnimals, lifeRoutine, haveChildren, motivation, animalPlace, child, animal_id) VALUES (uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                firstname,
                lastname,
                civility,
                age,
                adressePostale,
                email,
                phone,
                JSON.stringify(animalCase),
                JSON.stringify(animalNumber),
                JSON.stringify(otherAnimals),
                JSON.stringify(lifeRoutine),
                haveChildren,
                motivation,
                JSON.stringify(animalPlace),
                JSON.stringify(child),
                animal.id
            ]
        );

        await db.query(
            "UPDATE animals SET isAdopted = true WHERE id = ?",
            [animal.id]
        );

        return res.status(201).json({ message: 'Opération réussie' });

    } catch (err) {
        if (err.name === "ValidationError") {
          return res.status(400).json({
            errors: err.inner.map(e => ({
              field: e.path,
              message: e.message
            }))
          });
        }
        return res.status(500).json({ error: `Erreur serveur: ${err.message}` });
    }
}

module.exports = { setAdopterSumary }