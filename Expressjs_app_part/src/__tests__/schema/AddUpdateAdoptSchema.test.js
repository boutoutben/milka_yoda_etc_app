const { number } = require("yup");
const AddUpdateAnimalSchema = require("../../schema/AddUpdateAnimalSchema");
const animalTest = require("../../testComponent/animalTest");
const bornTest = require("../../testComponent/bornTest");
const descriptionTest = require("../../testComponent/descriptionTest");
const fileTest = require("../../testComponent/fileTest");
const isSterileTest = require("../../testComponent/isSterileTest");
const nameTest = require("../../testComponent/nameTest");
const racesTest = require("../../testComponent/racesTest");
const sexeTest = require("../../testComponent/sexeTest");

describe("AddUpdateSchema", () => {
    const validName = "test";
    const validDescription = "Description of the test who details the animals";
    const validSexe = 2;
    const validIsSterile = true;
    const validFile = {filename: "test.jpg", size: 700* 1024};
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
    }, AddUpdateAnimalSchema())
    
    descriptionTest({
        name: validName,
        description: validDescription,
        sexe: validSexe,
        isSterile: validIsSterile,
        file: validFile,
        animal: validAnimal,
        born: validBorn,
        races: validRaces
    }, AddUpdateAnimalSchema())
    sexeTest({
        name: validName,
        description: validDescription,
        sexe: validSexe,
        isSterile: validIsSterile,
        file: validFile,
        animal: validAnimal,
        born: validBorn,
        races: validRaces
    }, AddUpdateAnimalSchema());
    isSterileTest({
        name: validName,
        description: validDescription,
        sexe: validSexe,
        isSterile: validIsSterile,
        file: validFile,
        animal: validAnimal,
        born: validBorn,
        races: validRaces
    }, AddUpdateAnimalSchema());
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
    }, AddUpdateAnimalSchema(true), false);
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
    }, AddUpdateAnimalSchema(false));
    animalTest({
        name: validName,
        description: validDescription,
        sexe: validSexe,
        isSterile: validIsSterile,
        file: validFile,
        animal: validAnimal,
        born: validBorn,
        races: validRaces
    }, AddUpdateAnimalSchema(true));
    bornTest({
        name: validName,
        description: validDescription,
        sexe: validSexe,
        isSterile: validIsSterile,
        file: validFile,
        animal: validAnimal,
        born: validBorn,
        races: validRaces
    }, AddUpdateAnimalSchema(true));
    racesTest({
        name: validName,
        description: validDescription,
        sexe: validSexe,
        isSterile: validIsSterile,
        file: validFile,
        animal: validAnimal,
        born: validBorn,
        races: validRaces
    }, AddUpdateAnimalSchema(true));

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
        expect(AddUpdateAnimalSchema(true).validate(data)).resolves.toEqual(data);
    })

    
})