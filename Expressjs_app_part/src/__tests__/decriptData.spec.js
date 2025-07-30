const { encryptData, decryptData } = require("../Routes/encryptData");
const crypto = require("crypto");
const { loadKeys } = require("../utils/generateKeys");
const { publicKey, privateKey } = loadKeys();




describe("encrypt and decryptData", () => {

  const testData = { email: "john@example.com", password: "abc123" };
  it("should decrypt encrypted data correctly", async () => {
    
    const encrypted = await encryptData(testData, publicKey);
    const result = decryptData(encrypted);
    expect(result.data).toEqual(testData);
  });

  it("should return the payload no content corect data with fake data", () => {
    const result = decryptData("invalid_base64");
    expect(result).toEqual({
      error: "Le payload ne contient pas encryptedKey, encryptedData et iv",
      success: false,
    });

  });
  it("should return an error is unattented error", async () => {
    jest.spyOn(crypto, 'createDecipheriv').mockImplementation(() => {
      throw new Error("Mock error");
    });
    const encrypted = await encryptData(testData, publicKey);
    const result = decryptData(encrypted);
    expect(result).toEqual({"error": "Erreur de déchiffrement : Mock error", "success": false});

  })
});

