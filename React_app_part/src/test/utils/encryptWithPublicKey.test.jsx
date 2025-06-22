import encryptWithPublicKey from "../../utils/encryptWithPublicKey";

const testPemKey = {
    publicKey: `-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArvEORH4Ddq7YDbRP29vj
    1gB+aRtY6L9jHPXqBAqdbf1qN82OS0YNRzrMX+UuWazTrqqMTHZCK9vw3SeBz2B3
    zS7k88vA+6rRNd8RC1dCwnzTGBIfZxC9R1phzDRPE0ej7bnYV6N4ZMH9lzIfM0sl
    8sIbUKvKh7gJ8eNw1+KzW4du8rA9OP4nCuX8qgE4PKmkEmmExPr2JeN1HPnPlcJx
    kno+Y4AN5RxJmfT4jkX/cmhvOEcK8aWdeaiGxytKaO4KhG+ujqz5+4ulr4OH57Fk
    m5HtJdJwE+FCOIpBhjE5dL03YhtPVH19bBzhw2ZcLWLcF8oWybj5HcbOYgbDgk2D
    6wIDAQAB
    -----END PUBLIC KEY-----`
  };

describe("encryptWithPublicKey", () => {
    test('encrypts small JSON data successfully', async () => {
        // Importer ici pour être sûr que le polyfill est en place
        const encryptWithPublicKey = (await import('../../utils/encryptWithPublicKey')).default;
      
        const result = await encryptWithPublicKey({ test: 'Hello!' }, testPemKey);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });

  test("throws an error with invalid key", async () => {
    await expect(
      encryptWithPublicKey({ test: "Hello" }, { publicKey: "INVALID" })
    ).rejects.toThrow();
  });
});