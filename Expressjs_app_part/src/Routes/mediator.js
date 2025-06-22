const express = require("express");
const {upload} = require("../utils/uploadImg.js");
const { fetchMediatorAnimals, addMediatorAnimals } = require("../handles/mediator.js");
const { verifyToken } = require("../utils/tokens.js");
const { authRole } = require("../utils/handleRoles.js");

const router = express.Router();

router.get("/", fetchMediatorAnimals);

router.post("/add", verifyToken, authRole("ADMIN_ROLE"),upload.single("file"), addMediatorAnimals);

module.exports = router;