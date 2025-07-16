const db = require("../mysqlDatabase.js")

const setAdopterSumary = async (req, res) => {
    try {
        const {
            civility, lastname, firstname, adressePostale, email, phone,
            animalCase, animalNumber, otherAnimals, lifeRoutine,
            haveChildren, motivation, animalPlace, child
        } = req.body.values;  

        const animal = req.body.animal;

        await db.query(
            "INSERT INTO adopter (id, firstname, lastname, civility, adressePostale, email, phone, animalCase, animalNumber, otherAnimals, lifeRoutine, haveChildren, motivation, animalPlace, child, animal_id) VALUES (uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                firstname,
                lastname,
                civility,
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
        return res.status(500).json({ error: `Erreur serveur: ${err.message}` });
    }
}

module.exports = { setAdopterSumary }