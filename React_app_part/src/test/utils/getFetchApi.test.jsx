import axios from "axios";
import getFetchApi from "../../utils/getFetchApi";

jest.mock("axios");

describe("getFetchApi", () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
    test("should return data whihout", async () => {
        const mockData = {
            test: {
              id: "1",
              name: "test1",
            },
          };
      
          axios.get.mockResolvedValue({ data: mockData });
      
          const result = await getFetchApi("test");
      
          expect(result).toEqual(mockData);
    });
    test("should forward custom options to axios.get", async () => {
        const customOptions = {
          headers: {
            Authorization: "Bearer 12345",
          },
          timeout: 10000, // override default timeout
        };
    
        const mockResponse = {
          data: {
            success: true,
          },
        };
    
        axios.get.mockResolvedValue(mockResponse);
    
        const result = await getFetchApi("test", customOptions);
    
        expect(result).toEqual(mockResponse.data);
    
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining("/test"),
          expect.objectContaining({
            headers: {
              Authorization: "Bearer 12345",
            },
            timeout: 10000,
            withCredentials: true, // must still be present
          })
        );
      });
      test("should throw an error with server message", async () => {
        axios.get.mockRejectedValue({
          response: {
            data: { message: "server side error" },
            status: 500
          }
        });
    
        await expect(getFetchApi("test")).rejects.toThrow("server side error");
      });
    
      test("should throw error when nothing was sent", async () => {
        axios.get.mockRejectedValue({
          request: {}, // typical shape when request was made but no response
          message: "Nothing send"
        });
    
        await expect(getFetchApi("test")).rejects.toThrow("Nothing send");
      });
    
      test("should throw a generic server error", async () => {
        axios.get.mockRejectedValue(new Error("Server error"));
    
        await expect(getFetchApi("test")).rejects.toThrow("Server error");
      });
    });
