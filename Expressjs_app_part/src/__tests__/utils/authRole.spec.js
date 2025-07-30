const db = require("../../mysqlDatabase.js");
const { authRole } = require("../../utils/handleRoles.js");

jest.mock('../../mysqlDatabase.js', () => {
    const queryMock = jest.fn();
    return {

        query: queryMock
    };
});
  
  describe("authRole middleware", () => {
    let req, res, next;
  
    beforeEach(() => {
      req = { user: { userId: 1 } };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      next = jest.fn();
    });
  
    it("should call next() if user has the correct role", async () => {
      const mockUser = {
        firstname: "Jane",
        lastname: "Doe",
        email: "jane@example.com",
        phone: "1234567890",
        role: "admin",
      };
  
      db.query.mockResolvedValueOnce([[mockUser], []])
  
      const middleware = authRole("admin");
      await middleware(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  
    it("should return 403 if user has the wrong role", async () => {
      const mockUser = {
        firstname: "John",
        lastname: "Smith",
        email: "john@example.com",
        phone: "0000000000",
        role: "user"
      };
  
      db.query.mockResolvedValueOnce([[mockUser]]);
  
      const middleware = authRole("admin");
      await middleware(req, res, next);
  
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: "Vous n'êtes pas autorisé" });
    });
    it("Should return 500 if error server", async () => {
        db.query.mockRejectedValue(new Error("DB error"));
        const middleware = authRole("admin");
        await middleware(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: "Server error: DB error"});
    })
  });