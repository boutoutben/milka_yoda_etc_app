function civilityTest (data, schema) {
    const validCivilities = ["1","2","3"]

    test("should fails when civility is empty", () => {
        data.civility = null;
        expect(schema.validate(data)).rejects.toThrow("La civilité est requise.")
    });
    test("should fails when civility is invalid", () => {
        data.civility = '4';
        expect(schema.validate(data)).rejects.toThrow("Civilité invalide.")
    });
    test.each(validCivilities.map(value => ({ value })))(`Should success when civility is equal to: %p`, ({value}) => {
        data.civility = value;
        expect(schema.validate(data)).resolves.toEqual(data);
    })
}

export default civilityTest;