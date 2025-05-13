import {Router} from "express";
import db from '../mysqlDatabase.mjs';
import { AnimalsRaces } from "../mongoose/Schemas/animalsRaces.mjs";
import { AnimalsIncompatibility } from "../mongoose/Schemas/animalsIncompability.mjs";
import upload from "../utils/uploadImg.mjs";
import fs from 'fs';
import path from 'path';

const router = Router();

router.get("/", async (req, res) => {
    try {
        const [animals] = await db.promise().query("SELECT * FROM animals WHERE isMediator=false AND isAdopted = false");
        res.json({ animals}); 
    } catch (error) {
        console.error("❌ Erreur MySQL :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

router.get("/animal/:id", async (req, res) => {
    const { id } = req.params;
    
    // Requête pour récupérer les informations de l'animal
    const [rows] = await db.promise().query(
        "SELECT animals.id, animals.name, animals.born, animals.sexe, animals.imgName, animals.description, animals.isSterile, animals.isMediator, animals.createdAt, animals.races, animals.incompatibility FROM animals WHERE animals.id = ?;",
        [id]
    );
    
    
    // Vérifier si l'animal existe
    if (rows.length === 0) {
        return res.json({ message: "Animal non trouvé" });
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

router.get('/races', async (req, res) => {
    const {species} = req.query;
    const races = await AnimalsRaces.find(species && {espece: species} ).lean();
    const incompatibility = await AnimalsIncompatibility.find().lean();
    res.json({races, incompatibility})
})

router.post("/add",upload.single("file"),  async(req, res) => {
    const {name, description, sexe, isSterile, races, born, incompatibility} = req.body;
    const file = req.file;
    
    db.promise().query("INSERT INTO animals(id, name, description, sexe, isSterile, imgName, races, born, incompatibility, createdAt) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?)", [name, description, sexe,isSterile, file.filename, JSON.stringify(races), born, JSON.stringify(incompatibility), new Date()])
  .then(() => {
   res.send("Animal ajouter"); 
  })
  .catch((err) => {
    console.log(err)
    res.send(err);
  })
});

router.patch("/edit/:id", upload.single('file'), async (req, res) => {
    console.log(req.body)
    const { name, description, sexe, isSterile, races, born, incompatibility } = req.body;
    const { id } = req.params;
    const file = req.file;

    try {
        const [rows] = await db.promise().query("SELECT imgName FROM animals WHERE id = ?", [id]);
        const oldImgName = rows[0]?.imgName;

        if (file && file.filename) {
            // Supprimer l'ancien fichier (s'il existe)
            if (oldImgName) {
                const oldFilePath = path.join('uploads', oldImgName);
                fs.unlink(oldFilePath, (err) => {
                    if (err) console.error("Erreur suppression image:", err);
                    else console.log("Ancienne image supprimée:", oldImgName);
                });
            }

            await db.promise().query(
                "UPDATE animals SET name = ?, description = ?, sexe = ?, isSterile = ?, born = ?, races = ?, incompatibility = ?, imgName = ? WHERE id = ?",
                [
                    name,
                    description,
                    sexe,
                    isSterile,
                    born,
                    races,
                    incompatibility,
                    file.filename,
                    id
                ]
            );
        } else {
            await db.promise().query(
                "UPDATE animals SET name = ?, description = ?, sexe = ?, isSterile = ?, born = ?, races = ?, incompatibility = ? WHERE id = ?",
                [
                    name,
                    description,
                    sexe,
                    isSterile,
                    born,
                    races,
                    incompatibility,
                    id
                ]
            );
        }

        res.json({ message: 'Animal mis à jour avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.delete("/delete/:id", async (req, res) => {
    const {id} = req.params;
    await db.promise().query("DELETE FROM animals WHERE id = ?", [id]);
    res.send("Animal supprimer");
})

export default router;
