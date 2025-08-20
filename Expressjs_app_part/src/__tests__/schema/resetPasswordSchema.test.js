const resetPasswordSchema = require("../../schema/resetPasswordSchema");
const passwordTest = require("../../testComponent/passwordTest");


describe("resetPasswordSchema", () => {
    const validPassword = "Password123!";
    const validConfirmPassword = "Password123!";

    passwordTest({
        password: validPassword,
        confirmPassword: validConfirmPassword
    }, resetPasswordSchema, true);
})