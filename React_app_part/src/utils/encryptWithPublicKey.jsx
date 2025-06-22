function pemToBinary(pem) {
    const base64 = pem
      .replace(/-----(BEGIN|END) PUBLIC KEY-----/g, '')
      .replace(/\s+/g, '');
  
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}
async function encryptWithPublicKey(data, pemKey) {
    try {
      const binaryDer = pemToBinary(pemKey.publicKey); 
      const publicKey = await globalThis.crypto.subtle.importKey(
        'spki',
        binaryDer.buffer,
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256',
        },
        false,
        ['encrypt']
      );
      console.log("cc")
  
      const encoded = new TextEncoder().encode(JSON.stringify(data));
  
      const encrypted = await globalThis.crypto.subtle.encrypt(
        {
          name: 'RSA-OAEP',
        },
        publicKey,
        encoded
      );
      return btoa(String.fromCharCode(...new Uint8Array(encrypted)))
    } catch (err) {
      console.error("Error during encryption:", err);
      throw err;
    }
  }

  export default encryptWithPublicKey;