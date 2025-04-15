import { Router } from "express";
import { AnimalsRaces } from "../mongoose/Schemas/animalsRaces.mjs";

const router = Router();

const animalAge = (animal, age) => {
    const ageCase = [
        {
            espece: "chien",
            young: { min: 0, max: 1 },
            adult: { min: 1, max: 7 }
        },
        {
            espece: "chat",
            young: { min: 0, max: 1 },
            adult: { min: 1, max: 10 }
        }
    ];

    // Trouver l'entrée correspondant à l'animal
    const caseData = ageCase.find(entry => entry.espece == animal);
    
        if (!caseData) return "Inconnu"; // Gérer le cas où l'animal n'est pas trouvé

        // Déterminer l'âge du groupe
        if (age >= caseData.young.min && age < caseData.young.max) {
            return "young";
        } else if (age >= caseData.adult.min && age < caseData.adult.max) {
            return "adult";
        } else {
            return "senior";
        }
    };

router.post("/", async (req, res) => {
    try {
        const { values, filteredAnimals } = req.body;

        const filterValue = await Promise.all(filteredAnimals.map(async (animal) => {
            const races = JSON.parse(animal.races); // Convertir JSON string en tableau
            const raceObjects = await Promise.all(races.map(raceId => AnimalsRaces.findById(raceId)));

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
        res.json(filterValue.filter(animal => animal !== null));

    } catch (error) {
        console.error("❌ Erreur serveur :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});


export default router;