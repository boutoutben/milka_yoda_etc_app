const db = require("../mysqlDatabase.js");
const fs = require("fs");
const path = require("path");

const addAction = async (req, res) => {
    const { title, description, pageUrl } = req.body;
    const file = req.file;
    
    try {
        await db.promise().query(
          "INSERT INTO actions(title, description, imgName, pageUrl) VALUES (?, ?, ?, ?)",
          [title, description, file.filename, pageUrl]
        );
        res.status(201).json({ message: "Action ajoutée avec succès !" });
      } catch (err) {
        res.status(500).json({ error: `Erreur lors de l'ajout de l'action: ${err}` });
      }
}

const fetchActions = async (req, res) => {
    try {
      const [actions] = await db.promise().query("SELECT * FROM actions ORDER BY actionOrder");
      res.json({ actions });
    } catch (err) {
      res.status(500).json({ error: `Error fetching actions: ${err}`  });
    }
  };

const editActions = async (req, res) => {
    const { title, description } = req.body;
      const file = req.file;
      const {id} = req.params;
    
      try {
        // 1️⃣ Récupérer l'ancien imgName
        const [rows] = await db.promise().query("SELECT imgName FROM actions WHERE id = ?", [id]);
        const oldImgName = rows[0]?.imgName;
    
        //2️⃣ Si un nouveau fichier est uploadé
        if (file) {
          // Supprimer l'ancien fichier (s'il existe)
          if (oldImgName) {
            const oldFilePath = path.join('uploads', oldImgName);
            fs.unlink(oldFilePath, (err) => {
              if (err) console.error("Erreur suppression image:", err);
              else console.log("Ancienne image supprimée:", oldImgName);
            });
          }
    
          // Mettre à jour titre, description et imgName
          await db.promise().query(
            "UPDATE actions SET title = ?, description = ?, imgName = ? WHERE id = ?",
            [title, description, file.filename, id]
          );
        } else {
          // Aucun nouveau fichier → juste mettre à jour titre et description
          await db.promise().query(
            "UPDATE actions SET title = ?, description = ? WHERE id = ?",
            [title, description, id]
          );
        }
    
        res.json({message: "Mise à jour réussie !"});
      } catch (err) {
        res.status(500).json({error: `Erreur serveur: ${err}`});
      } 
}

const deleteActions = async (req, res) => {
  try {
    const { id } = req.params;

    const [actions] = await db.promise().query("SELECT imgName FROM actions WHERE id = ?", [id]);
    if (actions.length === 0) {
      return res.status(404).json({ error: "Action not found" });
    }

    const { imgName } = actions[0];

    // Construire un chemin absolu ou basé sur variable d'env
    const imgPath = path.join(__dirname,"..",'..', 'uploads', imgName);

    try {
      await fs.promises.unlink(imgPath);
    } catch (err) {
      return res.status(500).json({ error: `Delete img error: ${err.message}` });
    }

    await db.promise().query("DELETE FROM actions WHERE id = ?", [id]);

    res.json({ message: "Supprimé" });

  } catch (err) {
    res.status(500).json({ error: `Delete error: ${err.message}` });
  }
};

const updateOrder = async (req, res) => {
  const { actions } = req.body;

  if (!Array.isArray(actions)) {
    return res.status(400).json({ error: 'actions must be an array' });
  }

  try {
    // Build an array of promise objects
    const updatePromises = actions.map((action, index) => {
      // index is 0-based; if you want 1-based ordering use (index + 1)
      return db
        .promise()
        .query(
          'UPDATE actions SET actionOrder = ? WHERE id = ?',
          [index, action.id]
        );
    });

    // Wait until all updates complete
    await Promise.all(updatePromises);

    // All done! Send a success response
    res.json({ success: true, updated: actions.length });
  } catch (err) {
    res.status(500).json({ error: `Unable to update order ${err}` });
  }
}

module.exports = {addAction, fetchActions, editActions, deleteActions, updateOrder};