import { renderHook, waitFor } from "@testing-library/react";
import getFetchApi from "../../utils/getFetchApi"
import useGetPublicKey from "../../hook/useGetPublicKey";

jest.mock("../../utils/getFetchApi.jsx")

describe("useGetPublicKey", () => {
    test("should return the public key", async () => {
        getFetchApi.mockResolvedValue("mock key");
        const {result} = renderHook(() => useGetPublicKey());
        await waitFor(() => {
            expect(result.current).toEqual("mock key")
        })
    })
    test("should return null and an error", async () => {
        getFetchApi.mockRejectedValue(new Error("Mock error"));
        jest.spyOn(console, "error").mockImplementation(() => {})
        const {result} = renderHook(() => useGetPublicKey());
        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith("Une erreur est survenue:", "Mock error")
            expect(result.current).toEqual(null)
        })
    })
})