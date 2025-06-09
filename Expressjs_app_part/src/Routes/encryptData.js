const express = require("express");
const crypto = require('crypto');  // IMPORTANT : import crypto
const { generateKeys } = require('../utils/keys');

const { publicKey, privateKey } = generateKeys();

const encryptRouter = express.Router();

encryptRouter.get("/public-key", (req, res) => {
    res.send({ publicKey: publicKey.export({ type: 'spki', format: 'pem' }) });
});

function decryptData(encryptedData) {
    try {
      const decryptedBuffer = crypto.privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        Buffer.from(encryptedData, 'base64')
      );

      const jsonData = JSON.parse(decryptedBuffer.toString());

      const responseData = {
        message: 'Data received successfully',
        data: jsonData,
      };

      return { responseData };
    } catch (err) {
      return `Decryption failed: ${err.message}`;
    }
}

function encryptData(data) {
  try {
    const bufferData = Buffer.from(JSON.stringify(data));
    const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
      bufferData
    );
    return encrypted;  
  } catch (err) {
    return `Encryption failed: ${err.message}`
  }
    
}

module.exports = {
    encryptRouter,
    decryptData,
    encryptData
  };