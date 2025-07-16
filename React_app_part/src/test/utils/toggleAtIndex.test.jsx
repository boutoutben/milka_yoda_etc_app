import toggleAtIndex from "../../utils/toggleAtIndex";

describe('toggleAtIndex', () => {
    it('should toggle the value at the specified index', () => {
        const mockSetArray = jest.fn();
        const initialArray = [false, true, false];

        toggleAtIndex(initialArray, mockSetArray, 1);

        expect(mockSetArray).toHaveBeenCalledWith([false, false, false]);
    });

    it('should toggle correctly at index 0', () => {
        const mockSetArray = jest.fn();
        const initialArray = [true, false, true];

        toggleAtIndex(initialArray, mockSetArray, 0);

        expect(mockSetArray).toHaveBeenCalledWith([false, false, true]);
    });

    it('should toggle correctly at last index', () => {
        const mockSetArray = jest.fn();
        const initialArray = [false, false, true];

        toggleAtIndex(initialArray, mockSetArray, 2);

        expect(mockSetArray).toHaveBeenCalledWith([false, false, false]);
    });
});