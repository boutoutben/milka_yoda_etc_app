const { fetchPersonnelInfo, setPersonnelInfo } = require("../handles/userSpace");
const db = require("../mysqlDatabase.js");
const { encryptData } = require("../Routes/encryptData");

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
}

describe("Fetch personnel info", () => {
    beforeEach(() => {
        mockReq = {
            user: {
                email: "boutout.ben@gmail.com"
            }
        }
    })
    it("Should fetch personnel info with sucess", async () => {
        db.promise = jest.fn().mockReturnValue({
            query: jest.fn().mockResolvedValue([[{
                id: 1,
                name: "test",
                description: "test'description",
            }]])
        })
        await fetchPersonnelInfo(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith([{
            id: 1,
            name: "test",
            description: "test'description",
        }])
    });
    it("Should return an error if error", async () => {
        db.promise = jest.fn().mockReturnValue({
            query: jest.fn().mockRejectedValue(new Error("DB error"))
        })
        await fetchPersonnelInfo(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur serveur: DB error"});
    })
})

describe("Set personnel Info", () => {
    const mockData = {
        civility: 1,
        lastname: "testname",
        firstname:'test',
        age:'18',
        adressePostale: "59000",
        email: "boutout.ben@gmail.com",
        phone: "0600000000"
    }
    beforeEach(() => {
        mockReq = {
            body: {
                data: encryptData(mockData),
                id: 1
            }
        }
        jest.clearAllMocks();
    })
    it("Should set personnel data with success", async () => {
        db.promise = jest.fn().mockReturnValue({
            query: jest.fn().mockResolvedValue([[{
                id: 1,
                civility: 1,
                lastname: "testname",
                firstname:'test',
                age:'18',
                adressePostale: "59000",
                email: "boutout.ben@gmail.com",
                phone: "0600000000"
            }]])
        })
        await setPersonnelInfo(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({message: "Infos mises à jour !", userInfo: {
            id: 1,
                civility: 1,
                lastname: "testname",
                firstname:'test',
                age:'18',
                adressePostale: "59000",
                email: "boutout.ben@gmail.com",
                phone: "0600000000"
        }})
    });
    it("Should return not user found", async () => {
        db.promise = jest.fn().mockReturnValue({
          query: jest.fn().mockResolvedValue([{ affectedRows: 0 }]) // no rows updated
        });
      
        await setPersonnelInfo(mockReq, mockRes);
      
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Aucun utilisateur trouvé avec cet ID" });
      });
    it("Should return an error is error", async () => {
        db.promise = jest.fn().mockReturnValue({
            query: jest.fn().mockRejectedValue(new Error("DB error"))
          });
        await setPersonnelInfo(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur serveur: DB error"});
    })
})