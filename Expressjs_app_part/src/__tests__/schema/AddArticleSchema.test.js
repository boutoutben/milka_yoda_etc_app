const AddArticleSchema = require("../../schema/AddArticleSchema");
const descriptionTest = require("../../testComponent/descriptionTest");
const fileTest = require("../../testComponent/fileTest");
const titleTest = require("../../testComponent/titleTest");

describe("AddArticleSchema", () => {
    const validTitle = "Tester le titre";
    const validDescription = "Test la description qui résume l'action principale";
    const validFile = {
        filename: "test.jpg",
        size: 400 * 1024
    };
    titleTest({
        title: validTitle,
        description: validDescription,
        file: validFile
    }, AddArticleSchema);

    descriptionTest({
        title: validTitle,
        description: validDescription,
        file: validFile
    }, AddArticleSchema);

    fileTest({
        title: validTitle,
        description: validDescription,
        file: validFile
    }, AddArticleSchema, true)
})