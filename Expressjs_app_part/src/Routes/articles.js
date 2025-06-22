
const express = require('express');
const db = require("../mysqlDatabase.js");
const fs = require('fs'); 
const path = require('path');
const {upload } = require("../utils/uploadImg.js");
const { fetchArticles, fetchArticlesById, fetchArticlesDetail, addArticles, cancelleEditArticle, deleteArticle, editDescriptionArticle, editArticles } = require('../handles/articles.js');
const { verifyToken } = require('../utils/tokens.js');
const { authRole } = require('../utils/handleRoles.js');
const router = express.Router();

router.get("/", fetchArticles)

router.get("/:id", fetchArticlesById)

router.get("/detail/:id", fetchArticlesDetail)

router.post("/add", verifyToken, authRole("ADMIN_ROLE"), upload.single('file'), addArticles)

router.post("/edit/:id", verifyToken, authRole("ADMIN_ROLE"), editArticles)

router.patch('/editDescriptionArticle', verifyToken, authRole("ADMIN_ROLE"), upload.single('file'), editDescriptionArticle)

router.post("/cancelle/:id", verifyToken, authRole("ADMIN_ROLE"), cancelleEditArticle)

router.delete("/delete/:id", verifyToken, authRole("ADMIN_ROLE"), deleteArticle)

module.exports = router;