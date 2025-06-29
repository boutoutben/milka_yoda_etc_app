import registerSchema from "../../validationSchema/RegisterSchema";
import acceptTest from "./component/acceptTest";
import emailTest from "./component/emailTest";
import firstnameTest from "./component/firstnameTest";
import lastnameTest from "./component/lastnameTest"
import passwordTest from "./component/passwordTest";
import phoneTest from "./component/phoneTest";

describe("RegisterSchema", () => {
    const validLastname = "Dupond";
    const validFirstname = "Bil";
    const validEmail = "test@example.com";
    const validPhone = "0600000000";
    const validPassword = "Password123!";
    const validConfirmPassword = "Password123!";
    const validAccept = true;

    lastnameTest({
        lastname: validLastname,
        firstname: validFirstname,
        email: validEmail,
        phone: validPhone,
        password: validPassword,
        confirmPassword: validConfirmPassword,
        accept: validAccept
    }, registerSchema);
    firstnameTest({
        lastname: validLastname,
        firstname: validFirstname,
        email: validEmail,
        phone: validPhone,
        password: validPassword,
        confirmPassword: validConfirmPassword,
        accept: validAccept
    }, registerSchema);

    emailTest({
        lastname: validLastname,
        firstname: validFirstname,
        email: validEmail,
        phone: validPhone,
        password: validPassword,
        confirmPassword: validConfirmPassword,
        accept: validAccept
    }, registerSchema);
    phoneTest({
        lastname: validLastname,
        firstname: validFirstname,
        email: validEmail,
        phone: validPhone,
        password: validPassword,
        confirmPassword: validConfirmPassword,
        accept: validAccept
    }, registerSchema);

    passwordTest({
        lastname: validLastname,
        firstname: validFirstname,
        email: validEmail,
        phone: validPhone,
        password: validPassword,
        confirmPassword: validConfirmPassword,
        accept: validAccept
    }, registerSchema, true);
    acceptTest({
        lastname: validLastname,
        firstname: validFirstname,
        email: validEmail,
        phone: validPhone,
        password: validPassword,
        confirmPassword: validConfirmPassword,
        accept: validAccept
    }, registerSchema);

    test("should success when all value is valid", () => {
        const data = {
            lastname: validLastname,
            firstname: validFirstname,
            email: validEmail,
            phone: validPhone,
            password: validPassword,
            confirmPassword: validConfirmPassword,
            accept: validAccept
        }
        expect(registerSchema.validate(data)).resolves.toEqual(data);
    })
})