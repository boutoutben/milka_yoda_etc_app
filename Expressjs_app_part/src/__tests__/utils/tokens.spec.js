
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../../utils/tokens');
const dotenv = require('dotenv');
dotenv.config();

describe("Check the tokens", () => {
    let req, res, next;

    beforeEach(() => {
        req = {
        headers: {}
        };
        res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    it("should valid the tokens and call next", async () => {
        const payload = {id: 2, role: "admin"};
        const tokens = jwt.sign(payload, process.env.JWT_SECRET);
        req.headers.authorization = `Bearer ${tokens}`;
        await verifyToken(req, res, next);
        expect(req.user).toMatchObject(payload);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
    it("should return 401 with missing token", async () => {
        await verifyToken(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({error: "Token manquant ou invalide"});
        expect(next).not.toHaveBeenCalled();
    });
    it("should return 403 with logged out", () => {
        req.headers.authorization = 'Bearer invalidtoken';

        verifyToken(req, res, next);
    
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token invalide' });
        expect(next).not.toHaveBeenCalled();
    })
})