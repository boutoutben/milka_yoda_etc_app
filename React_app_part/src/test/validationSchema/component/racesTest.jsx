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
}

export default racesTest;