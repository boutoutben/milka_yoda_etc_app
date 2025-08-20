const EditArticleSchema = require("../../schema/EditArticleSchema");
const descriptionTest = require("../../testComponent/descriptionTest");
const fileTest = require("../../testComponent/fileTest");
const titleTest = require("../../testComponent/titleTest");

describe("EditArticleSchema", () => {
    const validTitle = "Test's title";
    const validDescription = "Test's description who sums up the article in a few sentence";
    const validFile = {filename:'test.jpg', size: 600*1024};

    titleTest({
        title: validTitle,
        description: validDescription,
        file: validFile
    }, EditArticleSchema);
    descriptionTest({
        title: validTitle,
        description: validDescription,
        file: validFile
    }, EditArticleSchema);
    fileTest({
        title: validTitle,
        description: validDescription,
        file: validFile
    }, EditArticleSchema);

    test("should success when all valid value is set", () => {
        const data = {
            title: validTitle,
            description: validDescription,
            file: validFile
        };
        expect(EditArticleSchema.validate(data)).resolves.toEqual(data);
    })
})