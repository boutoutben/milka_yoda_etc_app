import testMatches from "./testMatches";

const descriptionValidValues = [
    "Ceci est une description parfaitement valide avec plus de trente caractères.",
    "Texte long avec accents : éèàçôù et ponctuation ! ? % : ; @ # * /",
    "Une ligne.\nUne autre ligne.\r\nEncore une ligne.",
    "Des mots avec 'guillemets' et \"doubles guillemets\" inclus.",
    "Beaucoup         d'espaces        et c'est toujours bon.",
];
const descriptionInvalidFormatValues = [
    {
        value: "Voici une description longue avec un emoji 😊 qui ne devrait pas passer.",
        reason: "emoji"
    },
    {
        value: "Un long texte avec un cœur ❤️ inséré au milieu, ce qui est interdit.",
        reason: "symbole unicode"
    },
    {
        value: "Contenu avec balise HTML comme <script>malicious()</script> interdit.",
        reason: "balise HTML"
    },
    {
        value: "Montant à régler : €150 avec TVA incluse, ce qui est invalide ici.",
        reason: "symbole euro"
    },
    {
        value: "Ce texte contient le symbole © dans une description assez longue.",
        reason: "©"
    },
    {
        value: "Ceci est une phrase en русский язык, donc en alphabet cyrillique.",
        reason: "alphabet cyrillique"
    },
    {
        value: "Voici une phrase en اللغة العربية qui ne devrait pas être acceptée.",
        reason: "alphabet arabe"
    },
];

function descriptionTest (data, schema) {
    test("should fail when description is empty", async () => {
        data.description = ""
        expect(schema.validate(data)).rejects.toThrow("La description est requis.")
    });

    test("should fail when description is too short", async () => {
        data.description = "kjfkmsdfj mklsjdfm jdf"
        expect(schema.validate(data)).rejects.toThrow("La description doit comporter au moins 30 caractères.")
    });
    test("should sucees when description's lenght equal to 30", async () => {
        data.description = "rgfggywgnsnxpntaxbwnhzrtwqxkck";
        expect(schema.validate(data)).resolves.toEqual(data);
    });
    test("should sucees when description's lenght equal to 750", async () => {
        data.description = "odkqRyQOlQKYJMslk9ChFqBS2LpiWcq1gg3h6sk31WcPliIBRVDuBQErjDwzs6hFjwyH3f3ez4MkBBEbNkVKA3ANV8NzQleI8BWFa8j6AhSNUfXxgWCXU1TjMQdAO9z5s6l1jsSDjF47BEx4wUaHqjWtQthNZLvamCFd7g0hGj1aTuEivAeHGInHNUgQQlki1BJmGBsTqoP6q6xTqqjjaPKD7g0FkR6RKzYi5IxjQtV79UJsMevk2QJLJCWojyOpt0BnWJq0aExO1rQ3gRb8RdWM2s6Re9n5HI5fvRYL8v0KEkWBKDLZkgY3sauw7sah0PLK6SsrcUZ6mDGUDvh7AdPOyfvVvpSmHHNwwC0BRSLHCeQOsGX78jqvxGLE0zXO8ABdXDDFEoivj4e0HwM7Dq91C6TkVf4Z0xpOA4RsqffTOGma2WZgDcgQg29k7tidIVEvdZhUxGKCDEQuUWI6Q6gZAE6RLQz60Q44zdRih0XT3uB9kVtZjDKCApByeOd4zNK3jPsTHzCDRVDpmbXKIbeoMnHAp94AxGFGSXTBaEv2UDj2Oh4xRZ70hMDRmgroy5ZIRAkRLQccvYbWwtyT5lg7r1Lr8FjFNg042SZ9ZSGnxfzutZWaWHQGrdyQ7vwttomJvjz6SFSB2Q7XY73XXo87MGAGD76pwGSBjFOq1cWFGBFIf39BNoKPodcpriT7swVoZxjAnutKqNQVax3zv0p2umfwEh5oePMOYjLVwmEwHB"
        expect(schema.validate(data)).resolves.toEqual(data);
    });
    test("should fail when description is too long", async () => {
        
        data.description = "odkqRyQOlQKYJMslk9ChFqBS2LpiWcq1gg3h6sk31WcPliIBRVDuBQErjDwzs6rrhFjwyH3f3ez4MkBBEbNkVKA3ANV8NzQleI8BWFa8j6AhSNUfXxgWCXU1TjMQdAO9z5s6l1jsSDjF47BEx4wUaHqjWtQthNZLvamCFd7g0hGj1aTuEivAeHGInHNUgQQlki1BJmGBsTqoP6q6xTqqjjaPKD7g0FkR6RKzYi5IxjQtV79UJsMevk2QJLJCWojyOpt0BnWJq0aExO1rQ3gRb8RdWM2s6Re9n5HI5fvRYL8v0KEkWBKDLZkgY3sauw7sah0PLK6SsrcUZ6mDGUDvh7AdPOyfvVvpSmHHNwwC0BRSLHCeQOsGX78jqvxGLE0zXO8ABdXDDFEoivj4e0HwM7Dq91C6TkVf4Z0xpOA4RsqffTOGma2WZgDcgQg29k7tidIVEvdZhUxGKCDEQuUWI6Q6gZAE6RLQz60Q44zdRih0XT3uB9kVtZjDKCApByeOd4zNK3jPsTHzCDRVDpmbXKIbeoMnHAp94AxGFGSXTBaEv2UDj2Oh4xRZ70hMDRmgroy5ZIRAkRLQccvYbWwtyT5lg7r1Lr8FjFNg042SZ9ZSGnxfzutZWaWHQGrdyQ7vwttomJvjz6SFSB2Q7XY73XXo87MGAGD76pwGSBjFOq1cWFGBFIf39BNoKPodcpriT7swVoZxjAnutKqNQVax3zv0p2umfwEh5oePMOYjLVwmEwHB"
        expect(schema.validate(data)).rejects.toThrow("Le nombre maximal de caractères de la description est 750.")
    });
    testMatches(
        "description",
        descriptionValidValues,
        descriptionInvalidFormatValues,
        schema,
        data,
        "Format invalide"
    );
}

export default descriptionTest;