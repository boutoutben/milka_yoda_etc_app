function isSterileTest (data, schema) {
    test("should fails when isSterile is empty", () => {
        data.isSterile = null;
        expect(schema.validate(data)).rejects.toThrow("La sterilité est requise.")
    })
}

module.exports = isSterileTest;