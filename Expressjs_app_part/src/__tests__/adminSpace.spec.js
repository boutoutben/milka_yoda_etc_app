const { json } = require("body-parser");
const db = require("../mysqlDatabase.js");
const { fetchAdoptionNotApprouved, fetchApprouveAdoption, deleteAdoptionNotApprouved, approuveAdoption, fetchAllUsers, blockUpdate } = require("../handles/adminSpace.js");

jest.mock('../mysqlDatabase.js', () => {
    return {
        connect: jest.fn(),
        query: jest.fn()
    };
});

let mockReq, mockRes = {};

mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};

describe("Fetch doption not approuved", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })
    it("Should fetch adoption not approuved with success", async () => {
        db.promise = jest.fn().mockReturnValue({
            query: jest.fn().mockResolvedValue([[{
                id: 1,
                animalId: 3,
                name: "test",
                description: "test's description",
            }]])
        })
        await fetchAdoptionNotApprouved(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith([{
            id: 1,
            animalId: 3,
            name: "test",
            description: "test's description",
        }])
    });
    it("Should return an error if error server", async () => {
        db.promise = jest.fn().mockReturnValue({
            query: jest.fn().mockRejectedValue(new Error("DB error"))
        });
        await fetchAdoptionNotApprouved(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur serveur: DB error"})
    })
});

describe("Fetch approuve adoption", () => {
    beforeEach(() => {
        mockReq = {
            params: {
                id: 1
            }
        };
        jest.clearAllMocks()
    });
    it("Should fetch approuve the adoption with success", async () => {
        db.promise = jest.fn().mockReturnValue({
            query: jest.fn().mockResolvedValue([[{
              id: 1,
              civility: 1,
              lastname: "testname",
              firstname: "test",
              adressePostale: "59000",
              email: "boutout.ben@gmail.com",
              phone: "0600000000",
              animalCase: JSON.stringify(["Pas encore"]),
              animalNumber: null,
              otherAnimals: JSON.stringify([{ name: "", number: "" }]),
              lifeRoutine: JSON.stringify(["Dynamique"]),
              haveChildren: false,
              motivation: "test'motivation",
              animalPlace: JSON.stringify(["Maison avec cour"]),
              child: null,
              animalId: 2,
              name: "animalTest",
              description: "animal's description",
              isSterile: true,
              imgName: 'test.jpg',
              races: JSON.stringify([102, 103]),
              born: "2020-10-14",
              incompatibility: null,
              createdAt: "2025-06-04",
              isApprouved: false
            }]])
          });
        await fetchApprouveAdoption(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({"animal": {"born": "2020-10-14", "createdAt": "2025-06-04", "description": "animal's description", "id": 2, "imgName": "test.jpg", "incompatibility": null, "isApprouved": false, "isMediator": undefined, "isSterile": true, "name": "animalTest", "races": "[102,103]"}, "values": {"adressePostale": "59000", "animalCase": ["Pas encore"], "animalNumber": null, "animalPlace": ["Maison avec cour"], "child": null, "civility": 1, "email": "boutout.ben@gmail.com", "firstname": "test", "haveChildren": false, "id": undefined, "lastname": "testname", "lifeRoutine": ["Dynamique"], "motivation": "test'motivation", "otherAnimals": [{"name": "", "number": ""}], "phone": "0600000000"}})
    });
    it("Should retunr an error if error server", async () => {
        db.promise =  jest.fn().mockReturnValue({
            query: jest.fn().mockRejectedValue(new Error("DB error"))
        });
        await fetchApprouveAdoption(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur serveur: DB error"})
    })
});

describe("Delete adoption not approuved", () => {
    beforeEach(() => {
        mockReq = {
            params: {
                id: 1
            }
        };
        jest.clearAllMocks();
    })
    it("Shoud delete the adoption not approuved with sucess", async () => {
        db.promise = jest.fn().mockReturnValue({
            query: jest.fn()
              .mockResolvedValueOnce([[{ animal_id: 12 }]])  // pour le SELECT
              .mockResolvedValueOnce([])                    // pour le UPDATE
              .mockResolvedValueOnce([])                    // pour le DELETE
          });
        await deleteAdoptionNotApprouved(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({message: "Adoption refusée"});
    });
    it("Should return data not found", async () => {
        db.promise = jest.fn().mockReturnValue({
            query: jest.fn()
              .mockResolvedValueOnce([[]]) 
          });
        await deleteAdoptionNotApprouved(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Nous n'avons pas trouvé les données"});
    });
    it("Should return an error is server error", async () => {
        db.promise = jest.fn().mockReturnValue({
            query: jest.fn()
              .mockRejectedValue(new Error("DB error")) 
          });
        await deleteAdoptionNotApprouved(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur serveur: DB error"});
    })
});

describe("Approuve adoption", () => {
    beforeEach(() => {
        mockReq = {
            params: {
                id: 1
            }
        };
        jest.clearAllMocks();
    });
    it("Should approuve the adoption with succes", async () => {
        db.promise.mockReturnValue({
            query: jest.fn().mockResolvedValue()
        });
        await approuveAdoption(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({message: "Adoption acceptée"});
    });
    it("Should return an error if server error", async () => {
        db.promise.mockReturnValue({
            query: jest.fn().mockRejectedValue(new Error("DB error"))
        });
        await approuveAdoption(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur serveur: DB error"});
    })
});

describe("Fetch all users", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("Should fetch all users with sucess", async () => {
        db.promise = jest.fn().mockReturnValue({
            query: jest.fn().mockResolvedValueOnce([[{
                id: 1,
                firstname: "test",
                lastname: "testname",
                email: "boutout.ben@gmail.com",
                isBlock:false
            },
            {
                id: 2,
                firstname: "test2",
                lastname: "testname2",
                email: "boutout.ben2@gmail.com",
                isBlock:false
            },
        ]])
        });
        await fetchAllUsers(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({"users": [{"email": "boutout.ben@gmail.com", "firstname": "test", "id": 1, "isBlock": false, "lastname": "testname"}, {"email": "boutout.ben2@gmail.com", "firstname": "test2", "id": 2, "isBlock": false, "lastname": "testname2"}]})
    });
    it("Should return an error if server error", async () => {
        db.promise = jest.fn().mockReturnValue({
            query: jest.fn().mockRejectedValue(new Error("DB error"))
        });
        await fetchAllUsers(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur serveur: DB error"})
    })
});

describe("Block update", () => {
    beforeEach(() => {
        mockReq = {
            body: {
                id: 1,
                argument: true
            }
        };
        jest.clearAllMocks();
    })
    it("Should update block user", async () => {
        db.promise = jest.fn().mockReturnValue({
            query: jest.fn().mockResolvedValueOnce()
        });
        await blockUpdate(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({message: "Update"});
    });
    it("Should return an error if server error", async () => {
        db.promise = jest.fn().mockReturnValue({
            query: jest.fn().mockRejectedValue(new Error("DB error"))
        });
        await blockUpdate(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur serveur: DB error"});
    })
})