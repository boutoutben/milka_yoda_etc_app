const express = require("express");
const crypto = require('crypto');  // IMPORTANT : import crypto
const { loadKeys, generateAndSaveKeys } = require('../utils/generateKeys');
const dotenv = require('dotenv');
const convertPemToBinary = require("../utils/convertPemToBinary");
const arrayBufferToBase64 = require("../utils/arryaBufferToBase64");

generateAndSaveKeys();
const { publicKey, privateKey } = loadKeys();

const encryptRouter = express.Router();

encryptRouter.post("/encryptData", async (req, res) => {
  const data = req.body.data;
  const encryptedPayload = await encryptData(data, publicKey);
  res.json(encryptedPayload);
});


function decryptData(payload) {
   const { encryptedKey, encryptedData, iv } = payload;

  if (!encryptedKey || !encryptedData || !iv) {
    return {
      success: false,
      error: "Le payload ne contient pas encryptedKey, encryptedData et iv"
    };
  }
  try {
    const encryptedKeyBuffer = Buffer.from(encryptedKey, "base64");
    const encryptedDataBuffer = Buffer.from(encryptedData, "base64");
    const ivBuffer = Buffer.from(iv, "base64");

    // Déchiffrement de la clé AES avec RSA
    const aesKeyBuffer = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      encryptedKeyBuffer
    );

    // Déchiffrement AES
    const decipher = crypto.createDecipheriv("aes-256-cbc", aesKeyBuffer, ivBuffer);
    const decrypted = Buffer.concat([
      decipher.update(encryptedDataBuffer),
      decipher.final()
    ]);

    return {
      success: true,
      data: JSON.parse(decrypted.toString("utf8")),
    };
  } catch (err) {
    return { success: false, error: "Erreur de déchiffrement : " + err.message };
  }
}

async function encryptData(dataObj, publicKeyPem) {
  const enc = new TextEncoder();
  const data = enc.encode(JSON.stringify(dataObj));

  const aesKey = await crypto.subtle.generateKey(
  { name: "AES-CBC", length: 256 },
  true,
  ["encrypt", "decrypt"]
);

const iv = crypto.getRandomValues(new Uint8Array(16));

const encryptedDataBuffer = await crypto.subtle.encrypt(
  { name: "AES-CBC", iv },
  aesKey,
  data
);

  // 4. Importer la clé publique RSA
  const binaryDer = convertPemToBinary(publicKeyPem);
  const BinaryPublicKey = await crypto.subtle.importKey(
    "spki",
    binaryDer.buffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"]
  );

  // 5. Exporter la clé AES brute et la chiffrer avec la clé RSA
  const rawAesKey = await crypto.subtle.exportKey("raw", aesKey);
  const encryptedKeyBuffer = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    BinaryPublicKey,
    rawAesKey
  );

  // 6. Retourner les données chiffrées
  return {
    encryptedKey: arrayBufferToBase64(encryptedKeyBuffer),
    encryptedData: arrayBufferToBase64(encryptedDataBuffer),
    iv: arrayBufferToBase64(iv),
  };
}

module.exports = {
    encryptRouter,
    decryptData,
    encryptData,
  };