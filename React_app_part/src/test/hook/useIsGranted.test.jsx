import { renderHook, waitFor } from "@testing-library/react";
import useIsGrandted from "../../hook/useIsgranted"
import isGranted from "../../utils/isGranted";

jest.mock("../../utils/isGranted")

describe("useIsGranted", () => {
    test("should return true when isGranted return true", async () => {
        isGranted.mockResolvedValue(true);
        const {result} = renderHook(() => useIsGrandted("MOCK_ROLE"));
        await waitFor(() => {
            expect(result.current).toBe(true)
        })
    })
    test("should renturn false when isGranted return false", async () => {
        isGranted.mockResolvedValue(false);
        const {result} = renderHook(() => useIsGrandted("MOCK_ROLE"));
        await waitFor(() => {
            expect(result.current).toBe(false);
        })
    })
})