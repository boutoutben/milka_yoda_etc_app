import resetPasswordSchema from "../../validationSchema/resetPasswordSchema";
import passwordTest from "./component/passwordTest";

describe("resetPasswordSchema", () => {
    const validPassword = "Password123!";
    const validConfirmPassword = "Password123!";

    passwordTest({
        password: validPassword,
        confirmPassword: validConfirmPassword
    }, resetPasswordSchema, true);
})