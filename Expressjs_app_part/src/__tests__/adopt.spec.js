const { fetchAdopt, fetchAnimalsById, fetchRacesAndIncompatibility, addAnimals, editAnimals, deleteAnimal } = require("../handles/adopt");
const db = require("../mysqlDatabase.js");
const fs = require("fs");
const path = require("path");

const AnimalsRaces = require("../mongoose/Schemas/animalsRaces.js");
const AnimalsIncompatibility = require("../mongoose/Schemas/animalsIncompability.js");
const { id } = require("../../jest.config.cjs");
const { deleteActions } = require("../handles/actions");

jest.mock('fs', ()=> ({
    unlink: jest.fn(),
    promises: {
      unlink: jest.fn()
    }
}));

jest.mock('../mongoose/Schemas/animalsRaces.js', () => ({
    findById: jest.fn(),
    find: jest.fn()
  }));
  
  jest.mock('../mongoose/Schemas/animalsIncompability.js', () => ({
    findById: jest.fn(),
    find: jest.fn()
  }));

let mockReq, mockRes;
jest.mock('../mysqlDatabase.js', () => {
    return {
      promise: jest.fn()
    };
  });

describe("Fetch adopt", () => {
    beforeEach(() => {
        mockReq = {};
        mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
        jest.clearAllMocks();
      });

    it('Should fetch adopt', async () => {
        db.query = jest.fn()
                .mockResolvedValueOnce([[{ 
                    id: 1, 
                    name: 'Test', 
                    description: 'Mocked' },
                    { 
                        id: 2, 
                        name: 'Test2', 
                        description: 'Mocked2' }
                ]])
                .mockResolvedValueOnce([]) // or whatever your update query returns
        await fetchAdopt(mockReq, mockRes);
        expect(mockRes.json).toHaveBeenCalledWith({animals: [{ 
            id: 1, 
            name: 'Test', 
            description: 'Mocked' 
        },
        { 
            id: 2, 
            name: 'Test2', 
            description: 'Mocked2' }]})
    });
    it('Should return an error',  async () => {
        db.query= jest.fn().mockRejectedValue(new Error("DB error"))
        await fetchAdopt(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur serveur Error: DB error"});
    })
});

describe("fetchAnimalsById", () => {
    beforeEach(() => {
      mockReq = {
        params: { id: 1 }
      };
  
      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      jest.clearAllMocks();
    });
  
    it("Should return the animal linked to the id with races and incompatibility", async () => {
      // Step 1: Mock DB response (returns animal with races and incompatibility)
      const mockAnimalRow = {
        id: 1,
        name: "Test",
        description: "Mocked",
        races: JSON.stringify([101, 102]),
        incompatibility: JSON.stringify([201, 202])
      };
  
      db.query = jest.fn().mockResolvedValue([[mockAnimalRow]])
  
      // Step 2: Mock related model methods
      AnimalsRaces.findById.mockImplementation(id =>
        Promise.resolve({
          id,
          name: `Race ${id}`,
          espece: `Species ${id}`
        })
      );
  
      AnimalsIncompatibility.findById.mockImplementation(id =>
        Promise.resolve({
          id,
          imgName: `img-${id}.png`
        })
      );
  
      // Step 3: Call the controller
      await fetchAnimalsById(mockReq, mockRes);
  
      // Step 4: Expect the response to match
      expect(mockRes.json).toHaveBeenCalledWith({
        animal: {
          id: 1,
          name: "Test",
          description: "Mocked",
          races: JSON.stringify([101, 102]),
          incompatibility: JSON.stringify([201, 202])
        },
        animalsRaces: [
          { name: "Race 101", espece: "Species 101" },
          { name: "Race 102", espece: "Species 102" }
        ],
        animalsIncompability: [
          { imgName: "img-201.png" },
          { imgName: "img-202.png" }
        ]
      });
    });

    it("Should return animal not found", async () => {
        db.query = jest.fn().mockResolvedValue([[]])
        await fetchAnimalsById(mockReq, mockRes);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Animal non trouvé" })
    });

    it("Should return the animal linked to the id with races", async () => {
        const mockAnimalRow = {
            id: 1,
            name: "Test",
            description: "Mocked",
            races: JSON.stringify([101, 102]),
            incompatibility: null
          };
      
          db.query= jest.fn().mockResolvedValue([[mockAnimalRow]])
    
          // Step 2: Mock related model methods
          AnimalsRaces.findById.mockImplementation(id =>
            Promise.resolve({
              id,
              name: `Race ${id}`,
              espece: `Species ${id}`
            })
          );
          await fetchAnimalsById(mockReq, mockRes);
  
      // Step 4: Expect the response to match
      expect(mockRes.json).toHaveBeenCalledWith({
        animal: {
          id: 1,
          name: "Test",
          description: "Mocked",
          races: JSON.stringify([101, 102]),
          incompatibility:null
        },
        animalsRaces: [
          { name: "Race 101", espece: "Species 101" },
          { name: "Race 102", espece: "Species 102" }
        ],
        animalsIncompability: null
      });
    });

    it("Should return an error is error", async () => {
        db.query = jest.fn().mockRejectedValue(new Error("DB error"))

        await fetchAnimalsById(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "Erreur serveur Error: DB error" })
        
    })
  });

  describe("Fetch races and incompatibility", () => {
    beforeEach(() => {
        mockReq = {
          query: {
            species: null
          }
        };
    
        mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
    
        jest.clearAllMocks();
      });
      it('should return all races and incompatibilities if no species is provided', async () => {
        AnimalsRaces.find.mockReturnValueOnce({
            lean: jest.fn().mockResolvedValue([
              { name: 'Race A', espece: 'Chien' },
              { name: 'Race B', espece: 'Chien' },
              {name: "Race c", espece:"chat"}
            ])
          });
        
          AnimalsIncompatibility.find.mockReturnValueOnce({
            lean: jest.fn().mockResolvedValue([
              { name: 'Test', imgName: 'img1.png' }
            ])
          });
    
        await fetchRacesAndIncompatibility(mockReq, mockRes);
        expect(AnimalsRaces.find).toHaveBeenCalledWith(null);
        expect(AnimalsIncompatibility.find).toHaveBeenCalled();
        expect(mockRes.json).toHaveBeenCalledWith({
          races: [
            { name: 'Race A', espece: 'Chien' },
            { name: 'Race B', espece: 'Chien' },
            {name: "Race c", espece:"chat"}
          ],
          incompatibility: [
            { name: 'Test', imgName: 'img1.png' }
          ]
        });
      });
      it("should filter races by species if species is provided", async () => {
        mockReq = {
            query: {
              species: "chien"
            }
          };
        AnimalsRaces.find.mockReturnValueOnce({
            lean: jest.fn().mockResolvedValue([
              { name: 'Race A', espece: 'chien' },
              { name: 'Race B', espece: 'chien' }
            ])
          });
        
          AnimalsIncompatibility.find.mockReturnValueOnce({
            lean: jest.fn().mockResolvedValue([
              { name: 'Test', imgName: 'img1.png' }
            ])
          });
          await fetchRacesAndIncompatibility(mockReq, mockRes);
          expect(AnimalsRaces.find).toHaveBeenCalledWith({ espece: 'chien' });
          expect(mockRes.json).toHaveBeenCalledWith({
            races: [
              { name: 'Race A', espece: 'chien' },
              { name: 'Race B', espece: 'chien' }
            ],
            incompatibility: [
              { name: 'Test', imgName: 'img1.png' }
            ]
          });
    });
    it("Should return an error if error", async () => {
        AnimalsRaces.find.mockImplementation(() => { throw new Error('DB error') });
        await fetchRacesAndIncompatibility(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: expect.stringContaining('Erreur serveur:') })
    })
  })

  describe("Add animals", () => {
    beforeEach(() => {
      mockReq = {
        body: {
          name: "test",
          description: "description du test",
          sexe: 1,
          isSterile: true,
          races: [102, 103],
          born: "2018-10-28",
          incompatibility: null
        },
        file: {
          filename: "test.jpg"
        }
      };
  
      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      jest.clearAllMocks();
    });
  
    it("should add the animal and respond with success", async () => {
      const mockQuery = jest.fn().mockResolvedValueOnce([]);
      db.query= mockQuery
  
      await addAnimals(mockReq, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Animal ajouter" });
    });
  
    it("Should return error if error", async () => {
      const mockQueryError = jest.fn().mockRejectedValueOnce(new Error("DB Error"));
      db.query= mockQueryError 
  
      await addAnimals(mockReq, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining("Erreur serveur:")
        })
      );
    });
  });

  describe("Edit animals", () => {
    beforeEach(() => {
      mockReq = {
        body: {
          name: "test",
          description: "description du test",
          sexe: 1,
          isSterile: true,
          races: [102, 103],
          born: "2018-10-28",
          incompatibility: null
        },
        file: null,
        params: {
            id: 1
        }
      };
  
      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      jest.clearAllMocks();
    });
  
    it("should update animal without new file", async () => {
        // Mock SELECT imgName result (no file)
        db.query= jest.fn()
                .mockResolvedValueOnce([[{
                    imgName: "test1"
                }]])
                .mockResolvedValueOnce([])
    
        await editAnimals(mockReq, mockRes);
    
        //expect(db.promise).toHaveBeenCalledTimes(2); // SELECT + UPDATE
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Animal mis à jour avec succès' });
      });
      it("Should update animal and delete old image if new file provided", async () => {
        mockReq = {
          body: {
            name: "test",
            description: "description du test",
            sexe: 1,
            isSterile: true,
            races: [102, 103],
            born: "2018-10-28",
            incompatibility: null
          },
          file: { filename: "newImg.jpg" },
          params: {
              id: 1
          }
        };
    
        db.query= jest
            .fn()
            .mockResolvedValueOnce([[{ imgName: "oldImage.jpg" }]]) // SELECT imgName
            .mockResolvedValueOnce([]) // UPDATE
    
        fs.promises.unlink.mockResolvedValue();
    
        await editAnimals(mockReq, mockRes);
    
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Animal mis à jour avec succès' });
      });
      it("Should return delete file error", async () => { 
        mockReq = {
          body: {
            name: "test",
            description: "description du test",
            sexe: 1,
            isSterile: true,
            races: [102, 103],
            born: "2018-10-28",
            incompatibility: null
          },
          file: { filename: "newImg.jpg" },
          params: {
              id: 1
          }
        };  
        db.query = jest
            .fn()
            .mockResolvedValueOnce([[{ imgName: "oldImage.jpg" }]]) // SELECT imgName
            .mockResolvedValueOnce([]) // UPDATE
        fs.promises.unlink.mockRejectedValue(new Error("Delete error"));
        await editAnimals(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Delete file error: Delete error' });
      })
      it("Should return an error if error", async () => {
        const mockQueryError = jest.fn().mockRejectedValueOnce(new Error("DB Error"));
        db.query= mockQueryError 
        await editAnimals(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({
              error: expect.stringContaining("Erreur serveur:")
            })
          );
      })
  });

  describe("Delete animales", () => {
    beforeEach(() => {
      mockReq = {
        params: {
          id: 1
        }
      }
      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn()
      }
    })

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("Should delete the animals with success", async () => {
      jest.spyOn(fs.promises, "unlink")
      .mockImplementationOnce(() => Promise.resolve())
      const mockQuery = jest.fn()
        .mockResolvedValueOnce([[{ imgName: "test.jpg" }]])  // 1ère requête SELECT
        .mockResolvedValueOnce([{ affectedRows: 1 }]);       // 2ème requête DELETE
    
      db.query= mockQuery 
    
      await deleteAnimal(mockReq, mockRes);
    
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalledWith();
    });
    it("Should return animal not found", async () => {
       fs.promises.unlink.mockResolvedValue()
       const mockQuery = jest.fn()
       .mockResolvedValueOnce([[{ imgName: "test.jpg" }]])  // 1ère requête SELECT
       .mockResolvedValueOnce([{ affectedRows: 0 }]);       // 2ème requête DELETE
   
     db.query= mockQuery 
      await deleteAnimal(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Animal non trouvé" });
    });
    it("Should return delete img error", async () => {
      db.query= jest.fn().mockResolvedValueOnce([[{ imgName: "test.jpg" }]])
    
      jest.spyOn(fs.promises, "unlink")
        .mockImplementationOnce(() => Promise.reject(new Error("Delete error"))); // simulate error
    
      await deleteAnimal(mockReq, mockRes);
    
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Delete img error: Delete error"
      });
    });
    it("Should return an error if error", async () => {
      const mockQueryError = jest.fn().mockRejectedValueOnce(new Error("DB Error"));
      db.query= mockQueryError
      await deleteAnimal(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({"error": "Erreur serveur : DB Error"}
      );
    })
  })