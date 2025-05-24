import { Router } from "express";
import db from "../mysqlDatabase.mjs";
import fs, { cp } from 'fs'; 
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import upload from "../utils/uploadImg.mjs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();
dotenv.config();

router.get("/", async (req, res) => {
    try{
        const articles = await db.promise().query("select * from articles WHERE isPublish=true");
        res.json(articles);
    }
    catch (error) {
        console.error("❌ Erreur MySQL :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
})

router.get("/:id",async(req,res) => {
    try {
        const {id} = req.params;
        const [row] = await db.promise().query("select * from articles where id = ?",[id]);
        if(row.length == 0) return ("L'article n'est pas été trouvé");
        const article = row[0];
        res.json(article);
    }
    catch(err) {
        console.error(err);
    }
})

router.get("/detail/:id", async(req, res) => {
  try {
    const {id} = req.params;
  const [article] = await db.promise().query("SELECT fileName FROM articles WHERE id = ?", [id]);
  const filePath = path.join(process.env.CLIENT_APP_PART, 'src', 'articles', article[0].fileName);
  fs.readFile(filePath, "utf-8",(err, data) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    res.send(data);

  })
  } catch(err) {
    console.log(err)
    res.send(err);
  }
  
})

function generateRandomName() {
    const randomPart = Math.random().toString(36).substring(2, 8); // 6-char string
    return `Article_${randomPart}.jsx`;
  }

router.post("/add", upload.single('file'), (req, res) => {
    const {title, description} = req.body;
    const file = req.file;

    const uuid = crypto.randomUUID();
    
    const articleName = generateRandomName()
    const filePath = path.join(process.env.CLIENT_APP_PART, 'src', 'articles', articleName);
    const content = `import { WelcomeSection } from "../pageComponent/Component";
    const Article = () => {
        return (
            
        )
    }`
    

  fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
    if (err) return res.status(500).send('Failed to create folder');

    fs.writeFile(filePath, content, (err) => {
      if (err) return res.status(500).send('Error writing file');
    });
  });
  db.promise().query("INSERT INTO articles VALUES (?, ?, ?, ?, ?, false)", [uuid,title, description, file.filename, articleName])
  .then(() => {
   res.json({message:"Article créer", id:uuid}); 
  })
  .catch((err) => {
    console.log(err)
    res.send(err);
  })
})

router.post("/edit/:id", async (req, res) => {
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
    const [article] = await db.promise().query("SELECT fileName, isPublish FROM articles WHERE id = ?", [id]);
    const filePath = path.join(process.env.CLIENT_APP_PART, 'src', 'articles', article[0].fileName);
    if(!article[0].isPublish) await db.promise().query("UPDATE articles SET isPublish = true");
    fs.writeFile(filePath, fileContent, function (err) {
      if (err) throw err;
    res.send("replace")
    });
})

router.post("/cancelle/:id", async (req, res) => {
  const {id} = req.params;
  const [article] = await db.promise().query("SELECT isPublish, fileName FROM articles WHERE id = ?", [id]);
  const filePath = path.join(process.env.CLIENT_APP_PART, 'src', 'articles', article[0].fileName);
  if(article[0].isPublish){
    res.json({url: `/article/${id}`});
  } else {
    fs.unlink(filePath, (err) => {
      if (err) throw err;
      console.log('File deleted');
    });
    db.promise().query("DELETE FROM articles WHERE id = ?", [id]);
    res.json({url:`/article`})

  }
})

router.delete("/delete/:id", async (req, res) => {
  const {id} = req.params;
  const [article] = await db.promise().query("SELECT fileName FROM articles WHERE id = ?", [id]);
  const filePath = path.join(process.env.CLIENT_APP_PART, 'src', 'articles', article[0].fileName);
  fs.unlink(filePath, function(err){
    if(err) throw err; 
  });
  db.promise().query("DELETE FROM articles where id = ?", [id]);
  res.json({url:`/article`});
})

export default router;