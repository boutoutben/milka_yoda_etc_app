const convertPemToBinary = require("../../utils/convertPemToBinary");

describe('convertPemToBinary', () => {
  it('should convert a valid PEM to a Uint8Array', () => {
    const pem = `
-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAL1FaQoFZoN64dyGyvWGPs6xCHkAdUtM
uViR0xQZnRJZqFz9M4fy7acxcuG27EZLFF3p54Sp4FV6TWvK5sCSMb8CAwEAAQ==
-----END PUBLIC KEY-----
    `.trim();

    const binary = convertPemToBinary(pem);

    expect(binary).toBeInstanceOf(Uint8Array);
    expect(binary.length).toBeGreaterThan(0);
  });

  it('should throw if PEM is invalid', () => {
    const invalidPem = `
-----BEGIN PUBLIC KEY-----
INVALID-BASE64-@@@
-----END PUBLIC KEY-----
    `.trim();

    expect(() => convertPemToBinary(invalidPem)).toThrow();
  });
});

