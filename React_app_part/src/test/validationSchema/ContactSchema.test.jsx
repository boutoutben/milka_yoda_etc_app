import ContactSchema from "../../validationSchema/ContactSchema";
import emailTest from "./component/emailTest";
import firstnameTest from "./component/firstnameTest";
import lastnameTest from "./component/lastnameTest";
import phoneTest from "./component/phoneTest";
import testMatches from "./component/testMatches";

describe("ContactSchema", () => {
    const validLastname = "Dupond";
    const validFirstname = "Bob";
    const validEmail = "test@example.com";
    const validPhone = "0600000000";
    const validSubject = "Test'subject";
    const validMessage = "The message is the description of what you need";

    lastnameTest({
        lastname: validLastname,
        firstname: validFirstname,
        email: validEmail,
        phone: validPhone,
        subject: validSubject,
        message: validMessage
    }, ContactSchema);

    firstnameTest({
        lastname: validLastname,
        firstname: validFirstname,
        email: validEmail,
        phone: validPhone,
        subject: validSubject,
        message: validMessage
    }, ContactSchema);

    emailTest({
        lastname: validLastname,
        firstname: validFirstname,
        email: validEmail,
        phone: validPhone,
        subject: validSubject,
        message: validMessage
    }, ContactSchema);

    phoneTest({
        lastname: validLastname,
        firstname: validFirstname,
        email: validEmail,
        phone: validPhone,
        subject: validSubject,
        message: validMessage
    }, ContactSchema);

    //test subject 
    test("should fail when sujet is empty", () => {
        const data = {
            lastname: validLastname,
            firstname: validFirstname,
            email: validEmail,
            phone: validPhone,
            subject: "",
            message: validMessage
        }
        expect(ContactSchema.validate(data)).rejects.toThrow("Le sujet est requis.");
    });
    test("should fail when sujet'lenght is too short", () => {
        const data = {
            lastname: validLastname,
            firstname: validFirstname,
            email: validEmail,
            phone: validPhone,
            subject: "ee",
            message: validMessage
        }
        expect(ContactSchema.validate(data)).rejects.toThrow("Le sujet doit contenir au moins 5 caractères.");
    });
    test("should success when sujet'lenght is equal to 5", () => {
        const data = {
            lastname: validLastname,
            firstname: validFirstname,
            email: validEmail,
            phone: validPhone,
            subject: "eeeee",
            message: validMessage
        }
        expect(ContactSchema.validate(data)).resolves.toEqual(data);
    });
    test("should success when sujet'lenght is equal to 100", () => {
        const data = {
            lastname: validLastname,
            firstname: validFirstname,
            email: validEmail,
            phone: validPhone,
            subject: "e".repeat(100),
            message: validMessage
        }
        expect(ContactSchema.validate(data)).resolves.toEqual(data);
    });
    test("should fail when sujet'lenght is too long", () => {
        const data = {
            lastname: validLastname,
            firstname: validFirstname,
            email: validEmail,
            phone: validPhone,
            subject: "e".repeat(101),
            message: validMessage
        }
        expect(ContactSchema.validate(data)).rejects.toThrow("Le sujet ne doit pas dépasser 100 caractères.");
    });
    const validSubjects = [
        "Bonjour, comment allez-vous ?",
        "C'est motivant !",
        "Motivation 123 avec ponctuation.",
        "Utilisation de () et - et ' \"",
        "Avec des accents : éèàùç"
      ];

    const invalidSubjects = [
        { value: "Emoji 💖", reason: "Emoji non autorisé" },
        { value: "Symbole €", reason: "Symbole euro non autorisé" },
        { value: "Chevron <script>", reason: "Caractères < et > non autorisés" },
        { value: "Backtick `", reason: "Backtick non autorisé" },
        { value: "Tilde ~", reason: "Tilde non autorisé" },
        { value: "Slash /", reason: "Slash non autorisé" },
        { value: "Accolade {}", reason: "Accolades { } non autorisées" }
      ];

      testMatches("subject", validSubjects, invalidSubjects, ContactSchema, {
        lastname: validLastname,
        firstname: validFirstname,
        email: validEmail,
        phone: validPhone,
        subject: "e".repeat(101),
        message: validMessage
    }, "Le sujet contient des caractères non autorisés." );

    //test message 
    test("should fail when message is empty", () => {
        const data = {
            lastname: validLastname,
            firstname: validFirstname,
            email: validEmail,
            phone: validPhone,
            subject: validSubject,
            message: ''
        }
        expect(ContactSchema.validate(data)).rejects.toThrow("Le message est requis.");
    });
    test("should fail when message'lenght is too short", () => {
        const data = {
            lastname: validLastname,
            firstname: validFirstname,
            email: validEmail,
            phone: validPhone,
            subject: validSubject,
            message: "ee"
        }
        expect(ContactSchema.validate(data)).rejects.toThrow("Le message doit contenir au moins 10 caractères");
    });
    test("should success when message'lenght is equal to 10", () => {
        const data = {
            lastname: validLastname,
            firstname: validFirstname,
            email: validEmail,
            phone: validPhone,
            subject: validSubject,
            message: "e".repeat(10)
        }
        expect(ContactSchema.validate(data)).resolves.toEqual(data);
    });
    test("should success when message'lenght is equal to 1000", () => {
        const data = {
            lastname: validLastname,
            firstname: validFirstname,
            email: validEmail,
            phone: validPhone,
            subject: validSubject,
            message: "e".repeat(1000)
        }
        expect(ContactSchema.validate(data)).resolves.toEqual(data);
    });
    test("should fail when message'lenght is too long", () => {
        const data = {
            lastname: validLastname,
            firstname: validFirstname,
            email: validEmail,
            phone: validPhone,
            subject: validSubject,
            message: "e".repeat(1001)
        }
        expect(ContactSchema.validate(data)).rejects.toThrow("Le message ne doit pas dépasser 1000 caractères.");
    });

    const validMessages = [
        "Bonjour rrrr",
        "Avec des accents : éèàùç",
        "Hello world!",
        "Test (exemple)",
        "C'est une phrase.",
        "Question : pourquoi ?",
        "Exemple ; avec point-virgule",
        "Chiffres 123456",
        "Ponctuation mixte : .,!?\"'()-;"
      ];

    const invalidMessages = [
        { value: "Emoji 💖 rrr", reason: "Emoji non autorisé" },
        { value: "Symbole € rrr", reason: "Symbole euro interdit" },
        { value: "Chevron <script>", reason: "Chevrons < > interdits" },
        { value: "Backtick `", reason: "Backtick non autorisé" },
        { value: "Tilde ~ rrrr", reason: "Tilde interdit" },
        { value: "Slash / rrr", reason: "Slash interdit" },
        { value: "Accolade {}", reason: "Accolades interdites" },
        { value: "Crochet []", reason: "Crochets interdits" },
        { value: "Anti-slash \\", reason: "Anti-slash interdit" },
      ];

      testMatches("message", validMessages, invalidMessages, ContactSchema, {
        lastname: validLastname,
        firstname: validFirstname,
        email: validEmail,
        phone: validPhone,
        subject: validSubject,
        message: "e".repeat(1001)
    }, "Le message contient des caractères non autorisés.")
})