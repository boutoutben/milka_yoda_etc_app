function bornTest (data, schema) {
    test("should fails when born is empty", () => {
        data.born = null;
        expect(schema.validate(data)).rejects.toThrow("La date est requise.")
    });
    test("should fail when born is in the future", async () => {
        data.born = new Date(Date.now() + 60 * 1000 * 60 * 24); // demain
        await expect(schema.validate(data)).rejects.toThrow("La date de naissance doit être inférieur ou égal à aujourd'hui");
    })
    test("should succeed when born is today", async () => {
        data.born = new Date();
        await expect(schema.validate(data)).resolves.toEqual(data);
    });
}

export default bornTest;