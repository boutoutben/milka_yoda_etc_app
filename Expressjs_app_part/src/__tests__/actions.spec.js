const { unlink } = require("fs");
const { addAction, fetchActions, editActions, deleteActions, updateOrder } = require("../handles/actions");
const db = require("../mysqlDatabase.js");
const fs = require("fs")


jest.mock('../mysqlDatabase.js', () => {
    return {
        connect: jest.fn(),
        query: jest.fn()
    };
});

jest.mock("fs", () => ({
  unlink: jest.fn(),
  promises: {
    unlink: jest.fn()
  }
}))
let mockReq, mockRes;


describe("addAction", () => {

  beforeEach(() => {
    mockReq = {
      body: {
        title: "Titre de l'action",
        description: "Description de l'action pour donner des infos",
        pageUrl: "nom_de_la_page",
      },
      file: {
        filename: 'mock-image-123.png'
      },
    };

    mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
  });

  it("should add an action", async () => {
    db.promise = jest.fn().mockReturnValue({
        query: jest.fn()
            // 1st call: SELECT * FROM users WHERE email = ?
            .mockResolvedValueOnce([]) // or whatever your update query returns
    });

    await addAction(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Action ajoutée avec succès !"
    });
  });
  it("should handle a database error gracefully", async () => {
    const db = require('../mysqlDatabase');
    db.promise = () => ({
      query: jest.fn().mockRejectedValue(new Error("DB error"))
    });

    await addAction(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
         error: "Erreur lors de l'ajout de l'action: Error: DB error" 
        });
  });
});

jest.mock('../mysqlDatabase.js', () => {
    return {
      promise: jest.fn()
    };
  });

  describe("fetchActions", () => {
  
    beforeEach(() => {
      mockReq = {};
      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      jest.clearAllMocks();
    });
  
    it("should return all actions", async () => {
      // ici on mock la méthode promise pour qu'elle retourne un objet avec query mocké
      db.promise = jest.fn().mockReturnValue({
        query: jest.fn()
            // 1st call: SELECT * FROM users WHERE email = ?
            .mockResolvedValueOnce([[{ 
                id: 1, 
                title: 'Test', 
                description: 'Mocked' }]])
            // 2nd call: UPDATE user login data maybe
            .mockResolvedValueOnce([]) // or whatever your update query returns
    });
  
      await fetchActions(mockReq, mockRes);
  
      expect(mockRes.json).toHaveBeenCalledWith({
        actions: [{ id: 1, title: 'Test', description: 'Mocked' }]
      });
    });
  
    it("should handle DB error", async () => {
      db.promise.mockImplementation(() => ({
        query: jest.fn().mockRejectedValue(new Error("DB error"))
      }));
  
      await fetchActions(mockReq, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Error fetching actions: Error: DB error"
      });
    });
  });

  describe("edit actions", () => {
    beforeEach(() => {
        mockReq = {
          body: {
            title: "Titre de l'action",
            description: "Description de l'action pour donner des infos",
            pageUrl: "nom_de_la_page",
          }
        };
    
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
      });
    it("Should edit the action without file", async () => {
        db.promise = jest.fn().mockReturnValue({
            query: jest.fn()
                // 1st call: SELECT * FROM users WHERE email = ?
                .mockResolvedValueOnce([{
                    actions: [{ id: 1, title: 'Test', description: 'Mocked' }]
                  }]) // or whatever your update query returns
        });
        await editActions(mockReq, mockRes);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: "Mise à jour réussie !"
        })
    })

    it("Should edit the action with file", async () => {
        // Prépare une requête avec fichier
        mockReq = {
          body: {
            title: "Titre de l'action",
            description: "Description de l'action pour donner des infos",
            pageUrl: "nom_de_la_page",
          },
          file: {
            filename: "test.jpg"
          }
        };
      
        // Simule la réponse de la BDD
        db.promise = jest.fn().mockReturnValue({
          query: jest.fn().mockResolvedValueOnce([
            [{ id: 1, title: 'Test', description: 'Mocked' }]
          ])
        });
      
        await editActions(mockReq, mockRes);
      
        expect(mockRes.json).toHaveBeenCalledWith({
          message: "Mise à jour réussie !"
        });
      });
      it("Should return an error if error", async () => {
        db.promise.mockImplementation(() => ({
          query: jest.fn().mockRejectedValue(new Error("DB error"))
        }));
      
        await editActions(mockReq, mockRes);
      
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
          error: "Erreur serveur: Error: DB error"
        });
      });
  });

  describe("Delete actions", () => {
    beforeEach(() => {
        mockReq = {
            params: {
              id: 1
            }
          };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
      });
    it("Should delete the action", async () => {
        db.promise = jest.fn().mockReturnValue({
            query: jest.fn().mockResolvedValueOnce([
              [{ imgName: "test.jpg" }]
            ])
          });
          fs.promises.unlink.mockResolvedValue()
          await deleteActions(mockReq, mockRes);
          expect(mockRes.json).toHaveBeenCalledWith({message: "Supprimé"})
    });
    it("Should return action not found", async () => {
      db.promise = jest.fn().mockReturnValue({
        query: jest.fn().mockResolvedValueOnce([
          []
        ])
      });
      await deleteActions(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Action not found"
      })
    })
    it("Should return img delete error", async () => {
      db.promise = jest.fn().mockReturnValue({
          query: jest.fn().mockResolvedValueOnce([
            [{ imgName: "test.jpg" }]
          ])
        });
        fs.promises.unlink.mockRejectedValue(new Error("Delete img error"));
        await deleteActions(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
          expect(mockRes.json).toHaveBeenCalledWith({
            error: "Delete img error: Delete img error"
          })
  });
    it("Should return an error if delete error", async () => {
        db.promise.mockImplementation(() => ({
            query: jest.fn().mockRejectedValue(new Error("DB error"))
          }));
          await deleteActions(mockReq, mockRes);
          expect(mockRes.status).toHaveBeenCalledWith(500);
          expect(mockRes.json).toHaveBeenCalledWith({
            error: "Delete error: DB error"
          })
    })
  });

  describe('updateOrder', () => {
  
    beforeEach(() => {
      mockReq = {
        body: {
          actions: [
            { id: 1 },
            { id: 2 },
            { id: 3 },
          ],
        },
      };
  
      mockRes = {
        status: jest.fn(() => mockRes),
        json: jest.fn(),
      };
    });
  
    it('should return 400 if actions is not an array', async () => {
      mockReq.body.actions = 'not-an-array';
  
      await updateOrder(mockReq, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'actions must be an array' });
    });
  
    it('should update all actions and return success', async () => {
      const mockQuery = jest.fn().mockResolvedValue([{}]);
      db.promise.mockReturnValue({ query: mockQuery });
  
      await updateOrder(mockReq, mockRes);
  
      expect(mockQuery).toHaveBeenCalledTimes(3);
      expect(mockQuery).toHaveBeenCalledWith('UPDATE actions SET actionOrder = ? WHERE id = ?', [0, 1]);
      expect(mockQuery).toHaveBeenCalledWith('UPDATE actions SET actionOrder = ? WHERE id = ?', [1, 2]);
      expect(mockQuery).toHaveBeenCalledWith('UPDATE actions SET actionOrder = ? WHERE id = ?', [2, 3]);
  
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, updated: 3 });
    });
  
    it('should handle errors and return 500', async () => {
      const mockQuery = jest.fn().mockRejectedValue(new Error('DB error'));
      db.promise.mockReturnValue({ query: mockQuery });
  
      await updateOrder(mockReq, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Unable to update order Error: DB error" });
    });
  });