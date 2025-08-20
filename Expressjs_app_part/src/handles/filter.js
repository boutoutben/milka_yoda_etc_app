const AnimalsRaces = require("../mongoose/Schemas/animalsRaces");
const { animalAge } = require("../utils/animalAge");

const filtedAnimals = async (req, res) => {
    try {
        const { values, filteredAnimals } = req.body;
        const filterValue = await Promise.all(filteredAnimals.map(async (animal) => {
            const races = JSON.parse(animal.races); // Convertir JSON string en tableau
            const raceObjects = await Promise.all(races.map(raceId => AnimalsRaces.findById(raceId)));
            console.log(raceObjects)
            const age = animalAge(raceObjects[0].espece, new Date().getFullYear() - new Date(animal.born).getFullYear());
            // Vérifier si l'animal correspond aux critères
            if (
                (animal.sexe == values.gender || values.gender == "") &&
                (raceObjects[0].espece == values.espece || values.espece == "") &&
                (values.age == age || values.age == "")
            ) {
                return animal; // Garder l'animal s'il correspond
            }

            return null; // Exclure les autres
        }));


        // Supprimer les `null` du tableau final
        res.status(200).json(filterValue.filter(animal => animal !== null));

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: `Erreur serveur: ${error.message}` });
    }
}

module.exports = {
    filtedAnimals
}