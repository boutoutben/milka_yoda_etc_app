const { fetchMediatorAnimals, addMediatorAnimals } = require('../handles/mediator');
const { __queryMock } = require('../mysqlDatabase');

let mockReq = {};
const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};

jest.mock('../mysqlDatabase', () => {
    const queryMock = jest.fn();
    return {
        promise: jest.fn(() => ({
            query: queryMock
        })),
        __queryMock: queryMock
    };
});

describe("Fetch all mediators animals", () => {
    it("should fetch all mediators animals with success", async () => {
        const mockAnimals = [
            { id: 1, name: "test1", description: "test's description" },
            { id: 2, name: "test2", description: "test's description" }
        ];

        __queryMock.mockResolvedValue([mockAnimals]);

        await fetchMediatorAnimals(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockAnimals);
    });
    it("should return 500 if server error", async () => {
        
        __queryMock.mockRejectedValue(new Error("DB error"));
        await fetchMediatorAnimals(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur serveur: DB error"});
    })
});

describe("Add mediator animals", () => {
    beforeEach(() => {
        mockReq = {
            body: {
                name: "test",
                description: "test'description",
                sexe: 1,
                isSterile: false,
                races: JSON.stringify([101,102]),
                born:"2023-05-23",
                incompatibility: null
            },
            file: {
                filename: "test.jpg"
            }
        }
        jest.clearAllMocks();
    });
    it("should add the mediator animal with sucess", async () => {
        __queryMock.mockResolvedValue();
        await addMediatorAnimals(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({message: "Animal ajouter"});   
    });
    it("should return 500 if server error", async () => {
        __queryMock.mockRejectedValueOnce(new Error("DB error"));

        await addMediatorAnimals(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Erreur serveur: DB error"
        });
    });
})