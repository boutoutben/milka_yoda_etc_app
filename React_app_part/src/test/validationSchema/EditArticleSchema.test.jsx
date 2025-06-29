import EditArticleSchema from "../../validationSchema/EditArticleSchema";
import titleTest from "./component/titleTest";
import descriptionTest from "./component/descriptionTest"
import fileTest from "./component/fileTest";

describe("EditArticleSchema", () => {
    const validTitle = "Test's title";
    const validDescription = "Test's description who sums up the article in a few sentence";
    const validFile = {name:'test.jpg', size: 600*1024};

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
        expect(EditArticleSchema.validate(data)).resolves.toEqual(data)
    })
})