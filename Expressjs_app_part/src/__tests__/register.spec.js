const registerBlock = require("../handles/register");
const db = require("../mysqlDatabase.js");
const { encryptData } = require("../Routes/encryptData");
const { hashPassword } = require("../utils/hashPassword.js");
const { loadKeys } = require("../utils/generateKeys.js");
const { publicKey, privateKey } = loadKeys();

jest.mock('../mysqlDatabase.js', () => {
    return {
        connect: jest.fn(),
        query: jest.fn()
    };
});

let mockData;

jest.mock('../utils/hashpassword', () => ({
    hashPassword: jest.fn()
}));

describe("create users", () => {
    let mockReq, mockRes;

    beforeEach(async () => {
         mockData = {
    firstname:"John",
    lastname:'Doe',
    email:'john@gmail.com',
    phone:"0650405040",
    password:'SecurePass123!',
    confirmPassword:'SecurePass123!'
}
        mockReq = {
            body: {
                data: await encryptData(mockData, publicKey) 
            }
        }; 

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };

        hashPassword.mockReturnValue('hashedPassword');
    });
    it("Should return 200 if user already exists", (done) => {
        db.query
            .mockResolvedValue([[{ id: 1 }]]);
        
        registerBlock(mockReq, mockRes);

        setImmediate(() => {
            try {
                expect(mockRes.status).toHaveBeenCalledWith(200);
                expect(mockRes.send).toHaveBeenCalledWith("Vous avez déjà un compte");
                done();
            } catch (error) {
                done(error);
            }
        })
    });
    it("Should insert a new user and return 201 on success", async () => {
  db.query
    .mockResolvedValueOnce([[]]) // SELECT: aucun utilisateur existant
    .mockResolvedValueOnce({ affectedRows: 1 }); // INSERT réussi

  await registerBlock(mockReq, mockRes);

  expect(mockRes.send).toHaveBeenCalledWith("Inscription réussie");
  expect(hashPassword).toHaveBeenCalledWith("SecurePass123!");

  expect(db.query).toHaveBeenCalledWith(
    expect.stringContaining("INSERT INTO users"),
    ["John", "Doe", "john@gmail.com", "0650405040", "hashedPassword"]
  );

  expect(mockRes.status).toHaveBeenCalledWith(201);
});
    it("should return 400 error if invalid data", async () => {
        mockData.email = "";
        mockReq = {
            body: {
                data: await encryptData(mockData, publicKey)
            }
        };
        await registerBlock(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({"errors": []})
    })
    it('Should retunr 500 if query to check user fails', () => {
        db.query
            .mockRejectedValue(new Error("Query failed"));

        registerBlock(mockReq, mockRes);

        setImmediate(() => {
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith("Une erreur est survenue:", "Query failed");
        });
    });

    it('Should retunr 500 if insert query fails', () => {
        db.query
            .mockResolvedValue()
            .mockRejectedValue(new Error("Register fails"))

        registerBlock(mockReq, mockRes);

        setImmediate(() => {
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith("Une erreur est survenue:", "Register fails");
        });
    });
});