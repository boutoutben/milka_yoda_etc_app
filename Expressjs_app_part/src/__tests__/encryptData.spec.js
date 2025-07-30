const { encryptData } = require("../Routes/encryptData");
const arrayBufferToBase64 = require("../utils/arryaBufferToBase64");
const convertPemToBinary = require("../utils/convertPemToBinary");
const { loadKeys } = require("../utils/generateKeys");

const { publicKey, privateKey } = loadKeys();

jest.mock('../utils/arryaBufferToBase64', () => jest.fn((buf) => 'mocked-base64'));

describe('encryptData', () => {
  beforeAll(() => {
    global.crypto = {
      subtle: {
        generateKey: jest.fn(async () => ({ /* mock key object */ })),
        encrypt: jest.fn(async () => new ArrayBuffer(8)),
        importKey: jest.fn(async (format, keyData) => {
  return {}; // dummy key
}),
        exportKey: jest.fn(async () => new ArrayBuffer(16)),
      },
      getRandomValues: jest.fn(() => new Uint8Array(16)),
    };
  });

  it('returns encryptedKey, encryptedData and iv as base64 strings', async () => {
    const dataObj = { message: "hello" };

    const result = await encryptData(dataObj, publicKey);

    expect(result).toEqual({
      encryptedKey: 'mocked-base64',
      encryptedData: 'mocked-base64',
      iv: 'mocked-base64',
    });
  });
});