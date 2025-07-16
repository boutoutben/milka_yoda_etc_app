const db = require('../mysqlDatabase.js');

const fetchMediatorAnimals = async (req, res) => {
    try {
        const [animals] = await db.query("SELECT * FROM animals WHERE isMediator = 1 ");

        res.status(200).json(animals); // Renvoie directement un tableau d'objets
    } catch (error) {
        res.status(500).json({ error: `Erreur serveur: ${error.message}` });
    }
}

const addMediatorAnimals = async (req, res) => {
    try {
      const { name, description, sexe, isSterile, races, born, incompatibility } = req.body;
      const file = req.file;
  
      await db.query(
        "INSERT INTO animals(id, name, description, sexe, isSterile, imgName, races, born, incompatibility, isMediator, createdAt) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, true, ?)", 
        [name, description, sexe, isSterile, file.filename, JSON.stringify(races), born, JSON.stringify(incompatibility), new Date()]
      );
  
      res.status(201).json({ message: "Animal ajouter" });
    } catch (err) {
      res.status(500).json({ error: `Erreur serveur: ${err.message}` });
    }
  };

module.exports = {fetchMediatorAnimals, addMediatorAnimals}