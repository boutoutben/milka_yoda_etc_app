const { encryptData, decryptData } = require("../Routes/encryptData");
const crypto = require("crypto");

const fakePublicKey = `-----BEGIN PUBLIC KEY-----
... your static public key PEM here ...
-----END PUBLIC KEY-----`;

const fakePrivateKey = `-----BEGIN PRIVATE KEY-----
... your static private key PEM here ...
-----END PRIVATE KEY-----`;

describe("encrypt and decryptData", () => {
  beforeAll(() => {
    process.env.PRIVATE_KEY = fakePrivateKey;
  });

  it("should decrypt encrypted data correctly", () => {
    const testData = { email: "john@example.com", password: "abc123" };
    const encrypted = encryptData(testData, fakePublicKey);
    const result = decryptData(encrypted, fakePrivateKey);

    expect(result.responseData.message).toBe("Data received successfully");
    expect(result.responseData.data).toEqual(testData);
  });

  it("should return error on invalid decrypted data", () => {
    jest.spyOn(crypto, 'privateDecrypt').mockImplementation(() => {
      throw new Error("Invalid decryption");
    });

    const result = decryptData("invalid_base64", fakePrivateKey);
    expect(result).toBe("Decryption failed: Invalid decryption");

    crypto.privateDecrypt.mockRestore();
  });
});