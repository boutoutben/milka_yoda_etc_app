const AddUpdateActionSchema = require("../../schema/AddUpdateActionSchema");
const descriptionTest = require("../../testComponent/descriptionTest");
const fileTest = require("../../testComponent/fileTest");
const testMatches = require("../../testComponent/testMatches");
const titleTest = require("../../testComponent/titleTest");

describe("addUpdateActionSchema", () => {
    const validTitle = "Tester le titre";
    const validDescription = "Test la description qui résume l'action principale";
    const validFile = {
        filename: "test.jpg",
        size: 400 * 1024
    };
    const validePageURL = "test"
   
    // test for title 
    titleTest({
        title: validTitle,
        description: validDescription,
        file: validFile
    }, AddUpdateActionSchema())
        

    // test for description
    
    descriptionTest({
        title: validTitle,
        description: validDescription,
        file: validFile
    }, AddUpdateActionSchema())

    //test for file not required
    fileTest({
        title: validTitle,
        description: validDescription,
        file: validFile
    }, AddUpdateActionSchema(false))

    // test for file required

    fileTest({
        title: validTitle,
        description: validDescription,
        file: validFile
    }, AddUpdateActionSchema(true), true)
    

    // test pageUrl 
    test("should fail when pageUrl too short", () => {
        const data = {
            title: validTitle,
            description: validDescription,
            file: validFile,
            pageUrl: "cc"
        }
        expect(AddUpdateActionSchema().validate(data)).rejects.toThrow("L'url de la page doit comporter au moins 3 caractères.")
    });
    test("should fail when pageUrl's lenght is equal to 3", () => {
        const data = {
            title: validTitle,
            description: validDescription,
            file: validFile,
            pageUrl: "ccr"
        }
        expect(AddUpdateActionSchema().validate(data)).resolves.toEqual(data);
    });
    test("should fail when pageUrl's lenght is equal to 50", () => {
        const data = {
            title: validTitle,
            description: validDescription,
            file: validFile,
            pageUrl: "4D4LW5tho9caf3rBPGEFJRx3kAteAKKN28ureDJudCucDppYOm"
        }
        expect(AddUpdateActionSchema().validate(data)).resolves.toEqual(data);
    });
    test("should fail when pageUrl too long", () => {
        const data = {
            title: validTitle,
            description: validDescription,
            file: validFile,
            pageUrl: "4D4LW5tho9caf3rBPGEFJRx3kAteAKKN28ureDJudCucDppYOmff"
        }
        expect(AddUpdateActionSchema().validate(data)).rejects.toThrow("L'url de la page doit comporter au plus 50 caractères.")
    });

    const pageUrlValidValues = [
        "Bonjour",
        "Je suis étudiant",
        "À bientôt !",
        "1234567890",
        "Voici une phrase avec des accents : éèàçôù",
        "Symbole ! ? . , : ; @ # ? * / ( )",
        "Ligne 1\nLigne 2\r\nLigne 3",
        "phrase avec 'guillemets' et \"doubles guillemets\"",
        "Espaces    multiples",
    ];

    const pageUrlInvalidValues = [
        { value: "Hello 😊", reason: "emoji" },
        { value: "Cœur ❤️", reason: "symbole unicode" },
        { value: "<script>", reason: "chevrons < >" },
        { value: "€100", reason: "symbole euro" },
        { value: "Mot—mot", reason: "tiret long —" },
        { value: "z中文", reason: "caractères chinois" },
        { value: "русский", reason: "alphabet cyrillique" },
        { value: "مرحبا", reason: "alphabet arabe" },
        { value: "© Copyright", reason: "symbole ©" },
    ];

    testMatches(
        "pageUrl",
        pageUrlValidValues,
        pageUrlInvalidValues,
        AddUpdateActionSchema(),
        {
            title: validTitle,
            description: validDescription,
            file: validFile,
        },
        "Format invalide"
    );

    test("should success wiht all value right", () => {
        const data = {
            title: validTitle,
            description: validDescription,
            file: validFile,
            pageUrl: validePageURL
        }
        expect(AddUpdateActionSchema().validate(data)).resolves.toEqual(data)
    })
})