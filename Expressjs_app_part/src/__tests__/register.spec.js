const registerBlock = require("../handles/register");
const db = require("../mysqlDatabase.js");
const { encryptData } = require("../Routes/encryptData");
const { hashPassword } = require("../utils/hashPassword.js");

jest.mock('../mysqlDatabase.js', () => {
    return {
        connect: jest.fn(),
        query: jest.fn()
    };
});

const mockData = {
    firstname:"John",
    lastname:'Doe',
    email:'john@gmail.com',
    phone:"0650405040",
    password:'securePass123'
}

jest.mock('../utils/hashpassword', () => ({
    hashPassword: jest.fn()
}));

describe("create users", () => {
    let mockReq, mockRes;

    beforeEach(() => {
        mockReq = {
            body: {
                data: encryptData(mockData) 
            }
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        hashPassword.mockReturnValue('hashedPassword');
    });
    it('should return 500 if db.connect fails', () => {
        db.connect.mockImplementation(cb => cb(new Error('Connection failed')));

        registerBlock(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalledWith(expect.any(Error));
    });
    it("Should return 200 if user already exists", (done) => {
        db.connect.mockImplementation(cd => cd(null));
        db.query
            .mockImplementationOnce((query, params, cb) => cb(null, [{ id: 1 }]));
        
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
    it("Should insert a new user and return 201 on success", (done) => {
        db.connect.mockImplementation(cd => cd(null));
        db.query
            .mockImplementationOnce((query, params, cb) => cb(null, []))
            .mockImplementationOnce((query, params, cb) => cb(null, { affectedRows: 1 }));
        
        registerBlock(mockReq,mockRes);

        setImmediate(() => {
            try {
                expect(hashPassword).toHaveBeenCalledWith("securePass123");
                expect(db.query).toHaveBeenCalledWith(
                    expect.stringContaining('INSERT INTO users'),
                    expect.arrayContaining(["John", "Doe", "john@gmail.com", "0650405040", "hashedPassword"]),
                    expect.any(Function)
                );
                expect(mockRes.status).toHaveBeenCalledWith(201);
                expect(mockRes.send).toHaveBeenCalledWith("Inscription réussie");
                done();
            } catch (err) {
                done(err);
            }
        });
    });
    it('Should retunr 500 if query to check user fails', () => {
        db.connect.mockImplementation(cb=> cb(null));
        db.query
            .mockImplementationOnce((query, params, cb) => cb(new Error("Query failed")));

        registerBlock(mockReq, mockRes);

        setImmediate(() => {
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    it('Should retunr 500 if insert query fails', () => {
        db.connect.mockImplementation(cb => cb(null));
        db.query
            .mockImplementationOnce((query, params, cb) => cb(null, [])) // user not found
            .mockImplementationOnce((query, params, cb) => cb(new Error('Insert failed'))); // insert error

        registerBlock(mockReq, mockRes);

        setImmediate(() => {
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});