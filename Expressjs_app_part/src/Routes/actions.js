const express = require('express');
const db = require('../mysqlDatabase.js');
const upload = require('../utils/uploadImg.js');

const { addAction, fetchActions, editActions, deleteActions, updateOrder } = require('../handles/actions.js');
const router = express.Router();

router.get("/", fetchActions);

router.post("/addAction", upload.single("file"), addAction);

router.patch("/editAction", upload.single("file"), editActions);

router.delete("/delete/:id", deleteActions);

router.patch('/updateOrder', updateOrder);

module.exports = router;