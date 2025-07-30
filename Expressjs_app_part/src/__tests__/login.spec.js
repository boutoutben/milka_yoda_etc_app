const db = require("../mysqlDatabase.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {loginBlock, forgotPassword, canResetPassword, resetPassword} = require("../handles/login");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { encryptData } = require("../Routes/encryptData.js");
const { loadKeys } = require("../utils/generateKeys.js");
const { publicKey, privateKey } = loadKeys();

jest.mock('../mysqlDatabase.js', () => ({
    connect: jest.fn(),
    query: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn()
}));

jest.mock("nodemailer");

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
let mockReq, mockRes, mockQuery = {};

mockRes = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
};

describe("Login user", () => {
   

    beforeEach(async () => {
        mockReq = {
            body: {
                data: await encryptData(mockData, publicKey)
            }
        };
        console.log(mockReq)
        process.env.JWT_SECRET = 'mocked_secret';

        // Reset mocks
        jwt.sign.mockClear();
        bcrypt.compare.mockClear();

        // Préparation globale de la promesse mockée et de la query
        mockQuery = jest.fn();
        db.query = mockQuery 
    });

    it("Should login successfully", async () => {
        mockQuery
            .mockResolvedValueOnce([[{
                id: 1,
                password: 'hashedPassword',
                lockout_until: null,
                failedAttempts: 0
            }]])
            .mockResolvedValueOnce([]);

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
        mockQuery.mockResolvedValueOnce([[]]);

        await loginBlock(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).toHaveBeenCalledWith("L'email ou le mot de passe est incorect");
    });

    it("Should return 400 if password does not match", async () => {
        mockQuery
            .mockResolvedValueOnce([[{
                id: 1,
                password: 'hashedPassword',
                lockout_until: null,
                failedAttempts: 0
            }]])
            .mockResolvedValueOnce([]);

        bcrypt.compare.mockResolvedValue(false);

        await loginBlock(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).toHaveBeenCalledWith("L'email ou le mot de passe est incorect");
    });

    it("Should return 500 on server error", async () => {
        // simulate query throwing an error
        const mockQuery = jest.fn().mockRejectedValue(new Error('Connection failed'));
        db.query = mockQuery
    
        await loginBlock(mockReq, mockRes);
    
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "Erreur serveur", details: "Connection failed" });
    });

    it("Should return 403 if user is temporarily locked out", async () => {
        const lockout_until = addSecondsToDate(new Date(), 60);
        mockQuery.mockResolvedValueOnce([[{
            id: 1,
            password: 'hashedPassword',
            lockout_until,
            failedAttempts: 0
        }]]);

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
                data: await encryptData({
                    ...mockData,
                    remember_me: true
                }, publicKey)
            }
        };

        mockQuery
            .mockResolvedValueOnce([[{
                id: 1,
                password: 'hashedPassword',
                lockout_until: null,
                failedAttempts: 0
            }]])
            .mockResolvedValueOnce([]);
        console.log(mockQuery)
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
        mockQuery.mockResolvedValueOnce([[{
            id: 1,
            password: 'hashedPassword',
            lockout_until: null,
            failedAttempts: 0,
            isBlock: true
        }]]);

        await loginBlock(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).toHaveBeenCalledWith("Votre compte est bloqué suite à une infraction");
    });
});

describe("forgot password", () => {
    const sendMailMock = jest.fn((_, callback) => callback(null, "mail sent"));

    beforeEach(() => {
        mockReq = {
            body: {
                email: "boutout.ben@gmail.com"
            }
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn()
        };

        jest.clearAllMocks();

        nodemailer.createTransport.mockReturnValue({
            sendMail: sendMailMock
        });
    });

    it("should send the mail with success", async () => {
        // Mock la requête SELECT
        const mockQuery = jest.fn()
            .mockResolvedValueOnce([[{ id: 1 }]]) // SELECT user
            .mockResolvedValueOnce([]);          // UPDATE

        db.query = mockQuery

        await forgotPassword(mockReq, mockRes);

        expect(sendMailMock).toHaveBeenCalled();
        expect(mockRes.send).toHaveBeenCalledWith("Un email vous a été envoyé.");
    });
    it("should return email not find", async () => {
        const mockQuery = jest.fn()
            .mockResolvedValueOnce([[]])
            db.query= mockQuery 
        await forgotPassword(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.send).toHaveBeenCalledWith("Email non trouvé");
    });
    it("should return an send mail error", async () => {
        const mockQuery = jest.fn()
            .mockResolvedValueOnce([[{ id: 1 }]]) // SELECT user
            .mockResolvedValueOnce([]);          // UPDATE

        db.query= mockQuery 
        nodemailer.createTransport.mockReturnValue({
            sendMail: jest.fn((_, callback) => callback(new Error("mock error"), null))
        });
        await forgotPassword(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalledWith("Vérifier votre email pour modifier le mot de passe");
    });
    it("shoud return an server error",async () => {
        db.query= jest.fn().mockRejectedValue(new Error("DB error"))
        await forgotPassword(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur server: DB error"});
    })
});

describe("canResetPassword", () => {
    beforeEach(() => {
        mockReq = {
            params: {
                token: "Mock token"
            }
        };
        jest.clearAllMocks();
    });
    it("should accept the reset", async () => {
        db.query= jest.fn().mockResolvedValueOnce([[{
                id: 1,
                resetToken: "Mock token",
                resetTokenExpires: new Date(Date.now() + 1000 * 10)
            },
            {
                id: 2,
                resetToken: null,
                resetTokenExpires: null
            }
        ]])
        await canResetPassword(mockReq, mockRes);
        expect(mockRes.send).toHaveBeenCalledWith("Can reset password")
    });
    it("should reject the reset for invalid token", async () => {
        db.query= jest.fn().mockResolvedValueOnce([[{
                id: 1,
                resetToken: "",
                resetTokenExpires: new Date(Date.now() + 1000 * 10)
            },
            {
                id: 2,
                resetToken: null,
                resetTokenExpires: null
            }
        ]])

        await canResetPassword(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(404)
        expect(mockRes.send).toHaveBeenCalledWith("Invalid or expired token")
    })
    it("should reject the reset for invalid token", async () => {
        db.query= jest.fn().mockResolvedValueOnce([[{
                id: 1,
                resetToken: "Mock token",
                resetTokenExpires: new Date(Date.now() - 1000 * 10)
            },
            {
                id: 2,
                resetToken: null,
                resetTokenExpires: null
            }
        ]])
        await canResetPassword(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(404)
        expect(mockRes.send).toHaveBeenCalledWith("Invalid or expired token")    
    })
    it("should return an server error", async () => {
        db.query= jest.fn().mockRejectedValue(new Error("DB error"))
        await canResetPassword(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur server: DB error"})
    })
})

describe("resetPassword", () => {
    const mockData = {
        token: "mock token", 
        password: "password123"
    }
    beforeEach(async () => {
        mockReq = {
            body: {
                data: await encryptData(mockData, publicKey)
            }
        };
        jest.clearAllMocks();
    });
    it("Should reset the password", async () => {
        db.query = jest
            .fn()
            .mockResolvedValueOnce([
                [{ resetToken: "mock token", id: 1, resetTokenExpires: Date.now() + 3600000 }],
            ])
            .mockResolvedValueOnce({}); // <--- termine bien ici

        await resetPassword(mockReq, mockRes);
      
        expect(mockRes.send).toHaveBeenCalledWith("Success");
      });
      it("should not found the user", async () => {
        db.query= jest
              .fn()
              .mockResolvedValueOnce([
                [],
              ]) // 1ère requête : SELECT
              .mockResolvedValueOnce({}), // 2ème requête : UPDATE
          await resetPassword(mockReq, mockRes);
          expect(mockRes.status).toHaveBeenCalledWith(404)
        expect(mockRes.send).toHaveBeenCalledWith("User not found");
      });
      it("should return an server error", async () => {
        db.query= jest
              .fn()
              .mockRejectedValue(new Error("DB error")) 
        await resetPassword(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500)
        expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur server: DB error"});
      })
})