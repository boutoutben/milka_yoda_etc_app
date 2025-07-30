function convertPemToBinary(pem) {
    try {
  if (!pem || typeof pem !== 'string') {
    throw new Error('Invalid PEM format: not a string');
  }

  const lines = pem.trim().split('\n');
  if (lines.length < 3) {
    throw new Error('Invalid PEM format: too few lines');
  }

  const beginLine = lines[0].trim();
  const endLine = lines[lines.length - 1].trim();

  if (!beginLine.startsWith("-----BEGIN") || !endLine.startsWith("-----END")) {
    throw new Error('Invalid PEM format: missing BEGIN/END lines');
  }

  const base64 = lines.slice(1, -1).join('').replace(/\s+/g, '');
  if (!/^[A-Za-z0-9+/=]+$/.test(base64)) {
    throw new Error('Invalid PEM content: not valid base64');
  }

  
    return new Uint8Array(Buffer.from(base64, 'base64'));
  } catch (e) {
    throw new Error('Invalid base64 encoding');
  }
}
module.exports = convertPemToBinary