const db = require("../mysqlDatabase.js");
const path = require("path");
const fs = require("fs");
const dotenv = require('dotenv');
dotenv.config();
const {generateRandomName} = require("../utils/generateRandowName.js")
const crypto = require("crypto");

const fetchArticles = async (req, res) => {
    try {
      const [articles] = await db.query("SELECT * FROM articles WHERE isPublish=true");
      res.status(200).json(articles); // ✅ CORRIGÉ
    } catch (error) {
      res.status(500).json({ error: `Erreur serveur: ${error}`});
    }
};

const fetchArticlesById = async(req,res) => {
    try {
        const {id} = req.params;
        const [row] = await db.query("select * from articles where id = ?",[id]);
        if(row.length == 0) res.status(404).json({message: "L'article n'est pas été trouvé"});
        const article = row[0];
        res.status(200).json(article);
    }
    catch(err) {
        res.status(500).json({error: `Erreur serveur: ${err.message}`})
    }
}

const fetchArticlesDetail = async (req, res) => {
    try {
      const { id } = req.params;
      const [article] = await db.query(
        "SELECT fileName FROM articles WHERE id = ?",
        [id]
      );
      
      if (!article.length || !article[0].fileName) {
        return res.status(404).json({ error: "Article introuvable" });
      }
  
      const filePath = path.join(
        process.env.CLIENT_APP_PART,
        "src",
        "articles",
        article[0].fileName
      );
  
      fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
          return res.status(500).json({ error: `Erreur fichier article: ${err.message}` });
        }
  
        res.status(200).json({ content: data });
      });
    } catch (err) {
      res.status(500).json({ error: `Erreur serveur: ${err.message}` });
    }
  };

  const addArticles = async (req, res) => {
    try {
      const { title, description } = req.body;
      const file = req.file;
      const uuid = crypto.randomUUID();
      const articleName = generateRandomName();
      const fileContent = `
        const Article = () => {
          return (
            <>
            </>
          )
        };
        export default Article;`
      const filePath = path.join(process.env.CLIENT_APP_PART, 'src', 'articles', articleName);
  
      // Await fs.mkdir promise version instead of callback
      try {
        await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
        try {
          await fs.promises.writeFile(filePath, fileContent);
            await db.query(
            "INSERT INTO articles VALUES (?, ?, ?, ?, ?, false)",
              [uuid, title, description, file.filename, articleName]
            );   
        } catch (err) {
          res.status(500).json({ error: `Write file error: ${err.message}` });
        }
        
  
        res.status(201).json({ message: "Article créer", id: uuid });
      } catch (err) {
        res.status(500).json({ error: `Failed to create folder: ${err.message}` });
      }
      
  
      
    } catch (err) {
      res.status(500).json({ error: `Erreur serveur: ${err.message}` });
    }
  };

const editDescriptionArticle = async (req, res) => {
  const { title, description, articleId } = req.body;
  const file = req.file;

  try {
    const [rows] = await db.query("SELECT imgName FROM articles WHERE id = ?", [articleId]);
    const oldImgName = rows[0]?.imgName;

    if (file) {
      if (oldImgName) {
        const oldFilePath = path.join('uploads', oldImgName);
        try {
          await fs.promises.unlink(oldFilePath);
        } catch (err) {
          return res.status(500).json({ error: `Delete file error: ${err.message}` });
        }
      }

      await db.query(
        "UPDATE articles SET title = ?, description = ?, imgName = ? WHERE id = ?",
        [title, description, file.filename, articleId]
      );
    } else {
      await db.query(
        "UPDATE articles SET title = ?, description = ? WHERE id = ?",
        [title, description, articleId]
      );
    }

    res.status(200).json({ message: "Mise à jour réussie !" });
  } catch (err) {
    res.status(500).json({ error: `Erreur serveur: ${err.message}` });
  }
};

const editArticles = async (req, res) => {
    try {
        const {id} = req.params;
        const content = req.body.content;
        const fileContent = `
        const Article = () => {
            return (
            <>
                ${content}
            </>
            )
        };
        export default Article;`
        const [article] = await db.query("SELECT fileName, isPublish FROM articles WHERE id = ?", [id]);
        const filePath = path.join(process.env.CLIENT_APP_PART, 'src', 'articles', article[0].fileName);
        if(!article[0].isPublish) await db.query("UPDATE articles SET isPublish = true");
        fs.writeFile(filePath, fileContent, function (err) {
            if (err)  res.status(500).json({ error: `Write file error: ${err.message}` });
            res.status(200).json({message:"update"})
        });
    } catch (err){
        res.status(500).json({error: `Erreur serveur: ${err.message}`})
    }
  }

  const cancelleEditArticle = async (req, res) => {
    try {
        const {id} = req.params;
        const [article] = await db.query("SELECT isPublish, fileName FROM articles WHERE id = ?", [id]);
        const filePath = path.join(process.env.CLIENT_APP_PART, 'src', 'articles', article[0].fileName);
        if(article[0].isPublish){
        res.status(200).json({url: `/article/${id}`});
        } else {
        fs.unlink(filePath, (err) => {
            if (err) res.status(500).json({error: `Delete file error: ${err.message}` });
        });
        db.query("DELETE FROM articles WHERE id = ?", [id]);
        res.status(200).json({url:`/article`})
        }
    } catch (err) {
        res.status(500).json({error: `Erreur serveur: ${err.message}`})
    }
    
  }

  const deleteArticle = async (req, res) => {
    try {
      const { id } = req.params;
  
      const [rows] = await db.query(
        "SELECT fileName, imgName FROM articles WHERE id = ?",
        [id]
      );
  
      if (rows.length === 0) {
        return res.status(404).json({ error: "Article not found" });
      }
  
      const { fileName, imgName } = rows[0];
  
      const filePath = path.join(process.env.CLIENT_APP_PART, 'src', 'articles', fileName);
      const imgPath = path.join(__dirname,"..",'..', 'uploads', imgName);
      try {
        await fs.promises.unlink(filePath);
      } catch (err) {
        return res.status(500).json({ error: `Delete file error: ${err.message}` });
      }
  
      // Supprimer l'image
      try {
        await fs.promises.unlink(imgPath);
      } catch (err) {
        return res.status(500).json({ error: `Delete img error: ${err.message}` });
      }
  
      await db.query("DELETE FROM articles WHERE id = ?", [id]);
  
      return res.status(200).json({ url: "/article" });
    } catch (err) {
      return res.status(500).json({ error: `Erreur serveur: ${err.message}` });
    }
  };

module.exports = {fetchArticles,fetchArticlesById, fetchArticlesDetail, addArticles,editDescriptionArticle, editArticles, cancelleEditArticle, deleteArticle}
