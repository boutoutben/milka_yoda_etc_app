import AddArticleSchema from "../../validationSchema/AddArticleSchema";
import descriptionTest from "./component/descriptionTest";
import fileTest from "./component/fileTest";
import titleTest from "./component/titleTest"

describe("AddArticleSchema", () => {
    const validTitle = "Tester le titre";
    const validDescription = "Test la description qui résume l'action principale";
    const validFile = {
        name: "test.jpg",
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