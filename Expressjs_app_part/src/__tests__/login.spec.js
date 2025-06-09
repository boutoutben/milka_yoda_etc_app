const db = require("../mysqlDatabase.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const loginBlock = require("../handles/login");
const { encryptData } = require("../Routes/encryptData.js");

jest.mock('../mysqlDatabase.js', () => ({
    connect: jest.fn(),
    query: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn()
}));

jest.mock('bcrypt');

const addSecondsToDate = (date, n) => {
    const d = new Date(date);
    d.setTime(d.getTime() + n * 1000);
    return d;
};

const mockData = {
    email: 'john@gmail.com',
    password: 'securePass123',
    remember_me: false
};

describe("Login user", () => {
    let mockReq, mockRes;

    beforeEach(() => {
        mockReq = {
            body: {
                data: encryptData(mockData)
            }
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn(),
        };

        process.env.JWT_SECRET = 'mocked_secret';

        // Reset mocks
        jwt.sign.mockClear();
        bcrypt.compare.mockClear();
        db.promise = undefined;
    });

    it("Should login successfully", async () => {
        const mockQuery = jest.fn()
            .mockResolvedValueOnce([[{
                id: 1,
                password: 'hashedPassword',
                lockout_until: null,
                failedAttempts: 0
            }]])
            .mockResolvedValueOnce([]);
        db.promise = jest.fn().mockReturnValue({ query: mockQuery });

        bcrypt.compare.mockResolvedValue(true);
        const fakeToken = "mocked.jwt.token";
        jwt.sign.mockReturnValue(fakeToken);

        await loginBlock(mockReq, mockRes);

        expect(jwt.sign).toHaveBeenCalledWith(
            { userId: 1 },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            expiresIn: "1h",
            token: fakeToken,
            userInfo: {
                adressePostale: undefined,
                age: undefined,
                civility: undefined,
                email: undefined,
                firstname: undefined,
                id: 1,
                lastname: undefined,
                phone: undefined,
                roleName: undefined,
            }
        });
    });

    it("Should return 400 if email does not match", async () => {
        const mockQuery = jest.fn().mockResolvedValueOnce([[]]);
        db.promise = jest.fn().mockReturnValue({ query: mockQuery });

        await loginBlock(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).toHaveBeenCalledWith("L'email ou le mot de passe est incorect");
    });

    it("Should return 400 if password does not match", async () => {
        const mockQuery = jest.fn()
            .mockResolvedValueOnce([[{
                id: 1,
                password: 'hashedPassword',
                lockout_until: null,
                failedAttempts: 0
            }]])
            .mockResolvedValueOnce([]);
        db.promise = jest.fn().mockReturnValue({ query: mockQuery });

        bcrypt.compare.mockResolvedValue(false);

        await loginBlock(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).toHaveBeenCalledWith("L'email ou le mot de passe est incorect");
    });

    it("Should return 500 on server error", async () => {
        db.connect.mockImplementation(cb => cb(new Error('Connection failed')));

        await loginBlock(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalledWith("Server Error");
    });

    it("Should return 403 if user is temporarily locked out", async () => {
        const lockout_until = addSecondsToDate(new Date(), 60);
        const mockQuery = jest.fn()
            .mockResolvedValueOnce([[{
                id: 1,
                password: 'hashedPassword',
                lockout_until,
                failedAttempts: 0
            }]]);
        db.promise = jest.fn().mockReturnValue({ query: mockQuery });

        await loginBlock(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: "Trop de tentatives. Réessayez dans 15 min",
            lockoutUntil: lockout_until,
        });
    });

    it("Should return 200 and set expiresIn to 30d if remember_me is true", async () => {
        mockReq = {
            body: {
                data: encryptData({
                    ...mockData,
                    remember_me: true
                })
            }
        };

        const mockQuery = jest.fn()
            .mockResolvedValueOnce([[{
                id: 1,
                password: 'hashedPassword',
                lockout_until: null,
                failedAttempts: 0
            }]])
            .mockResolvedValueOnce([]);
        db.promise = jest.fn().mockReturnValue({ query: mockQuery });

        bcrypt.compare.mockResolvedValue(true);
        const fakeToken = "mocked.jwt.token";
        jwt.sign.mockReturnValue(fakeToken);

        await loginBlock(mockReq, mockRes);

        expect(jwt.sign).toHaveBeenCalledWith(
            { userId: 1 },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            expiresIn: "30d",
            token: fakeToken,
            userInfo: {
                adressePostale: undefined,
                age: undefined,
                civility: undefined,
                email: undefined,
                firstname: undefined,
                id: 1,
                lastname: undefined,
                phone: undefined,
                roleName: undefined,
            }
        });
    });

    it("Should return 400 if user is blocked", async () => {
        const mockQuery = jest.fn()
            .mockResolvedValueOnce([[{
                id: 1,
                password: 'hashedPassword',
                lockout_until: null,
                failedAttempts: 0,
                isBlock: true
            }]])
            .mockResolvedValueOnce([]);
        db.promise = jest.fn().mockReturnValue({ query: mockQuery });

        await loginBlock(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).toHaveBeenCalledWith("Votre compte est bloqué suite à une infraction");
    });
});