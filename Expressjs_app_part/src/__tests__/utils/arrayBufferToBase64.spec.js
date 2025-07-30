const arrayBufferToBase64 = require("../../utils/arryaBufferToBase64");

describe('arrayBufferToBase64', () => {
  beforeAll(() => {
    global.btoa = (str) => Buffer.from(str, 'binary').toString('base64');
  });

  it('converts ArrayBuffer to base64 string', () => {
    const uint8 = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
    const base64 = arrayBufferToBase64(uint8.buffer);
    expect(base64).toBe('SGVsbG8=');
  });
});