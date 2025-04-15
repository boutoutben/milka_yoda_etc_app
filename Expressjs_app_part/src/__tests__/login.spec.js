import db from "../mysqlDatabase.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginBlock } from "../handles/login.mjs";

jest.mock('../mysqlDatabase.mjs', () => {
    return {
        connect: jest.fn(),
        query: jest.fn()
    };
});

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

jest.mock('bcrypt')

const addSecondsToDate = (date, n) => {
  const d = new Date(date);
  d.setTime(d.getTime() + n * 1000);
  return d;
};

describe("Login user", () => {
    let mockReq, mockRes;

    beforeEach(() => {
        mockReq = {
            body: {
                email: 'john@gmail.com',
                password: 'securePass123',
                remember_me: false
            }
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn(),
        };

        process.env.JWT_SECRET = 'mocked_secret';
    });

    it("Should login in", async () => {
        db.promise = jest.fn().mockReturnValue({
            query: jest.fn()
                // 1st call: SELECT * FROM users WHERE email = ?
                .mockResolvedValueOnce([[{
                    id: 1,
                    password: 'hashedPassword',
                    lockout_until: null,
                    failedAttempts: 0
                }]])
                // 2nd call: UPDATE user login data maybe
                .mockResolvedValueOnce([]) // or whatever your update query returns
        });
        bcrypt.compare.mockImplementation(() => Promise.resolve(true));
        const fakeToken = "mocked.jwt.token";
        jwt.sign.mockReturnValue(fakeToken);

        await loginBlock(mockReq, mockRes);
        expect(jwt.sign).toHaveBeenCalledWith(
            { userId: expect.any(Number) },
            process.env.JWT_SECRET,
            { expiresIn: expect.any(String) }
        );
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(
            {
                "expiresIn": "1h", 
                "token": "mocked.jwt.token", 
                "user": {
                    "failedAttempts": 0, 
                    "id": 1, "lockout_until": null, 
                    "password": "hashedPassword"
                }
            }
        )
    });

    it("Should return 400 error if the email no match", async () => {
        db.promise = jest.fn().mockReturnValue({
            query: jest.fn()
                // 1st call: SELECT * FROM users WHERE email = ?
                .mockResolvedValueOnce([[]])
            
        });
        await loginBlock(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).toHaveBeenCalledWith("L'email ou le mot de passe est incorect");
    });

    it("should return 400 if the password no match", async () => {
        db.promise = jest.fn().mockReturnValue({
            query: jest.fn()
                .mockResolvedValueOnce([[{
                    id: 1,
                    password: 'hashedPasswor',
                    lockout_until: null,
                    failedAttempts: 0
                }]])
                .mockResolvedValueOnce([]) // or whatever your update query returns
        });
         bcrypt.compare.mockImplementation(() => Promise.resolve(false));

        await loginBlock(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).toHaveBeenCalledWith("L'email ou le mot de passe est incorect");
    });

    it("Should return 500 error if error in the server",async () => {
        db.connect.mockImplementation(cb => cb(new Error('Connection failed')));
        await loginBlock(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalledWith("Server Error");
    })

    it("should return 403 error if too many try and the block time is not up", async () => {
        const lockout_until = addSecondsToDate(new Date(), 60)
        db.promise = jest.fn().mockReturnValue({
            query: jest.fn()
                // 1st call: SELECT * FROM users WHERE email = ?
                .mockResolvedValueOnce([[{
                    id: 1,
                    password: 'hashedPassword',
                    lockout_until: lockout_until,
                    failedAttempts: 0
                }]])
        });
        await loginBlock(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: "Trop de tentatives. Réessayez dans 15 min",
            lockoutUntil: lockout_until,
        });
    });
    it("should ExpireIn 30d if remember me", async () => {
        mockReq = {
            body: {
                email: 'john@gmail.com',
                password: 'securePass123',
                remember_me: true
            }
        };
        db.promise = jest.fn().mockReturnValue({
            query: jest.fn()
                // 1st call: SELECT * FROM users WHERE email = ?
                .mockResolvedValueOnce([[{
                    id: 1,
                    password: 'hashedPassword',
                    lockout_until: null,
                    failedAttempts: 0
                }]])
                // 2nd call: UPDATE user login data maybe
                .mockResolvedValueOnce([]) // or whatever your update query returns
        });
        bcrypt.compare.mockImplementation(() => Promise.resolve(true));
        const fakeToken = "mocked.jwt.token";
        jwt.sign.mockReturnValue(fakeToken);

        await loginBlock(mockReq, mockRes);
        expect(jwt.sign).toHaveBeenCalledWith(
            { userId: expect.any(Number) },
            process.env.JWT_SECRET,
            { expiresIn: expect.any(String) }
        );
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(
            {
                "expiresIn": "30d", 
                "token": "mocked.jwt.token", 
                "user": {
                    "failedAttempts": 0, 
                    "id": 1, "lockout_until": null, 
                    "password": "hashedPassword"
                }
            }
        )
    })
});