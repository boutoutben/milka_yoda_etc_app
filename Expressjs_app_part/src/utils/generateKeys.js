const crypto = require('crypto');
const fs = require("fs");
const path = require("path");

function generateAndSaveKeys() {
  if (fs.existsSync("public.pem") && fs.existsSync("private.pem")) {
    return;
  }
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" }
});
  fs.writeFileSync("public.pem", publicKey);
  fs.writeFileSync("private.pem", privateKey);
}

function loadKeys() {
  const publicKey = fs.readFileSync("public.pem", "utf8");
  const privateKey = fs.readFileSync("private.pem", "utf8");
  return { publicKey, privateKey };
}

module.exports = {
  generateAndSaveKeys,
  loadKeys
};