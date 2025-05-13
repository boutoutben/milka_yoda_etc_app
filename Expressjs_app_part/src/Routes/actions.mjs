import { Router } from "express";
import path from 'path';
import fs from 'fs';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import db from '../mysqlDatabase.mjs';
import upload from "../utils/uploadImg.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const router = Router();

router.get("/", (req, res) => {
    db.promise().query("SELECT * FROM actions ORDER BY actionOrder ")
    .then(([actions]) => {
        res.json({ actions });
    })
    .catch(err => {
        console.error(err);
        res.status(500).send("Error fetching actions");
    });
})

router.post("/addAction", upload.single("file"), async (req, res) => {
  const { title, description, pageUrl } = req.body;
  const file = req.file;
  db.promise().query("INSERT INTO actions(title, description, imgName, pageUrl) VALUES (?, ?, ?, ?)", [title, description, file.filename, pageUrl])
  .then(() => {
   res.send("File uploaded!"); 
  })
  .catch((err) => {
    console.log(err)
    res.send(err);
  })
  
});

router.patch("/editAction", upload.single("file"), async (req, res) => {
  const { title, description, actionId } = req.body;
  const file = req.file;

  try {
    // 1️⃣ Récupérer l'ancien imgName
    const [rows] = await db.promise().query("SELECT imgName FROM actions WHERE id = ?", [actionId]);
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
        [title, description, file.filename, actionId]
      );
    } else {
      // Aucun nouveau fichier → juste mettre à jour titre et description
      await db.promise().query(
        "UPDATE actions SET title = ?, description = ? WHERE id = ?",
        [title, description, actionId]
      );
    }

    res.send("Mise à jour réussie !");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});

router.delete("/delete/:id", (req, res) => {
    const {id} = req.params;
    try {
        db.promise().query("DELETE FROM actions WHERE id=?", [id]);
        res.send("Supprimer");
    }
    catch(err) {
        console.log(err);
        res.send(err)
    }
})

router.patch('/updateOrder', async (req, res) => {
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
    console.error('Error updating actionOrder:', err);
    res.status(500).json({ error: 'Unable to update order' });
  }
});

export default router;