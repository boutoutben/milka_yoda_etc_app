

function animalTest(data, schema) {
    test("should fail when animal is empty", () => {
        data.animal = null;
        expect(schema.validate(data)).rejects.toThrow("L'animal est requis.");
    });
}

export default animalTest;