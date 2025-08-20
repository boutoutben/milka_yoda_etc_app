const { filename } = require("../utils/uploadImg");

function fileTest (data, schema, isRequired = false) {
    if(isRequired){ 
    test("should fail when the file is empty", async () => {
        data.file = null
        expect(schema.validate(data)).rejects.toThrow("L'image est requise.")
    })}

    const validExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
    const invalidExtensions = ["bmp", "svg", "tiff", "exe", "pdf", "txt"];

    test.each(validExtensions)(
        "should pass for valid file extension: %s",
        async (ext) => {
            const file = {
                filename: `test.${ext}`, 
                size: 600 * 1024
            };
            data.file = file

            await expect(schema.validate(data)).resolves.toEqual(data);
        }
    );

    test.each(invalidExtensions)(
        "should fail for invalid file extension: %s",
        async (ext) => {
            const file = {
                filename: `test.${ext}`, 
                size: 600 * 1024
            };
            data.file = file;

            await expect(schema.validate(data)).rejects.toThrow(
                "Votre extension n'est pas correcte, seuls png, jpg, jpeg, gif, webp sont autorisés."
            );
        }
    );
    test("should fail for file too big", () => {
        const file = {
            filename: 'test.jpg',
            size: 800 * 1024
        }
        data.file = file;
        expect(schema.validate(data)).rejects.toThrow("La taille de votre image est trop grande, elle doit être inférieure à 700ko.")
    })
}

module.exports = fileTest;