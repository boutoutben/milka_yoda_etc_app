const crypto = require('crypto');

function generateKeys() {
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });
}

module.exports = {
  generateKeys,
};