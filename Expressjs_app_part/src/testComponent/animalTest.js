const testMatches = require("./testMatches");


function animalTest(data, schema) {
    test("should fail when animal is empty", () => {
        data.animal = null;
        expect(schema.validate(data)).rejects.toThrow("L'animal est requis.");
    });
    test("should fail when animal is too short", () => {
        data.animal = "uu";
        expect(schema.validate(data)).rejects.toThrow("L'animal doit comporter au moins 3 caractères.")
    })
    test("should success when animal's lenght is equal to 3", () => {
        data.animal = "uue";
        expect(schema.validate(data)).resolves.toEqual(data)
    });
    test("should success when animal's lenght is equal to 20", () => {
        data.animal = "sfzeshyfbvaysybarheg";
        expect(schema.validate(data)).resolves.toEqual(data)
    })
    test("should fail when animal is too long", () => {
        data.animal = "sfzeshyfbvaysybarhegee";
        expect(schema.validate(data)).rejects.toThrow("L'animal doit comporter au maximum 20 caractères.")
    })

    const animalSpeciesValidValues = [
        "Chien",
        "Chat",
        "Cheval",
        "Âne",
        "Lapin",
        "Cochon d'Inde", // Invalid due to apostrophe — see note below
        "Perroquet",
        "Tortue",
        "Hamster",
        "Canari",
        "Singe-araignée",
        "Chèvre",
        "Écureuil"
    ];
    const animalSpeciesInvalidFormatValues = [
  {
    value: "Ch1en",
    reason: "contains digits"
  },
  {
    value: "Chien!",
    reason: "contains punctuation"
  },
  {
    value: "Poisson🐟",
    reason: "contains emoji"
  },
  {
    value: "Tortue❤️",
    reason: "contains unicode heart symbol"
  },
  {
    value: "Oiseau@maison",
    reason: "contains symbol (@)"
  },
  {
    value: "كلب",
    reason: "non-Latin alphabet (Arabic)"
  },
  {
    value: "<chat>",
    reason: "contains HTML-like angle brackets"
  },
];
    testMatches(
        "animal",
        animalSpeciesValidValues,
        animalSpeciesInvalidFormatValues,
        schema,
        data,
        "Format invalide"
    );  
}

module.exports = animalTest;