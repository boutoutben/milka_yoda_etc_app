import testMatches from "./testMatches";

function lastnameTest (data, schema) {
    const nameValidValues = [
        "Jean",
        "Jean-Paul",
        "Jean Paul",
        "Jean-Marc Dupont",
        "Émilie Du Châtelet",
        "O’Connor",
        "Léo d’Arc",
        "Àlex Brûlé",
        "D’Artagnan",
        "Mac’Intyre",
      ];
      const nameInvalidValues = [
        { value: "jean", reason: "commence par une minuscule" },
        { value: "Jean paul", reason: "2e mot commence par une minuscule" },
        { value: "Jean123", reason: "contient des chiffres" },
        { value: "Jean_Paul", reason: "underscore non autorisé" },
        { value: "Jean*Paul", reason: "symbole non autorisé" },
        { value: "Jean  Paul", reason: "double espace" },
        { value: " Jean", reason: "espace en début" },
        { value: "Jean ", reason: "espace en fin" },
        { value: "Jean--Paul", reason: "double tiret" },
        { value: "Jean''Paul", reason: "double apostrophe" },
        { value: "Jean-'Paul", reason: "ordre incorrect des caractères" },
        { value: "Jean-", reason: "tiret final invalide" },
        { value: "Éric ❤️", reason: "symbole unicode/emoji" },
        { value: "Jean © Dupont", reason: "symbole © interdit" },
        { value: "Jean—Paul", reason: "tiret long (em dash) non autorisé" },
        { value: "Jean <Paul>", reason: "chevrons non autorisés" },
        { value: "Jean%Paul", reason: "symbole % interdit" },
        { value: "Jean €uro", reason: "symbole euro interdit" },
        { value: "Jean 中文", reason: "caractères chinois" },
        { value: "Jean русский", reason: "alphabet cyrillique" },
        { value: "Jean مرحبا", reason: "alphabet arabe" },
      ];

    test("should fails when lastname is empty", () => {
        data.lastname = "";
        expect(schema.validate(data)).rejects.toThrow("Le nom est requis.")
    });
    test("should fails when lastname is too short", () => {
        data.lastname = "E";
        expect(schema.validate(data)).rejects.toThrow("Le nom doit comporter au moins 3 caractères.")
    });
    test("should success when lastname'lenght is equal to 3", () => {
        data.lastname = "Rdf";
        expect(schema.validate(data)).resolves.toEqual(data);
    })
    test("should success when lastname'lenght is equal to 50", () => {
        data.lastname = "Buheeqkaqshhcatebddovhpflrpoaewywzvrccpztjcqtdvywj";
        expect(schema.validate(data)).resolves.toEqual(data);
    })
    test("should fails when lastname is too long", () => {
        data.lastname = "Bduheeqkaqshhcatebddovhpflrpoaewywzvrccpztjcqtdvywj";
        expect(schema.validate(data)).rejects.toThrow("Le nombre maximal de caractères du nom est 50.")
    });
    testMatches("lastname", nameValidValues, nameInvalidValues, schema, data, "Format invalide : ex. Dupont ou Legrand-Duval")
}

export default lastnameTest;