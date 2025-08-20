function racesTest (data, schema) {
    test("should fails when races is empty", () => {
        data.races = [];
        expect(schema.validate(data)).rejects.toThrow("Il faut au moins une race.")
    });
    test("should succes when races'lenght is equal to 1", () => {
        data.races = ["123"];
        expect(schema.validate(data)).resolves.toEqual(data);
    });
    test("should succes when races'lenght is equal to 6", () => {
        data.races = ["123",'456', '789', '321','654', '987'];
        expect(schema.validate(data)).resolves.toEqual(data);
    });
    test("should fail when there are too races", () => {
        data.races = ["123",'456', '789', '321','654', '987', '357'];
        expect(schema.validate(data)).rejects.toThrow("Un animal peut avoir que 6 race maximum.")
    })
    test("should fail when the string is empty", () => {
        data.races = [""]
        expect(schema.validate(data)).rejects.toThrow("La chaine de caractère ne peut pas être vide.")
    })
    test("should succuss when the array content is a number and convert to string", () => {
        data.races = [123, 456];
        const newData = {
            ...data,
            races: ["123", "456"]
        }
        expect(schema.validate(data)).resolves.toEqual(newData);
    });
    test("should fail when array value is null", () => {
        data.races = [null]
        expect(schema.validate(data)).rejects.toThrow("La chaine de caractère ne peut pas être vide.")
    })
    test("should fail when the array value is a string", () => {
        data.races = ["races1"];
        expect(schema.validate(data)).rejects.toThrow("Chaque race doit être une chaîne numérique.")
    })
}

module.exports = racesTest;