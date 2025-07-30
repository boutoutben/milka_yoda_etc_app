

function convertPemToBinary(pem) {
  const lines = pem.trim().split('\n');
  const base64 = lines.slice(1, -1).join('');
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

function arrayBufferToBase64(buffer) {
  return btoa(
  String.fromCharCode(...new Uint8Array(buffer))
);
}

async function encryptWithPublicKey(dataObj, publicKeyPem) {
  if (process.env.NODE_ENV === 'test') {
    console.warn("⚠️ crypto.subtle indisponible : utilisation d’un mock de chiffrement (base64)");
    return btoa(JSON.stringify(dataObj)); // Encode JSON en base64
  }
  const enc = new TextEncoder();
  const data = enc.encode(JSON.stringify(dataObj));

  // 1. Génère une clé AES (symétrique)
  const aesKey = await window.crypto.subtle.generateKey(
    { name: "AES-CBC", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  // 2. Génère un IV (vecteur d'initialisation)
  const iv = window.crypto.getRandomValues(new Uint8Array(16));

  // 3. Chiffre les données avec AES
  const encryptedDataBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    aesKey,
    data
  );

  // 4. Convertit la clé publique PEM en CryptoKey
  const binaryDer = convertPemToBinary(publicKeyPem.publicKey);

  const publicKey = await window.crypto.subtle.importKey(
    "spki",
    binaryDer.buffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"]
  );

  // 5. Exporte et chiffre la clé AES avec RSA
  const rawAesKey = await window.crypto.subtle.exportKey("raw", aesKey);

  const encryptedKeyBuffer = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    rawAesKey
  );

  return {
    encryptedKey: arrayBufferToBase64(encryptedKeyBuffer),
    encryptedData: arrayBufferToBase64(encryptedDataBuffer),
    iv: arrayBufferToBase64(iv),
  };
}
  export default encryptWithPublicKey;