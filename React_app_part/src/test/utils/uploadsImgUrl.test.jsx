import uploadsImgUrl from "../../utils/uploadsImgUrl"

describe("uploadsImgUrl", () => {
    test("should return the path", async () => {
        const result = await uploadsImgUrl("test");
        expect(result).toEqual("http://localhost:5000/uploads/test")
    })
})