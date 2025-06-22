const crypto = require('crypto');
const { generateKeys } = require('../../utils/generateKeys');

describe('generateKeys', () => {
  it('should return an object with publicKey and privateKey', () => {
    const { publicKey, privateKey } = generateKeys();

    expect(publicKey).toBeDefined();
    expect(privateKey).toBeDefined();

    expect(typeof publicKey.export).toBe('function');
    expect(typeof privateKey.export).toBe('function');
  });

  it('should generate working RSA keys (sign/verify)', () => {
    const { publicKey, privateKey } = generateKeys();

    const data = "hello world";
    const signature = crypto.sign("sha256", Buffer.from(data), privateKey);

    const isValid = crypto.verify("sha256", Buffer.from(data), publicKey, signature);
    expect(isValid).toBe(true);
  });
});