const { fetchWelcomeData } = require("../handles/welcome");
const db = require("../mysqlDatabase.js");

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

describe("fetch welcome data", () => {
    it("Should fetch the welcome data", async () => {
        db.query= jest
                .fn()
                // 1ère requête : actions
                .mockResolvedValueOnce([
                [
                    { id: 1, img: "action1.jpg", pageUrl: "/action1" },
                    { id: 2, img: "action2.jpg", pageUrl: "/action2" }
                ]
                ])
                // 2e requête : animals
                .mockResolvedValueOnce([
                [
                    { id: 1, name: "Milka", isMediator: false, isAdopted: false },
                    { id: 2, name: "Yoda", isMediator: false, isAdopted: false }
                ]
                ])
                // 3e requête : articles
                .mockResolvedValueOnce([
                [
                    { id: 1, title: "Article 1", description: "Desc 1" },
                    { id: 2, title: "Article 2", description: "Desc 2" },
                    { id: 3, title: "Article 3", description: "Desc 3" }
                ]
            ])
        await fetchWelcomeData(mockReq, mockRes);
        expect(mockRes.json).toHaveBeenCalledWith(
            {"actions": 
                [
                    {"id": 1, "img": "action1.jpg", "pageUrl": "/action1"

                    }, 
                    {"id": 2, "img": "action2.jpg", "pageUrl": "/action2"

                    }
                ], 
            "animals": 
                [
                    {"id": 1, "isAdopted": false, "isMediator": false, "name": "Milka"

                    }, {"id": 2, "isAdopted": false, "isMediator": false, "name": "Yoda"

                    }
                ], 
            "articles": 
                [
                    {"description": "Desc 1", "id": 1, "title": "Article 1"

                    }, {"description": "Desc 2", "id": 2, "title": "Article 2"

                    }, {"description": "Desc 3", "id": 3, "title": "Article 3"

                    }
                ]
            }  
        )
    });
    it("Should return an error if error", async () => {
        db.query= jest.fn().mockRejectedValueOnce(new Error("DB error"))
        await fetchWelcomeData(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur serveur: DB error"})
    })
})