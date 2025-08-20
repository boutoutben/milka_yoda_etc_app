const { set } = require("lodash");
const AdopterProfileSchema = require("../../schema/adoptProfileSchema");
const acceptTest = require("../../testComponent/acceptTest");
const adressePostaleTest = require("../../testComponent/adressePostaleTest");
const ageTest = require("../../testComponent/ageTest");
const civilityTest = require("../../testComponent/civilityTest");
const emailTest = require("../../testComponent/emailTest");
const firstnameTest = require("../../testComponent/firstnameTest");
const lastnameTest = require("../../testComponent/lastnameTest");
const phoneTest = require("../../testComponent/phoneTest");
const testMatches = require("../../testComponent/testMatches");


describe("adopterProfileSchema", () => {
    const validCivility = "2";
    const validLastname = "Dupond";
    const validFirstname = "Bob";
    const validAge = 18;
    const validEmail = "test@example.com";
    const validPhone = "0600000000";
    const validAdressePostale = '59000';
    const validAnimalPlace = ["Maison avec jardin"];
    const validLifeRoutine = ["Dynamique"];
    const validAnimalCase = ["Pas encore"];
    const validHaveChildren = true;
    const validChild = [1, 2];
    const validMotivation = "Test'motivation who describe the users's motivations";
    const validAnimalNumber =  {
        Chats: 2,
        Chiens: 1
      };
    const validOtherAnimals = [{name: "Test", number:1}];
    const validAccept = true;

    civilityTest({
        civility: validCivility,
        lastname: validLastname,
        firstname: validFirstname,
        age: validAge,
        email: validEmail,
        phone: validPhone,
        adressePostale: validAdressePostale,
        animalPlace: validAnimalPlace,
        lifeRoutine: validLifeRoutine,
        animalCase: validAnimalCase,
        haveChildren: validHaveChildren,
        child: validChild,
        motivation: validMotivation,
        animalNumber: validAnimalNumber,
        otherAnimals: validOtherAnimals,
        accept: validAccept
    }, AdopterProfileSchema);
    lastnameTest({
        civility: validCivility,
        lastname: validLastname,
        firstname: validFirstname,
        age: validAge,
        email: validEmail,
        phone: validPhone,
        adressePostale: validAdressePostale,
        animalPlace: validAnimalPlace,
        lifeRoutine: validLifeRoutine,
        animalCase: validAnimalCase,
        haveChildren: validHaveChildren,
        child: validChild,
        motivation: validMotivation,
        animalNumber: validAnimalNumber,
        otherAnimals: validOtherAnimals,
        accept: validAccept
    }, AdopterProfileSchema);
    firstnameTest({
        civility: validCivility,
        lastname: validLastname,
        firstname: validFirstname,
        age: validAge,
        email: validEmail,
        phone: validPhone,
        adressePostale: validAdressePostale,
        animalPlace: validAnimalPlace,
        lifeRoutine: validLifeRoutine,
        animalCase: validAnimalCase,
        haveChildren: validHaveChildren,
        child: validChild,
        motivation: validMotivation,
        animalNumber: validAnimalNumber,
        otherAnimals: validOtherAnimals,
        accept: validAccept
    }, AdopterProfileSchema);
    ageTest({
        civility: validCivility,
        lastname: validLastname,
        firstname: validFirstname,
        age: validAge,
        email: validEmail,
        phone: validPhone,
        adressePostale: validAdressePostale,
        animalPlace: validAnimalPlace,
        lifeRoutine: validLifeRoutine,
        animalCase: validAnimalCase,
        haveChildren: validHaveChildren,
        child: validChild,
        motivation: validMotivation,
        animalNumber: validAnimalNumber,
        otherAnimals: validOtherAnimals,
        accept: validAccept
    }, AdopterProfileSchema);
    emailTest({
        civility: validCivility,
        lastname: validLastname,
        firstname: validFirstname,
        age: validAge,
        email: validEmail,
        phone: validPhone,
        adressePostale: validAdressePostale,
        animalPlace: validAnimalPlace,
        lifeRoutine: validLifeRoutine,
        animalCase: validAnimalCase,
        haveChildren: validHaveChildren,
        child: validChild,
        motivation: validMotivation,
        animalNumber: validAnimalNumber,
        otherAnimals: validOtherAnimals,
        accept: validAccept
    }, AdopterProfileSchema);
    phoneTest({
        civility: validCivility,
        lastname: validLastname,
        firstname: validFirstname,
        age: validAge,
        email: validEmail,
        phone: validPhone,
        adressePostale: validAdressePostale,
        animalPlace: validAnimalPlace,
        lifeRoutine: validLifeRoutine,
        animalCase: validAnimalCase,
        haveChildren: validHaveChildren,
        child: validChild,
        motivation: validMotivation,
        animalNumber: validAnimalNumber,
        otherAnimals: validOtherAnimals,
        accept: validAccept
    }, AdopterProfileSchema, true);
    adressePostaleTest({
        civility: validCivility,
        lastname: validLastname,
        firstname: validFirstname,
        age: validAge,
        email: validEmail,
        phone: validPhone,
        adressePostale: validAdressePostale,
        animalPlace: validAnimalPlace,
        lifeRoutine: validLifeRoutine,
        animalCase: validAnimalCase,
        haveChildren: validHaveChildren,
        child: validChild,
        motivation: validMotivation,
        animalNumber: validAnimalNumber,
        otherAnimals: validOtherAnimals,
        accept: validAccept
    }, AdopterProfileSchema);

    //test animal place 
    test("should fails when the array'lenght is inferior to 1", () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: [],
            lifeRoutine: validLifeRoutine,
            animalCase: validAnimalCase,
            haveChildren: validHaveChildren,
            child: validChild,
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: validOtherAnimals,
            accept: validAccept
        };
        expect(AdopterProfileSchema.validate(data)).rejects.toThrow("Il faut choisir au moins une option")
    })
    test("should success when the animalPlace array'lenght is equal to 1", () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: ["Maison avec jardin"],
            lifeRoutine: validLifeRoutine,
            animalCase: validAnimalCase,
            haveChildren: validHaveChildren,
            child: validChild,
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: validOtherAnimals,
            accept: validAccept
        };
        expect(AdopterProfileSchema.validate(data)).resolves.toEqual(data)
    })  
    const animalPlaceValidData = [['Maison avec jardin'],["Maison avec cour"], ["Maison sans jardin"], ["Appart avec balcon sécurisé"], ["Apport sans balcon"]]
    const animalPlaceInvalidData = [
        {
            value:["somewhere"],
            reason:"not into the liste"
        }
    ]
    testMatches("animalPlace", animalPlaceValidData, animalPlaceInvalidData, AdopterProfileSchema, {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: validAnimalCase,
            haveChildren: validHaveChildren,
            child: validChild,
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: validOtherAnimals,
            accept: validAccept
        }, "Le lieu n'est pas dans la liste.")

    // test lifeRoutine 
    test("should fails when the lifeRoutine array'lenght is inferior to 1", () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: [],
            animalCase: validAnimalCase,
            haveChildren: validHaveChildren,
            child: validChild,
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: validOtherAnimals,
            accept: validAccept
        };
        expect(AdopterProfileSchema.validate(data)).rejects.toThrow("Il faut choisir au moins une option")
    })
    test("should success when the lifeRoutine array'lenght is equal to 1", () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: ["Dynamique"],
            animalCase: validAnimalCase,
            haveChildren: validHaveChildren,
            child: validChild,
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: validOtherAnimals,
            accept: validAccept
        };
        expect(AdopterProfileSchema.validate(data)).resolves.toEqual(data)
    })

    const lifeRoutineValidData = [['Calme'],["Dynamique"], ["Sportif"], ["Urbain"], ["En campagne"], ["Amoureux de la nature"]]
    const lifeRoutineInvalidData = [
        {
            value:["life routine action"],
            reason:"not life routine into the liste"
        }
    ]
    testMatches("lifeRoutine", lifeRoutineValidData, lifeRoutineInvalidData, AdopterProfileSchema, {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: validAnimalCase,
            haveChildren: validHaveChildren,
            child: validChild,
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: validOtherAnimals,
            accept: validAccept
        }, "L'habitude de vie n'est pas présent dans la liste.")

    // test animalCase 

    test("should fails when the animalCase array'lenght is inferior to 1", () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: [],
            haveChildren: validHaveChildren,
            child: validChild,
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: validOtherAnimals,
            accept: validAccept
        };
        expect(AdopterProfileSchema.validate(data)).rejects.toThrow("Vous devez choisir au moins une option")
    })
    test("should success when the animalCase array'lenght is equal to 1", () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: ["Pas encore"],
            haveChildren: validHaveChildren,
            child: validChild,
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: validOtherAnimals,
            accept: validAccept
        };
        expect(AdopterProfileSchema.validate(data)).resolves.toEqual(data)
    })
    

     const defaultData = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: validAnimalCase,
            haveChildren: validHaveChildren,
            child: validChild,
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: validOtherAnimals,
            accept: validAccept
        };
    const animalCaseValidData = [["Chien"], ["Chat"], ['Rongeur']]
    test("should succs when the animalCase is Pas encore", () => {
        defaultData.animalCase = ["Pas encore"];
        expect(AdopterProfileSchema.validate(defaultData)).resolves.toEqual(defaultData)
    })
     test.each(animalCaseValidData.map(value => ({ value })))(
            `✅ should pass for valid animalsCase: %p`,
            async ({ value }) => {
                const data = {
                    ...defaultData,
                };
                set(data, "animalCase", value);        
                expect(AdopterProfileSchema.validate(defaultData)).resolves.toEqual(defaultData)
            }
            
        );
        test("should succs when the animalCase is Autre", () => {
        defaultData.animalCase = ["Autre"];
        expect(AdopterProfileSchema.validate(defaultData)).resolves.toEqual(defaultData)
    })
    test("should fail when the animal is not into the list",() => {
        defaultData.animalCase = ["otherAnimal"];
        defaultData.animalNumber = {"otherAnimal": 1}
        expect(AdopterProfileSchema.validate(defaultData)).rejects.toThrow("Ce choix de l'animal n'est pas dans la liste.")
    })
    //test haveChildren 
    test('should fails when haveChildren is null', () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: validAnimalCase,
            haveChildren: null,
            child: validChild,
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: validOtherAnimals,
            accept: validAccept
        };
        expect(AdopterProfileSchema.validate(data)).rejects.toThrow("Vous devez indiquer si vous avez des enfants ou non.")
    })

    //test child
    it('should pass when haveChildren is false and child is empty', async () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: validAnimalCase,
            haveChildren: false,
            child: [],
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: validOtherAnimals,
            accept: validAccept
        };
        await expect(AdopterProfileSchema.validate(data)).resolves.toEqual(data);
      });
    
      it('should pass when haveChildren is true and valid child ages are provided', async () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: validAnimalCase,
            haveChildren: true,
            child: [3, 7],
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: validOtherAnimals,
            accept: validAccept
        };
        await expect(AdopterProfileSchema.validate(data)).resolves.toEqual(data);
      });
    
      it('should fail when haveChildren is true but child is empty', async () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: validAnimalCase,
            haveChildren: true,
            child: [],
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: validOtherAnimals,
            accept: validAccept
        };
        await expect(AdopterProfileSchema.validate(data)).rejects.toThrow('Ajoutez au moins un enfant');
      });

      test("should sucess when child'lenght is equal to 1", () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: validAnimalCase,
            haveChildren: true,
            child: [3],
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: validOtherAnimals,
            accept: validAccept
        };
        expect(AdopterProfileSchema.validate(data)).resolves.toEqual(data);
      });

      test("should success when child'lenght is equal to 10", () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: validAnimalCase,
            haveChildren: true,
            child: [1,2,3,4,5,6,7,8,9,10],
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: validOtherAnimals,
            accept: validAccept
        };
        expect(AdopterProfileSchema.validate(data)).resolves.toEqual(data);
      });
      test("should fail when child'lenght is superior to 10", () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: validAnimalCase,
            haveChildren: true,
            child: [1,2,3,4,5,6,7,8,9,10, 11],
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: validOtherAnimals,
            accept: validAccept
        };
        expect(AdopterProfileSchema.validate(data)).rejects.toThrow('Le nombre d\'enfant doit être inférieur ou égal à 10.');
      });
    
      test('should fail when haveChildren is true and child contains a non-number', async () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: validAnimalCase,
            haveChildren: true,
            child: [3, 'a'],
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: validOtherAnimals,
            accept: validAccept
        };
        await expect(AdopterProfileSchema.validate(data)).rejects.toThrow("L'âge doit être un nombre");
      });
      test('should fail when haveChildren is true and child \'age is negatif number', async () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: validAnimalCase,
            haveChildren: true,
            child: [-1],
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: validOtherAnimals,
            accept: validAccept
        };
        await expect(AdopterProfileSchema.validate(data)).rejects.toThrow("L'âge doit être supérieur ou égal à 0.");
      });
      test("should succes when child's age is equal to 0", () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: validAnimalCase,
            haveChildren: true,
            child: [0],
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: validOtherAnimals,
            accept: validAccept
        };
        expect(AdopterProfileSchema.validate(data)).resolves.toEqual(data);
      })

    //test motivation 
    test("should fail when motivation is empty", () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: validAnimalCase,
            haveChildren: true,
            child: validChild,
            motivation: "",
            animalNumber: validAnimalNumber,
            otherAnimals: validOtherAnimals,
            accept: validAccept
        };
        expect(AdopterProfileSchema.validate(data)).rejects.toThrow("La motivation est requise.");
    });
    test("should fail when motivation'lenght is too short", () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: validAnimalCase,
            haveChildren: true,
            child: validChild,
            motivation: "uiuoiu",
            animalNumber: validAnimalNumber,
            otherAnimals: validOtherAnimals,
            accept: validAccept
        };
        expect(AdopterProfileSchema.validate(data)).rejects.toThrow("La motivation doit contenir au moins 10 caractères.");
    })

    test("should success when motivation'lenght is equal to 10", () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: validAnimalCase,
            haveChildren: true,
            child: validChild,
            motivation: "a".repeat(10),
            animalNumber: validAnimalNumber,
            otherAnimals: validOtherAnimals,
            accept: validAccept
        };
        expect(AdopterProfileSchema.validate(data)).resolves.toEqual(data);
    })
    test("should success when motivation'lenght is equal to 1000", () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: validAnimalCase,
            haveChildren: true,
            child: validChild,
            motivation: "a".repeat(1000),
            animalNumber: validAnimalNumber,
            otherAnimals: validOtherAnimals,
            accept: validAccept
        };
        expect(AdopterProfileSchema.validate(data)).resolves.toEqual(data);
    })

    test("should fail when motivation'lenght is too long", () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: validAnimalCase,
            haveChildren: true,
            child: validChild,
            motivation: "duzklphzvgcqmmkhjdlfwyhhedbuppoybagpcgorpnenkxzjjmetbapzjlmmpdhlxquwfjaqqyxbscnvvuemvqfxiwkljjyixuppegicjtrtfpiagryeajfsntnxecwfguvmpxsdujnnskvwgehwdforttpbrmqkieakairmviyndbbmygddltppqxfrkjbxrpzupgvzvcqorubvmhziwztlbsdtfsswedntxwyptyriwlmballtnakgatfhmzvdpcqdtqinfiqmvcenjwwmcxtsqcbrssrnydetcstoelspbkagxvmoshnexcjybjvnalmzqvvbdkpfpqtorhsduolemfgmvbpaolajtmpnesjcctqjexcyzwhckebsaubiflrandaelxdjkhhsdxrfzmwyylmfggnvzuiimqjilixqaxhipbnrrvfgprkkectmhntpqsiteiodmsjafhimlvuiwgfxmvsvnbhlckarnglkuxmppunozguhshhtmvxldscmxcbtgmyjnloactuffxorkpdrkhykjbwbpbitaxjuuvijvfpcwuddyovfxkeippsbqwauudsmrvtzruhxqetsykqrqrserhlirpmofowfwlzkdznlpvbixowyibmoxyzritrseeivlzqnwnfqslozxwmcqfgnzbqlrtqtftcljwkebgsudttwmswtjjfbfmyebwtzgwsxoogbevumplyeacwwlshhpgnycjocwzhhqmcfnzvsozpshddqtvirwyuqhsgwbkmyxkttzkibdznuxjxyaadzacoblvfbhkbjqfsitxjicssarvexvhmqhinncnmnmurtipdaobtjbkojtvhlgjamvoidqauliiyatkxytuzwkrkbckcwywwlepkprmlvdzaesaomaourrvjmjlsegyhxkpmmysfzkfewawgrfwebifhjvldmpndclpxitfrjjiovkdinumaaaobnjnyzgzhvitzhbrhded",
            animalNumber: validAnimalNumber,
            otherAnimals: validOtherAnimals,
            accept: validAccept
        };
        expect(AdopterProfileSchema.validate(data)).rejects.toThrow("La motivation ne doit pas dépasser 1000 caractères.");
    })

    const validMotivations = [
        'Je souhaite adopter un animal.',
        'Parce que j\'aime les animaux !',
        'Motivé à 100%  eeeee:)',
        'J\'ai déjà eu 2 chiens.\nIls me manquent beaucoup.',
        'Je suis prêt(e) à m\'investir totalement.',
        'Bonjour ! #adoption @motivation',
        'Pourquoi pas ? *curieux*',
      ];
      const invalidMotivations = [
        {
          value: 'Motivation 💖',
          reason: 'Contient un emoji (💖), caractère non autorisé par la regex',
        },
        {
          value: 'Envie d’adopter 🐶',
          reason: 'Contient un emoji (🐶), caractère non autorisé par la regex',
        },
        {
          value: 'J\'utilise ^ ou % ici',
          reason: 'Contient les caractères spéciaux "^" et "%", non autorisés par la regex',
        },
        {
          value: '<script>alert("x")</script>',
          reason: 'Contient des chevrons "<" et ">", potentiellement dangereux (XSS), non autorisés par la regex',
        },
        {
          value: 'Test avec `backtick`',
          reason: 'Contient un backtick "`", caractère non autorisé par la regex',
        },
        {
          value: '€uro zr zer zer ze r',
          reason: 'Contient le symbole "€", non présent dans la liste autorisée',
        },
      ];

    testMatches('motivation', validMotivations, invalidMotivations, AdopterProfileSchema, {
        civility: validCivility,
        lastname: validLastname,
        firstname: validFirstname,
        age: validAge,
        email: validEmail,
        phone: validPhone,
        adressePostale: validAdressePostale,
        animalPlace: validAnimalPlace,
        lifeRoutine: validLifeRoutine,
        animalCase: validAnimalCase,
        haveChildren: true,
        child: validChild,
        motivation: "duzklphzvgcqmmkhjdlfwyhhedbuppoybagpcgorpnenkxzjjmetbapzjlmmpdhlxquwfjaqqyxbscnvvuemvqfxiwkljjyixuppegicjtrtfpiagryeajfsntnxecwfguvmpxsdujnnskvwgehwdforttpbrmqkieakairmviyndbbmygddltppqxfrkjbxrpzupgvzvcqorubvmhziwztlbsdtfsswedntxwyptyriwlmballtnakgatfhmzvdpcqdtqinfiqmvcenjwwmcxtsqcbrssrnydetcstoelspbkagxvmoshnexcjybjvnalmzqvvbdkpfpqtorhsduolemfgmvbpaolajtmpnesjcctqjexcyzwhckebsaubiflrandaelxdjkhhsdxrfzmwyylmfggnvzuiimqjilixqaxhipbnrrvfgprkkectmhntpqsiteiodmsjafhimlvuiwgfxmvsvnbhlckarnglkuxmppunozguhshhtmvxldscmxcbtgmyjnloactuffxorkpdrkhykjbwbpbitaxjuuvijvfpcwuddyovfxkeippsbqwauudsmrvtzruhxqetsykqrqrserhlirpmofowfwlzkdznlpvbixowyibmoxyzritrseeivlzqnwnfqslozxwmcqfgnzbqlrtqtftcljwkebgsudttwmswtjjfbfmyebwtzgwsxoogbevumplyeacwwlshhpgnycjocwzhhqmcfnzvsozpshddqtvirwyuqhsgwbkmyxkttzkibdznuxjxyaadzacoblvfbhkbjqfsitxjicssarvexvhmqhinncnmnmurtipdaobtjbkojtvhlgjamvoidqauliiyatkxytuzwkrkbckcwywwlepkprmlvdzaesaomaourrvjmjlsegyhxkpmmysfzkfewawgrfwebifhjvldmpndclpxitfrjjiovkdinumaaaobnjnyzgzhvitzhbrhded",
        animalNumber: validAnimalNumber,
        otherAnimals: validOtherAnimals,
        accept: validAccept
    }, "La motivation contient des caractères non autorisés." )

    //test otherAnimals 
    test("should success if animalCase not include 'Autre' ", () => {
       const data =  {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: ["Pas encore"],
            haveChildren: true,
            child: validChild,
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: [],
            accept: validAccept
        }
        expect(AdopterProfileSchema.validate(data)).resolves.toEqual(data)
    })
    test("should fails when include Autre and otherAnimals is empty", () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: ["Autre"],
            haveChildren: true,
            child: validChild,
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: [],
            accept: validAccept
        }
        expect(AdopterProfileSchema.validate(data)).rejects.toThrow("Ajoutez au moins un animal")
    })
    test("should fails when include Autre and otherAnimals'name is empty", () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: ["Autre"],
            haveChildren: true,
            child: validChild,
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: [{name:"", number:1}],
            accept: validAccept
        }
        expect(AdopterProfileSchema.validate(data)).rejects.toThrow("Le nom de l'animal est requis.")
    })
    test("should fails when include Autre and otherAnimals'name's lenght is too short", () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: ["Autre"],
            haveChildren: true,
            child: validChild,
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: [{name:"cc", number:1}],
            accept: validAccept
        }
        expect(AdopterProfileSchema.validate(data)).rejects.toThrow("Le nom doit comporter au moins 3 caractères.")
    })
    test("should sucess when include Autre and otherAnimals'name's lenght is equal to 3", () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: ["Autre"],
            haveChildren: true,
            child: validChild,
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: [{name:"Ccc", number:1}],
            accept: validAccept
        }
        expect(AdopterProfileSchema.validate(data)).resolves.toEqual(data)
    })
    test("should sucess when include Autre and otherAnimals'name's lenght is equal to 50", () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: ["Autre"],
            haveChildren: true,
            child: validChild,
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: [{name:"C"+"c".repeat(49), number:1}],
            accept: validAccept
        }
        expect(AdopterProfileSchema.validate(data)).resolves.toEqual(data)
    })
    test("should fails when include Autre and otherAnimals'name's lenght is too long", () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: ["Autre"],
            haveChildren: true,
            child: validChild,
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: [{name:"c".repeat(51), number:1}],
            accept: validAccept
        }
        expect(AdopterProfileSchema.validate(data)).rejects.toThrow("Le nombre maximal de caractères du nom est 50.")
    })

    const validSpecies = [
        'Chat',
        'Chien',
        'Lapin',
        'Hamster',
        'Perroquet',
        'Tortue',
      ];
      
      const invalidSpecies = [
        { value: 'chat', reason: 'Commence par une minuscule' },
        { value: 'chien123', reason: 'Chiffres non autorisés' },
        { value: ' Lapin', reason: 'Espace initial' },
        { value: 'Hamster ', reason: 'Espace final' },
        { value: 'Perroquet!', reason: 'Caractère spécial interdit' },
        { value: '-Tortue', reason: 'Tiret initial interdit' },
        { value: 'Tortue-', reason: 'Tiret final interdit' },
        { value: 'Ham  ster', reason: 'Double espace' },
      ];
      testMatches("otherAnimals[0][name]", validSpecies, invalidSpecies, AdopterProfileSchema,{
        civility: validCivility,
        lastname: validLastname,
        firstname: validFirstname,
        age: validAge,
        email: validEmail,
        phone: validPhone,
        adressePostale: validAdressePostale,
        animalPlace: validAnimalPlace,
        lifeRoutine: validLifeRoutine,
        animalCase: ["Autre"],
        haveChildren: true,
        child: validChild,
        motivation: validMotivation,
        animalNumber: validAnimalNumber,
        otherAnimals: [{name:"c".repeat(51), number:1}],
        accept: validAccept
    }, "Format invalide");

    test("should fails when include Autre and otherAnimals'number is empty", () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: ["Autre"],
            haveChildren: true,
            child: validChild,
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: [{name:"Cdddd", number:null}],
            accept: validAccept
        }
        expect(AdopterProfileSchema.validate(data)).rejects.toThrow("Le nombre est requis.")
    });
    test("should fails when include Autre and otherAnimals'number inferior to 1", () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: ["Autre"],
            haveChildren: true,
            child: validChild,
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: [{name:"Cdddd", number:0}],
            accept: validAccept
        }
        expect(AdopterProfileSchema.validate(data)).rejects.toThrow("Le nombre doit être au moins 1.")
    });
    test("should success when include Autre and otherAnimals'number equal to 1", () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: ["Autre"],
            haveChildren: true,
            child: validChild,
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: [{name:"Cdddd", number:1}],
            accept: validAccept
        }
        expect(AdopterProfileSchema.validate(data)).resolves.toEqual(data)
    });
    test("should success when include Autre and otherAnimals'number equal to 15", () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: ["Autre"],
            haveChildren: true,
            child: validChild,
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: [{name:"Cdddd", number:15}],
            accept: validAccept
        }
        expect(AdopterProfileSchema.validate(data)).resolves.toEqual(data)
    });
    test("should fails when include Autre and otherAnimals'number supérior to 15", () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: ["Autre"],
            haveChildren: true,
            child: validChild,
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: [{name:"Cdddd", number:16}],
            accept: validAccept
        }
        expect(AdopterProfileSchema.validate(data)).rejects.toThrow("Le nombre doit être inférieur à 15.")
    });

    //test accept 
    acceptTest({
        civility: validCivility,
        lastname: validLastname,
        firstname: validFirstname,
        age: validAge,
        email: validEmail,
        phone: validPhone,
        adressePostale: validAdressePostale,
        animalPlace: validAnimalPlace,
        lifeRoutine: validLifeRoutine,
        animalCase: validAnimalCase,
        haveChildren: true,
        child: validChild,
        motivation: validMotivation,
        animalNumber: validAnimalNumber,
        otherAnimals: validOtherAnimals,
        accept: validAccept
    }, AdopterProfileSchema);

    test("should success if all value is valid", () => {
        const data = {
            civility: validCivility,
            lastname: validLastname,
            firstname: validFirstname,
            age: validAge,
            email: validEmail,
            phone: validPhone,
            adressePostale: validAdressePostale,
            animalPlace: validAnimalPlace,
            lifeRoutine: validLifeRoutine,
            animalCase: validAnimalCase,
            haveChildren: true,
            child: validChild,
            motivation: validMotivation,
            animalNumber: validAnimalNumber,
            otherAnimals: validOtherAnimals,
            accept: validAccept
        }
        expect(AdopterProfileSchema.validate(data)).resolves.toEqual(data)
    })
})

