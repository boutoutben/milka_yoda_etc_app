const db = require("../mysqlDatabase.js");
const AnimalsRaces = require("../mongoose/Schemas/animalsRaces.js");
const AnimalsIncompatibility = require("../mongoose/Schemas/animalsIncompability.js");
const fs = require("fs");
const path = require("path");


const fetchAdopt = async (req, res) => {
    try {
        const [animals] = await db.promise().query("SELECT * FROM animals WHERE isMediator=false AND isAdopted = false");
        res.json({animals}); 
    } catch (error) {
        res.status(500).json({ error: `Erreur serveur ${error}` });
    }
}

const fetchAnimalsById = async (req, res) => {
    try{
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
    } catch (err){
        res.status(500).json({ error: `Erreur serveur ${err}` });
    }
    
}

const fetchRacesAndIncompatibility = async (req, res) => {
    try {
        const { species } = req.query;
        // If species is provided, filter by it; otherwise, fetch all
        const races = await AnimalsRaces.find(species && { espece: species }).lean();
        const incompatibility = await AnimalsIncompatibility.find().lean();

        res.json({ races, incompatibility });
    } catch (err) {
        res.status(500).json({ error: `Erreur serveur: ${err}` });
    }
}

const addAnimals = async (req, res) => {
    try {
      const { name, description, sexe, isSterile, races, born, incompatibility } = req.body;
      const file = req.file;
  
      await db
        .promise()
        .query(
          "INSERT INTO animals(id, name, description, sexe, isSterile, imgName, races, born, incompatibility, createdAt) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [name, description, sexe, isSterile, file.filename, JSON.stringify(races), born, JSON.stringify(incompatibility), new Date()]
        );
  
      res.status(201).json({ message: "Animal ajouter" });
    } catch (err) {
      res.status(500).json({ error: `Erreur serveur: ${err.message}` });
    }
  };

  const editAnimals = async (req, res) => {
    const { name, description, sexe, isSterile, races, born, incompatibility } = req.body;
    const { id } = req.params;
    const file = req.file;
  
    try {
      const [rows] = await db.promise().query("SELECT imgName FROM animals WHERE id = ?", [id]);
      const oldImgName = rows[0]?.imgName;
  
      const racesJson = races ? JSON.stringify(races) : null;
      const incompatibilityJson = incompatibility ? JSON.stringify(incompatibility) : null;
  
      if (file) {
        if (oldImgName) {
          const oldFilePath = path.join('uploads', oldImgName);
          try {
            await fs.promises.unlink(oldFilePath);
          } catch (err) {
            // If unlink fails, send error and return to avoid continuing
            return res.status(500).json({ error: `Delete file error: ${err.message}` });
          }
        }
  
        await db.promise().query(
          "UPDATE animals SET name = ?, description = ?, sexe = ?, isSterile = ?, born = ?, races = ?, incompatibility = ?, imgName = ? WHERE id = ?",
          [name, description, sexe, isSterile, born, racesJson, incompatibilityJson, file.filename, id]
        );
      } else {
        await db.promise().query(
          "UPDATE animals SET name = ?, description = ?, sexe = ?, isSterile = ?, born = ?, races = ?, incompatibility = ? WHERE id = ?",
          [name, description, sexe, isSterile, born, racesJson, incompatibilityJson, id]
        );
      }
  
      res.status(200).json({ message: 'Animal mis à jour avec succès' });
    } catch (err) {
      res.status(500).json({ error: `Erreur serveur: ${err.message}` });
    }
  };

  const deleteAnimal = async (req, res) => {
    try {
      const { id } = req.params;
      const [animal] = await db.promise().query("SELECT imgName FROM animals WHERE id = ?", [id]);
      const {imgName} = animal[0];
      const imgPath = path.join(__dirname,"..",'..', 'uploads', imgName);
      
      try {
        await fs.promises.unlink(imgPath);
      } catch (err) {
        return res.status(500).json({ error: `Delete img error: ${err.message}` });
      }

      const [result] = await db.promise().query("DELETE FROM animals WHERE id = ?", [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Animal non trouvé" });
      }
  
      return res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: `Erreur serveur : ${err.message}` });
    }
  };

module.exports = {fetchAdopt, fetchAnimalsById, fetchRacesAndIncompatibility, addAnimals, editAnimals, deleteAnimal}