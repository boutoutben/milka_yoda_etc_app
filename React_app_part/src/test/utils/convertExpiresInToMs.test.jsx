import convertExpiresInToMs from "../../utils/convertExpiresInToMS";

describe("convertExpresInToMs", () => {
    test('converts seconds correctly', () => {
        expect(convertExpiresInToMs('10s')).toBe(10000);
      });
    
      test('converts minutes correctly', () => {
        expect(convertExpiresInToMs('2m')).toBe(120000);
      });
    
      test('converts hours correctly', () => {
        expect(convertExpiresInToMs('1h')).toBe(3600000);
      });
    
      test('converts days correctly', () => {
        expect(convertExpiresInToMs('1d')).toBe(86400000);
      });
    
      test('returns 0 for invalid unit', () => {
        expect(convertExpiresInToMs('5x')).toBe(0);
      });
    
      test('returns 0 for invalid value', () => {
        expect(convertExpiresInToMs('xs')).toBe(0);
      });
})