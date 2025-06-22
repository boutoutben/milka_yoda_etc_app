const express = require("express");
const {loginBlock, forgotPassword, canResetPassword, resetPassword} = require("../handles/login");
const db = require("../mysqlDatabase.js");

const { decryptData } = require("../Routes/encryptData");
const { hashPassword } = require("../utils/hashPassword.js");

const router = express.Router();

router.post("/login", loginBlock);

router.post("/forgot-password", forgotPassword);

router.get('/reset-password/:token',  canResetPassword);

router.post("/reset-password", resetPassword)

module.exports = router;