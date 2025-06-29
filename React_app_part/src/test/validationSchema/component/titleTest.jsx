import testMatches from "./testMatches";

function titleTest (data, schema) {
    const titleValidValues = [
        "Bonjour",
        "Je suis étudiant",
        "À bientôt !",
        "1234567890",
        "Voici une phrase avec des accents : éèàçôù",
        "Symbole ! ? . , : ; @ # * ? / ( )",
        "Ligne 1\nLigne 2\r\nLigne 3",
        "phrase avec 'guillemets' et \"doubles guillemets\"",
        "Espaces    multiples",
    ];

    const titleInvalidValues = [
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

    test("should fail when title is empty", async () => {
        data.title = ''

        expect(schema.validate(data)).rejects.toThrow("Le titre est requis.")
    });
    test("should fail when title is too short", async () => {
        data.title = "er"
        expect(schema.validate(data)).rejects.toThrow("Le titre doit comporter au moins 3 caractères.")
    });

    test("should success when title's lenght is equal to 3", async () => {
        data.title = "ere"
        expect(schema.validate(data)).resolves.toEqual(data)
    });
    test("should success when title's lenght is equal to 50", async () => {
        data.title = "dnmfigpftvmjxqtfipwgerclmuccbusujqwmganuxyijqvrccz"
        expect(schema.validate(data)).resolves.toEqual(data)
    });
    test("should success when title's lenght is too long", async () => {
        data.title = "dnmfigpftvmjxqtfipwgerclmuccbusujqwmganuxyijqvrcczreuzi"
        expect(schema.validate(data)).rejects.toThrow("Le nombre maximal de caractères du titre est 50.")
    });


    testMatches(
        "title",
        titleValidValues,
        titleInvalidValues,
        schema,
        data,
        "Format invalide"
    );  
}

export default titleTest;
