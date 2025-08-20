import axios from "axios"
import encryptData from "../../utils/encryptData";

jest.mock('axios')

describe("encryptData", () => {
  test("should encrypt the data", async () => {
    const mockResponse = {
      data: {
        encryptedKey: "test_encrypted_key",
        encryptedData: "test_encrypted_data",
        iv: "test_iv"
      }
    };

    axios.post.mockResolvedValue(mockResponse);

    const result = await encryptData("initial data");

    expect(result).toEqual(mockResponse.data);
  });

  test("should return an error", async () => {
    jest.spyOn(console, "error").mockImplementation()
    axios.post.mockRejectedValue(new Error("mock error"));
    const result = await encryptData("initial data");
    expect(result).toEqual(undefined)
    expect(console.error).toHaveBeenCalledWith("Une erreur est survenue: ", "mock error");
  })
});