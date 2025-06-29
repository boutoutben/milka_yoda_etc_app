function sexeTest (data, schema) {
    test("should fails when sexe is empty", () => {
        data.sexe = null;
        expect(schema.validate(data)).rejects.toThrow("Le sexe est requis.")
    })
}

export default sexeTest;