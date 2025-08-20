const testMatches = require("./testMatches");

function firstnameTest (data, schema) {
    const validFirstNames = [
        'Jean',
        'Jean-Paul',
        'Jean Paul',
        "Léo d’Arc",
        "Émilie",
        "Àlex",
        "O’Connor",
        "Jean-Marc",
        "Jean de la Fontaine"
      ];
    
      const invalidFirstNames = [
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
        { value: "Jean-’Paul", reason: "ordre incorrect des caractères" },
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
      test("should fails when firstname is empty", () => {
        data.firstname = "";
        expect(schema.validate(data)).rejects.toThrow("Le prénom est requis.")
    });
    test("should fails when firstname is too short", () => {
        data.firstname = "E";
        expect(schema.validate(data)).rejects.toThrow("Le prénom doit comporter au moins 2 caractères.")
    });
    test("should success when firstname'lenght is equal to 2", () => {
        data.firstname = "Rd";
        expect(schema.validate(data)).resolves.toEqual(data);
    })
    test("should success when firstname'lenght is equal to 50", () => {
        data.firstname = "Buheeqkaqshhcatebddovhpflrpoaewywzvrccpztjcqtdvywj";
        expect(schema.validate(data)).resolves.toEqual(data);
    })
    test("should fails when firstname is too long", () => {
        data.firstname = "Bduheeqkaqshhcatebddovhpflrpoaewywzvrccpztjcqtdvywj";
        expect(schema.validate(data)).rejects.toThrow("Le nombre maximal de caractères du prénom est 50.")
    });
    testMatches("firstname", validFirstNames, invalidFirstNames, schema, data, "Format invalide : ex. Jean ou Marie-Thérèse")
}

module.exports = firstnameTest;