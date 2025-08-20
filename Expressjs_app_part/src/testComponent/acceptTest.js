function acceptTest (data, schema) {
    test("should fails when accept is false", () => {
        data.accept = false;
        expect(schema.validate(data)).rejects.toThrow("Vous devez accepter la condition.")
    })
    test("should success when accept is true", () => {
        data.accept = true;
        expect(schema.validate(data)).resolves.toEqual(data);
    })
}

module.exports = acceptTest;