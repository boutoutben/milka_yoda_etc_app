const express = require("express");
const crypto = require('crypto');  // IMPORTANT : import crypto
const { generateKeys } = require('../utils/generateKeys');

const { publicKey, privateKey } = generateKeys();

const encryptRouter = express.Router();

encryptRouter.get("/public-key", (req, res) => {
  res.send({ publicKey });
});


function decryptData(data) {
  try {
    const decryptedBuffer = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(data, 'base64')
    );

    const jsonData = JSON.parse(decryptedBuffer.toString());

    return {
      success: true,
      responseData: {
        message: 'Data received successfully',
        data: jsonData,
      }
    };
  } catch (err) {
    return {
      success: false,
      error: `Decryption failed: ${err.message}`
    };
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

    return {
      success: true,
      data: encrypted.toString('base64') // optionally return base64 string
    };
  } catch (err) {
    return {
      success: false,
      error: `Encryption failed: ${err.message}`
    };
  }
}

module.exports = {
    encryptRouter,
    decryptData,
    encryptData
  };