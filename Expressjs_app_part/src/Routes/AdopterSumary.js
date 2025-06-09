const express = require("express");
const db = require('../mysqlDatabase.js');
const { setAdopterSumary } = require("../handles/adopterSumary.js");

const router = express.Router();
router.post('/', setAdopterSumary);

module.exports = router;