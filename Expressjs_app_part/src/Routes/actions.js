const express = require('express');
const {upload} = require('../utils/uploadImg.js');

const { addAction, fetchActions, editActions, deleteActions, updateOrder } = require('../handles/actions.js');
const { verifyToken } = require('../utils/tokens.js');
const { authRole } = require('../utils/handleRoles.js');
const router = express.Router();

router.get("/", fetchActions);

router.post("/addAction", verifyToken, authRole("ADMIN_ROLE"), upload.single("file"), addAction);

router.patch("/editAction/:id", verifyToken, authRole("ADMIN_ROLE"), upload.single("file"), editActions);

router.delete("/delete/:id", verifyToken, authRole("ADMIN_ROLE"), deleteActions);

router.patch('/updateOrder', verifyToken, authRole("ADMIN_ROLE"), updateOrder);

module.exports = router;