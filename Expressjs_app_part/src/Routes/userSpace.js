const express = require("express");

const { fetchPersonnelInfo, setPersonnelInfo } = require("../handles/userSpace.js");

const router = express.Router();

router.get("/", fetchPersonnelInfo);

router.put("/", setPersonnelInfo)

module.exports = router;