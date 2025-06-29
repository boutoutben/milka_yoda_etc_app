const express = require("express");

const { fetchAdoptedAnimals, setPersonnelInfo, fetchPersonnelsInfos, getRole, fetchApprouveAdoption, deleteAdoptionNotApprouved, approuveAdoption, blockUpdate, fetchAllUsers, fetchAdoptionNotApprouved } = require("../handles/user.js");
const { verifyToken } = require("../utils/tokens.js");
const { authRole } = require("../utils/handleRoles.js");

const router = express.Router();

router.get("/", verifyToken, authRole("USER_ROLE"), fetchAdoptedAnimals);
router.get("/fetchPersonnelInfos", verifyToken, authRole("USER_ROLE"), fetchPersonnelsInfos);
router.put("/", verifyToken, authRole("USER_ROLE"), setPersonnelInfo);
router.get("/getRole", verifyToken, getRole)
router.get("/admin/", fetchAdoptionNotApprouved);


router.get("/admin/adopterApprouved/:id", verifyToken, authRole("ADMIN_ROLE"), fetchApprouveAdoption);

router.delete("/admin/refuse/:id", verifyToken, authRole("ADMIN_ROLE"), deleteAdoptionNotApprouved)

router.patch("/admin/accept/:id", verifyToken, authRole("ADMIN_ROLE"), approuveAdoption)

router.get("/admin/users", fetchAllUsers);

router.patch("/admin/blockUpdate", verifyToken, authRole("ADMIN_ROLE"), blockUpdate)

module.exports = router;