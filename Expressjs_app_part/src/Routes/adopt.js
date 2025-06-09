const express = require("express");
const db = require('../mysqlDatabase.js');
const AnimalsRaces = require("../mongoose/Schemas/animalsRaces.js");
const AnimalsIncompatibility = require("../mongoose/Schemas/animalsIncompability.js");
const upload = require("../utils/uploadImg.js");
const fs = require('fs');
const path = require('path');
const { fetchAdopt, fetchAnimalsById, fetchRacesAndIncompatibility, addAnimals, deleteAnimal } = require("../handles/adopt.js");
const { editActions } = require("../handles/actions.js");

const router = express.Router();

router.get("/", fetchAdopt);

router.get("/animal/:id", fetchAnimalsById);

router.get('/races', fetchRacesAndIncompatibility)

router.post("/add",upload.single("file"), addAnimals);

router.patch("/edit/:id", upload.single('file'), editActions);

router.delete("/delete/:id", deleteAnimal);

module.exports = router;
