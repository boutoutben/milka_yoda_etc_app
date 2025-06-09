const { hashPassword } = require("../../utils/hashPassword");
const bcrypt = require("bcrypt");

describe("hashPassword", () => {
    it("Should hash the password and not return the original", () => {
        const plainPassword = "Test123!";
        const hashedPassword = hashPassword(plainPassword);
        expect(hashedPassword).not.toBe(plainPassword);
        expect(typeof hashedPassword).toBe("string");
    })
    it("should hash the password correctly and match with bcrypt.compareSync", () => {
        const plainPassword = "mySecret123";
        const hashedPassword = hashPassword(plainPassword);
    
        const isMatch = bcrypt.compareSync(plainPassword, hashedPassword);
        expect(isMatch).toBe(true);
      });
});