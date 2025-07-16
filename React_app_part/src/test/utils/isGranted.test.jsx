import getFetchApi from "../../utils/getFetchApi";
import isGranted from "../../utils/isGranted";

jest.mock("../../utils/getFetchApi.jsx");

describe("isGranted", () => {
  beforeEach(() => {
    Storage.prototype.getItem = jest.fn();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should return true", async () => {
    localStorage.getItem.mockReturnValue("fake-token");
    getFetchApi.mockResolvedValue({ role: [{ roleName: "ADMIN_ROLE" }], ok:true });

    const result = await isGranted("ADMIN_ROLE");
    expect(result).toEqual(true);
  });

  test("should return false", async () => {
    localStorage.getItem.mockReturnValue("fake-token");
    getFetchApi.mockResolvedValue({ role: [{ rolename: "ADMIN_ROLE" }] });

    const result = await isGranted("USER_ROLE");
    expect(result).toEqual(false);
  });

  test("should return false is token is null or undefined", async () => {
    localStorage.getItem.mockReturnValue("null");
    getFetchApi.mockResolvedValue({ role: [{ rolename: "ADMIN_ROLE" }] });
    const result = await isGranted("USER_ROLE");
    expect(result).toEqual(false);

    localStorage.getItem.mockReturnValue("undefined");
    getFetchApi.mockResolvedValue({ role: [{ rolename: "ADMIN_ROLE" }] });

    const result2 = await isGranted("USER_ROLE");
    expect(result2).toEqual(false);
  })

  test("should return false and log error on exception", async () => {
    localStorage.getItem.mockImplementation(() => {
      throw new Error("Mock error");
    });

    const result = await isGranted("USER_ROLE");

    expect(console.error).toHaveBeenCalledWith("Erreur dans isGranted :", "Mock error");
    expect(result).toEqual(false);
  });
});