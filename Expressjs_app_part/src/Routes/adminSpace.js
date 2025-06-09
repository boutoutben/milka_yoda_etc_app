const express = require("express");
const db = require("../mysqlDatabase.js");
const { fetchAdoptionNotApprouved, fetchApprouveAdoption, deleteAdoptionNotApprouved, approuveAdoption, fetchAllUsers, blockUpdate } = require("../handles/adminSpace.js");


const router = express.Router();

router.get("/", fetchAdoptionNotApprouved);

router.get("/adopterApprouved/:id", fetchApprouveAdoption);

router.delete("/refuse/:id", deleteAdoptionNotApprouved)

router.patch("/accept/:id", approuveAdoption)

router.get("/users", fetchAllUsers);

router.patch("/blockUpdate", blockUpdate)

module.exports = router;