
const express = require('express');
const db = require("../mysqlDatabase.js");
const fs = require('fs'); 
const path = require('path');
const upload = require("../utils/uploadImg.js");
const { fetchArticles, fetchArticlesById, fetchArticlesDetail, addArticles, cancelleEditArticle, deleteArticle, editDescriptionArticle, editArticles } = require('../handles/articles.js');
const router = express.Router();

router.get("/", fetchArticles)

router.get("/:id", fetchArticlesById)

router.get("/detail/:id", fetchArticlesDetail)

router.post("/add", upload.single('file'), addArticles)

router.post("/edit/:id", editArticles)

router.patch('/editDescriptionArticle', upload.single('file'), editDescriptionArticle)

router.post("/cancelle/:id", cancelleEditArticle)

router.delete("/delete/:id", deleteArticle)

module.exports = router;