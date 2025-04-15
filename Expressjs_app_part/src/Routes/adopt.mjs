import {Router} from "express";
import db from '../mysqlDatabase.mjs';
import { AnimalsRaces } from "../mongoose/Schemas/animalsRaces.mjs";
import { AnimalsIncompatibility } from "../mongoose/Schemas/animalsIncompability.mjs";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const [animals] = await db.promise().query("SELECT * FROM animals WHERE isMediator=false");
        res.json({ animals}); 
    } catch (error) {
        console.error("❌ Erreur MySQL :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    
    // Requête pour récupérer les informations de l'animal
    const [rows] = await db.promise().query(
        "SELECT animals.id, animals.name, animals.born, animals.sexe, animals.imgName, animals.description, animals.isMediator, animals.createdAt, animals.races, animals.incompatibility FROM animals WHERE animals.id = ?;",
        [id]
    );
    
    
    // Vérifier si l'animal existe
    if (rows.length === 0) {
        return res.status(404).json({ message: "Animal non trouvé" });
    }
    // Prendre le premier animal trouvé
    const animal = rows[0];

    const races = JSON.parse(animal.races); // Convert JSON string to array
    const raceObjects = await Promise.all(
        races.map(raceId => AnimalsRaces.findById(raceId))
    );

    const animalsRaces = raceObjects.map(race => ({
        name: race.name,
        espece: race.espece
    }));
    let animalsIncompability = null
    if(animal.incompatibility){
    const incompatibility= JSON.parse(animal.incompatibility);
        const incompatibilityObjects = await Promise.all(
        incompatibility.map(incompatibilityId => AnimalsIncompatibility.findById(incompatibilityId))
        );
        animalsIncompability = incompatibilityObjects.map(incompatibility=>({
            imgName:incompatibility.imgName,
        }))
    }
    


    
    // Répondre avec l'animal et les races sous forme d'objet
    return res.json({ animal, animalsRaces, animalsIncompability });
});


export default router;
