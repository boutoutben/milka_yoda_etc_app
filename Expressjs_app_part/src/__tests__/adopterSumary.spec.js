const db = require("../mysqlDatabase.js");

jest.mock('../mysqlDatabase.js', () => {
    return {
        connect: jest.fn(),
        query: jest.fn()
    };
});

const { setAdopterSumary } = require("../handles/adopterSumary.js");

let mockReq, mockRes = {};

mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
}

describe("Set adopter sumary", () => {
    beforeEach(() => {
        mockReq = {
            body: {
                values: {
                    civility: 1,
                    lastname: "testname",
                    firstname: "test",
                    adressePostale: "59000",
                    email: "boutout.ben@gmail.com",
                    phone: "0600000000",
                    animalCase: ["Pas encore"],
                    animalNumber: {},
                    otherAnimals: [{"name":"","number":""}],
                    lifeRoutine: ["Dynamique"],
                    haveChildren: false,
                    motivation: "test'motivation",
                    animalPlace: ["Maison avec cour"],
                    child: []
                },
                animal: {
                    id: 1
                }
            }
        }
    })
    it("Should set adopter sumary with success", async () => {
        db.promise = jest.fn().mockReturnValue({
            query: jest.fn()
              .mockResolvedValueOnce([]) // First INSERT query
              .mockResolvedValueOnce([]) // Second UPDATE query
          });
        await setAdopterSumary(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({message: 'Opération réussie'})
    });
    it("Should return an error is error", async () => {
        db.promise = jest.fn().mockReturnValue({
            query: jest.fn()
              .mockRejectedValue(new Error("DB error"))
          });
          await setAdopterSumary(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: 'Erreur serveur: DB error'});
    })
})