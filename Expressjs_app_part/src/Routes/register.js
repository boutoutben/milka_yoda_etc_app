const express = require("express");
const parseUrl = require('body-parser');
const registerBlock  = require("../handles/register");
console.log(registerBlock)
const router = express.Router();

let encodeUrl = parseUrl.urlencoded({ extended: false });

router.post('/', encodeUrl, registerBlock);

module.exports = router;