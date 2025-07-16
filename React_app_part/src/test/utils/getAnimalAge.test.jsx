import getAnimalAge from "../../utils/getAnimalAge"

describe("getAnimalAge", () => {
    const today = new Date();
    beforeEach(() => {
        jest.clearAllMocks()
    })
    test("should return the correct age in month", () => {
        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const result = getAnimalAge(sixMonthsAgo);
        expect(result).toEqual("6 mois");
    });
    test("should return the correct age in month with 18 months", () => {
        const eighteenMonthsAgo = new Date(today);
        eighteenMonthsAgo.setMonth(eighteenMonthsAgo.getMonth() - 18);
        const result2 = getAnimalAge(eighteenMonthsAgo);
        expect(result2).toEqual("18 mois");
    });

    test("should return the correct age in year", () => {
        const twoYear = new Date(today);
        twoYear.setYear(twoYear.getFullYear() - 2);
        const result2 = getAnimalAge(twoYear);
        expect(result2).toEqual("2 an(s)");
    });
});