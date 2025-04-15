import { response, Router } from 'express';
import {readFile} from 'node:fs/promises';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router(); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin absolu vers le fichier test.txt
const filePath = path.resolve(__dirname, '../randomArticle.pdf');

router.get('/', async (req, res) => {
    try {
        // Vérification si le fichier existe
        res.send("cc")
    } catch (err) {
        console.error("Impossible de lire le fichier : ", err);
        res.status(500).send("Erreur lors de la lecture du fichier");
    }
});
export default router;
    