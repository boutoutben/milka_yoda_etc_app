const express = require("express");
const db = require('../mysqlDatabase.js');
const AnimalsRaces = require("../mongoose/Schemas/animalsRaces.js");
const AnimalsIncompatibility = require("../mongoose/Schemas/animalsIncompability.js");
const {upload} = require("../utils/uploadImg.js");
const fs = require('fs');
const path = require('path');
const { fetchAdopt, fetchAnimalsById, fetchRacesAndIncompatibility, addAnimals, deleteAnimal, editAnimals } = require("../handles/adopt.js");
const { verifyToken } = require("../utils/tokens.js");
const { authRole } = require("../utils/handleRoles.js");

const router = express.Router();

router.get("/", fetchAdopt);

router.get("/animal/:id", fetchAnimalsById);

router.get('/races', fetchRacesAndIncompatibility)

router.post("/add", verifyToken, authRole("ADMIN_ROLE"),upload.single("file"), addAnimals);

router.patch("/edit/:id", verifyToken, authRole("ADMIN_ROLE"), upload.single('file'), editAnimals);

router.delete("/delete/:id", verifyToken, authRole("ADMIN_ROLE"), deleteAnimal);

module.exports = router;
