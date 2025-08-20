const registerSchema = require("../../schema/RegisterSchema");
const acceptTest = require("../../testComponent/acceptTest");
const emailTest = require("../../testComponent/emailTest");
const firstnameTest = require("../../testComponent/firstnameTest");
const lastnameTest = require("../../testComponent/lastnameTest");
const passwordTest = require("../../testComponent/passwordTest");
const phoneTest = require("../../testComponent/phoneTest");


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