const crypto = require('crypto');
const fs = require("fs");
const { generateAndSaveKeys, loadKeys } = require('../../utils/generateKeys');

jest.mock("fs");
jest.mock("crypto");

describe("generateAndSaveKeys", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not generate keys if they already exist", () => {
    fs.existsSync.mockReturnValue(true); // Les fichiers existent déjà

    generateAndSaveKeys();

    expect(fs.existsSync).toHaveBeenCalledWith("public.pem");
    expect(fs.existsSync).toHaveBeenCalledWith("private.pem");
    expect(crypto.generateKeyPairSync).not.toHaveBeenCalled();
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  it("should generate and save keys if they do not exist", () => {
    fs.existsSync.mockReturnValue(false); // Les fichiers n'existent pas
    const mockPublicKey = "mock-public-key";
    const mockPrivateKey = "mock-private-key";

    crypto.generateKeyPairSync.mockReturnValue({
      publicKey: mockPublicKey,
      privateKey: mockPrivateKey
    });

    generateAndSaveKeys();

    expect(crypto.generateKeyPairSync).toHaveBeenCalledWith("rsa", expect.any(Object));
    expect(fs.writeFileSync).toHaveBeenCalledWith("public.pem", mockPublicKey);
    expect(fs.writeFileSync).toHaveBeenCalledWith("private.pem", mockPrivateKey);
  });
});

describe("loadKeys", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should read public and private key files", () => {
    fs.readFileSync
      .mockImplementationOnce(() => "mock-public-key")
      .mockImplementationOnce(() => "mock-private-key");

    const result = loadKeys();

    expect(fs.readFileSync).toHaveBeenCalledWith("public.pem", "utf8");
    expect(fs.readFileSync).toHaveBeenCalledWith("private.pem", "utf8");
    expect(result).toEqual({
      publicKey: "mock-public-key",
      privateKey: "mock-private-key"
    });
  });
});