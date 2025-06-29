import AddUpdateAdoptSchema from "../../../validationSchema/AddUpdateAnimalSchema";
import testMatches from "./testMatches";

function nameTest (data, schema) {
    const nameValidValues = [
        "Bonjour",
        "Je suis étudiant",
        "À bientôt !",
        "1234567890",
        "Voici une phrase avec des accents : éèàçôù",
        "Symbole ! ? . , : ; @ # * % / ( )",
        "Ligne 1\nLigne 2\r\nLigne 3",
        "phrase avec 'guillemets' et \"doubles guillemets\"",
        "Espaces    multiples",
    ];

    const nameInvalidValues = [
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
    test("should fail when name is empty", () => {
        data.name = "";
        expect(schema.validate(data)).rejects.toThrow("Le nom de l'animal est requis.")
    });
    test("should fail when name is too short", () => {
        data.name = "uu";
        expect(schema.validate(data)).rejects.toThrow("Le nom doit comporter au moins 3 caractères.")
    })
    test("should success when name's lenght is equal to 3", () => {
        data.name = "uue";
        expect(schema.validate(data)).resolves.toEqual(data)
    });
    test("should success when name's lenght is equal to 50", () => {
        data.name = "4D4LW5tho9caf3rBPGEFJRx3kAteAKKN28ureDJudCucDppYOm";
        expect(schema.validate(data)).resolves.toEqual(data)
    })
    test("should fail when name is too long", () => {
        data.name = "4D4LW5tho9caf3rBPGEFJRx3kAteAKKN28ureDJudCucDppYOmkk";
        expect(schema.validate(data)).rejects.toThrow("Le nombre maximal de caractères du nom est 50.")
    })
    testMatches('name', nameValidValues, nameInvalidValues,AddUpdateAdoptSchema(), data, "Format invalide")
}

export default nameTest;