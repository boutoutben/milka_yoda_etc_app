const UserInfoSchema = require("../../schema/UserInfoSchema");
const adressePostaleTest = require("../../testComponent/adressePostaleTest");
const ageTest = require("../../testComponent/ageTest");
const civilityTest = require("../../testComponent/civilityTest");
const emailTest = require("../../testComponent/emailTest");
const firstnameTest = require("../../testComponent/firstnameTest");
const lastnameTest = require("../../testComponent/lastnameTest");
const phoneTest = require("../../testComponent/phoneTest");


describe("UserInfoSchema", () => {
    const validCivility = "1";
    const validLastname = "Dupond";
    const validFirstname = "Bog";
    const validAge = 18;
    const validEmail = "test@example.com";
    const validPhone = '0600000000';
    const validAdressePostale = '59000';

    civilityTest({
        civility: validCivility,
        lastname: validLastname,
        firstname: validFirstname,
        age: validAge,
        email: validEmail,
        phone: validPhone,
        adressePostale: validAdressePostale
    }, UserInfoSchema);

    lastnameTest({
        civility: validCivility,
        lastname: validLastname,
        firstname: validFirstname,
        age: validAge,
        email: validEmail,
        phone: validPhone,
        adressePostale: validAdressePostale
    }, UserInfoSchema);

    firstnameTest({
        civility: validCivility,
        lastname: validLastname,
        firstname: validFirstname,
        age: validAge,
        email: validEmail,
        phone: validPhone,
        adressePostale: validAdressePostale
    }, UserInfoSchema);

    ageTest({
        civility: validCivility,
        lastname: validLastname,
        firstname: validFirstname,
        age: validAge,
        email: validEmail,
        phone: validPhone,
        adressePostale: validAdressePostale
    }, UserInfoSchema);

    emailTest({
        civility: validCivility,
        lastname: validLastname,
        firstname: validFirstname,
        age: validAge,
        email: validEmail,
        phone: validPhone,
        adressePostale: validAdressePostale
    }, UserInfoSchema);

    phoneTest({
        civility: validCivility,
        lastname: validLastname,
        firstname: validFirstname,
        age: validAge,
        email: validEmail,
        phone: validPhone,
        adressePostale: validAdressePostale
    }, UserInfoSchema);

    adressePostaleTest({
        civility: validCivility,
        lastname: validLastname,
        firstname: validFirstname,
        age: validAge,
        email: validEmail,
        phone: validPhone,
        adressePostale: validAdressePostale
    }, UserInfoSchema);

    test("should success when all value is valid", () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale
        };
        expect(UserInfoSchema.validate(data)).resolves.toEqual(data);
    })
})