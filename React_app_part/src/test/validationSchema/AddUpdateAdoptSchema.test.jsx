import AddUpdateAdoptSchema from "../../validationSchema/AddUpdateAnimalSchema";
import animalTest from "./component/animalTest";
import bornTest from "./component/bornTest";
import descriptionTest from "./component/descriptionTest";
import fileTest from "./component/fileTest";
import isSterileTest from "./component/isSterileTest";
import nameTest from "./component/nameTest"
import racesTest from "./component/racesTest";
import sexeTest from "./component/sexeTest";


describe("AddUpdateSchema", () => {
    const validName = "test";
    const validDescription = "Description of the test who details the animals";
    const validSexe = 2;
    const validIsSterile = true;
    const validFile = {name: "test.jpg", size: 700* 1024};
    const validAnimal = "chien";
    const validBorn = new Date("2020-06-04T22:00:00.000Z");
    const validRaces = ["123", "456"]

    nameTest({
        name: validName,
        description: validDescription,
        sexe: validSexe,
        isSterile: validIsSterile,
        file: validFile,
        animal: validAnimal,
        born: validBorn,
        races: validRaces
    }, AddUpdateAdoptSchema())
    
    descriptionTest({
        name: validName,
        description: validDescription,
        sexe: validSexe,
        isSterile: validIsSterile,
        file: validFile,
        animal: validAnimal,
        born: validBorn,
        races: validRaces
    }, AddUpdateAdoptSchema())
    sexeTest({
        name: validName,
        description: validDescription,
        sexe: validSexe,
        isSterile: validIsSterile,
        file: validFile,
        animal: validAnimal,
        born: validBorn,
        races: validRaces
    }, AddUpdateAdoptSchema());
    isSterileTest({
        name: validName,
        description: validDescription,
        sexe: validSexe,
        isSterile: validIsSterile,
        file: validFile,
        animal: validAnimal,
        born: validBorn,
        races: validRaces
    }, AddUpdateAdoptSchema());
    //test file required
    fileTest({
        name: validName,
        description: validDescription,
        sexe: validSexe,
        isSterile: validIsSterile,
        file: validFile,
        animal: validAnimal,
        born: validBorn,
        races: validRaces
    }, AddUpdateAdoptSchema(true), false);
    //test file not required
    fileTest({
        name: validName,
        description: validDescription,
        sexe: validSexe,
        isSterile: validIsSterile,
        file: validFile,
        animal: validAnimal,
        born: validBorn,
        races: validRaces
    }, AddUpdateAdoptSchema(false));
    animalTest({
        name: validName,
        description: validDescription,
        sexe: validSexe,
        isSterile: validIsSterile,
        file: validFile,
        animal: validAnimal,
        born: validBorn,
        races: validRaces
    }, AddUpdateAdoptSchema(true));
    bornTest({
        name: validName,
        description: validDescription,
        sexe: validSexe,
        isSterile: validIsSterile,
        file: validFile,
        animal: validAnimal,
        born: validBorn,
        races: validRaces
    }, AddUpdateAdoptSchema(true));
    racesTest({
        name: validName,
        description: validDescription,
        sexe: validSexe,
        isSterile: validIsSterile,
        file: validFile,
        animal: validAnimal,
        born: validBorn,
        races: validRaces
    }, AddUpdateAdoptSchema(true));

    test("should succuss when all valid data", () => {
        const data = {
            name: validName,
            description: validDescription,
            sexe: validSexe,
            isSterile: validIsSterile,
            file: validFile,
            animal: validAnimal,
            born: validBorn,
            races: validRaces
        }
        expect(AddUpdateAdoptSchema(true).validate(data)).resolves.toEqual(data);
    })
})