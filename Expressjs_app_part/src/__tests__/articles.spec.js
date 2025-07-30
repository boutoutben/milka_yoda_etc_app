const { fetchArticles, fetchArticlesById, fetchArticlesDetail, addArticles, editArticles, cancelleEditArticle, deleteArticle, editDescriptionArticle } = require("../handles/articles.js");
const db = require("../mysqlDatabase.js");
const fs = require("fs");
const path = require("path")
const crypto = require('crypto');
const {generateRandomName} = require("../utils/generateRandowName.js");

jest.mock('../utils/generateRandowName.js', () => ({
    generateRandomName: jest.fn(() => 'mocked-name.txt')
  }));
  jest.mock('crypto', () => ({
    randomUUID: jest.fn(() => '123e4567-e89b-12d3-a456-426614174000'), 
  }));
jest.mock("fs", () => {
    return {
        readFile: jest.fn(),
        promises: {
            writeFile: jest.fn(),
            unlink: jest.fn(),
            mkdir: jest.fn(),
        },
        writeFile: jest.fn(),
        unlink: jest.fn(),
    }
})

jest.mock('../mysqlDatabase.js', () => {
    return {
        connect: jest.fn(),
        query: jest.fn()
    };
});
let mockReq, mockRes;

mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

describe("fetchArticles", () => {
    beforeEach(() => {
      mockReq = {};
      jest.clearAllMocks();
    });
  
    it("Should return all articles", async () => {
      const articles = [
        { id: 1, title: "test", description: "test description" },
        { id: 2, title: "test", description: "test description" }
      ];
  
      db.query= jest.fn().mockResolvedValue([articles])
  
      await fetchArticles(mockReq, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(articles);
    });

    it("Should return an error is error", async () => {
        db.query= jest.fn().mockRejectedValue(new Error("DB error"))

        await fetchArticles(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Erreur serveur: Error: DB error"
        });
    })
  });

  describe("Fetch article by id", () => {
    beforeEach(() => {
        mockReq = {
            params: {
                id: 1
            }
        };
        jest.clearAllMocks();
    });
    it("Should return the article with sucess", async () => {
        db.query= jest.fn().mockResolvedValue([[{
                id: 1,
                title: 'test',
                description: "test's description",
                fileName: "test.txt"
            }]])
        await fetchArticlesById(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            id: 1,
            title: 'test',
            description: "test's description",
            fileName: "test.txt"
        })
    });
    it("Should return article not found", async () => {
        db.query= jest.fn().mockResolvedValue([[]])
        await fetchArticlesById(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({message: "L'article n'est pas été trouvé"});
    });
    it("Sould return ar error if error", async () => {
        db.query= jest.fn().mockRejectedValue(new Error("DB error"))
        await fetchArticlesById(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur serveur: DB error"});
    })
  })

describe("Fetch article detail", () => {
    beforeEach(() => {
        mockReq = {
            params: {
                id: 1
            }
        };
        jest.clearAllMocks();
    });

    it("Should return the article's detail linked to the id", async () => {
        const fakeData = "fake content";
        process.env.CLIENT_APP_PART = __dirname;
    
        db.query= jest.fn().mockResolvedValue([[{ fileName: "test.txt" }]])
    
        fs.readFile.mockImplementation((path, encoding, callback) => {
          callback(null, fakeData);
        });
    
        await fetchArticlesDetail(mockReq, mockRes);
    
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ content: fakeData });
      });

      it("Should return article not found", async () => {
        db.query= jest.fn().mockResolvedValue([[{}]])
        
          await fetchArticlesDetail(mockReq, mockRes);
          expect(mockRes.status).toHaveBeenCalledWith(404);
          expect(mockRes.json).toHaveBeenCalledWith({ error: "Article introuvable" });
      });

      it("Should return error file", async () => {
        const fakeError = new Error("Fichier introuvable");

        process.env.CLIENT_APP_PART = __dirname;

        db.query= jest.fn().mockResolvedValue([[{ fileName: "test.txt" }]])

        fs.readFile.mockImplementation((path, encoding, callback) => {
            callback(fakeError, null); // Simule une erreur
        });

        await fetchArticlesDetail(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur fichier article: Fichier introuvable"})
      });

      it("Should return an error is error", async () => {
        db.query= jest.fn().mockRejectedValue(new Error("DB erreur"))

        await fetchArticlesDetail(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur serveur: DB erreur"})
      })
});

describe("Add articles", () => {
    beforeEach(() => {
        mockReq = {
            body: {
                title: "test's title",
                description: "Test's description"
            },
            file: {
                filename: 'test.jpg'
            }
        }
        jest.clearAllMocks();
    })
    afterAll(() => {
        jest.restoreAllMocks();
      });
    it("Should add an article with success", async () => {
        process.env.CLIENT_APP_PART = __dirname;
        const mockUuid = '123e4567-e89b-12d3-a456-426614174000';
      
        fs.promises.mkdir.mockResolvedValue()
        fs.promises.writeFile.mockResolvedValue()
      
        await addArticles(mockReq, mockRes);
      
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({message: "Article créer", id: mockUuid});
      });
    it("Should return failed to create folder", async () =>{
        fs.promises.mkdir.mockRejectedValue(new Error("Imposible to create folder"))
          await addArticles(mockReq, mockRes);
          expect(mockRes.status).toHaveBeenCalledWith(500);
          expect(mockRes.json).toHaveBeenCalledWith({error: "Failed to create folder: Imposible to create folder"})
    });
    it("Should return wrife file error", async () => {
        fs.promises.mkdir.mockResolvedValue()
        fs.promises.writeFile.mockRejectedValue(new Error("Write error"));
        await addArticles(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Write file error: Write error"})
    })
    it("Should return 500 if unexpected server error occurs", async () => {
        process.env.CLIENT_APP_PART = __dirname;
      
        // Force une erreur dès le début
        jest.spyOn(crypto, 'randomUUID').mockImplementation(() => {
          throw new Error("Unexpected failure");
        });
      
        await addArticles(mockReq, mockRes);
      
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
          error: "Erreur serveur: Unexpected failure"
        });
      });
})

describe("edit articles description", () => {
    beforeEach(() => {
        mockReq = {
            body: {
                title: "test's title",
                description: "test's description",
                articleId: 1
            },
            file: null
        }
        jest.clearAllMocks();
    });

    it("Should edit the article description with success wihout file", async () => {
        db.query = jest.fn()
                .mockResolvedValueOnce([[{imgName: "lastTest.jpg"}]])
        await editDescriptionArticle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({message: "Mise à jour réussie !"})
    });
    it("Should edit the article description with sucess with file", async () => {
        mockReq = {
            body: {
                title: "test's title",
                description: "test's description",
                articleId: 1
            },
            file: {
                filename: 'test.jpg'
            }
        }
        db.query = jest.fn()
                .mockResolvedValueOnce([[{imgName: "lastTest.jpg"}]])
        fs.promises.unlink.mockResolvedValue()
        await editDescriptionArticle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({message: "Mise à jour réussie !"})
    });
    it("Should return delete file error", async () => {
        mockReq = {
          body: {
            title: "test's title",
            description: "test's description",
            articleId: 1
          },
          file: {
            filename: 'test.jpg'
          }
        };
      
        db.query= jest.fn()
            .mockResolvedValueOnce([[{ imgName: "lastTest.jpg" }]])
      
        fs.promises.unlink.mockRejectedValue(new Error("Delete error"));
      
        await editDescriptionArticle(mockReq, mockRes);
      
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "Delete file error: Delete error" });
      });
    it("Should return an error is error", async () => {
        db.query= jest.fn().mockRejectedValue(new Error("DB error"))
        await editDescriptionArticle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur serveur: DB error"})
    })
})

describe("edit articles", () => {
    beforeEach(() => {
        mockReq = {
            params: {
                id: 1
            },
            body: {
                content: "article's content"
            }  
        }
        jest.clearAllMocks();
    })
    it("Should edit the article with success while publish", async () => {
        db.query= jest.fn()
              .mockResolvedValueOnce([[{ fileName: "test.txt", isPublish: false }]])
              .mockResolvedValueOnce([])
        fs.writeFile.mockImplementation((dirPath, options, callback) => {
            callback(null);
          });
        await editArticles(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({message: "update"});
    });
    it("Should edit the article with success while publish", async () => {
        db.query = jest.fn()
              .mockResolvedValueOnce([[{ fileName: "test.txt", isPublish: true }]])
              .mockResolvedValueOnce([])
          fs.writeFile.mockImplementation((dirPath, options, callback) => {
            callback(null); 
          });
          await editArticles(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({message: "update"});
    });
    it("Should return write file error", async () => {
        db.query = jest
            .fn()
            .mockResolvedValueOnce([[{ fileName: "test.txt", isPublish: true }]]) // SELECT
            .mockResolvedValueOnce([]) 
      
        fs.writeFile.mockImplementation((filePath, data, callback) => {
          callback(new Error("Write file error")); // Simule une erreur d'écriture
        });
      
        await editArticles(mockReq, mockRes);
      
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
          error: "Write file error: Write file error"
        });
      });
    it("Should return an error if error", async () => {
        db.query= jest.fn().mockRejectedValue(new Error("DB erreur"))
        

        await editArticles(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur serveur: DB erreur"})
    })
})

describe("Cancelle edit article", () => {
    beforeEach(() => {
        mockReq = {
            params: {
                id: 1
            }
        }
        jest.clearAllMocks()
    });
    it("Should cancelle the edit with sucess while no publish", async () => {
        db.query= jest.fn()
              .mockResolvedValueOnce([[{ fileName: "test.txt", isPublish: true }]])
              .mockResolvedValueOnce([])
        await cancelleEditArticle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({url: "/article/1"})
    })
    it("Should cancelle the edit wiht sucess while publish", async () => {
        db.query = jest.fn()
              .mockResolvedValueOnce([[{ fileName: "test.txt", isPublish: false }]])
              .mockResolvedValueOnce([])
          fs.unlink.mockImplementation((path, callback) => {
            callback(null); 
          });
          await cancelleEditArticle(mockReq, mockRes);
          expect(mockRes.status).toHaveBeenCalledWith(200);
          expect(mockRes.json).toHaveBeenCalledWith({url: '/article'})
    });
    it("Shoult return an error if delete file error", async () => {
        db.query= jest.fn()
              .mockResolvedValueOnce([[{ fileName: "test.txt", isPublish: false }]])
              .mockResolvedValueOnce([])
          fs.unlink.mockImplementation((path, callback) => {
            callback(new Error('Delete file error')); 
          });
          await cancelleEditArticle(mockReq, mockRes);
          expect(mockRes.status).toHaveBeenCalledWith(500);
          expect(mockRes.json).toHaveBeenCalledWith({error: "Delete file error: Delete file error"});
    });
    it("Should return an error if error", async () => {
        db.query= jest.fn().mockRejectedValue(new Error("DB error"))
        await cancelleEditArticle(mockReq, mockRes);
          expect(mockRes.status).toHaveBeenCalledWith(500);
          expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur serveur: DB error"});
    })
});

describe("Delete article", () => {
    beforeEach(() => {
        mockReq = {
            params: {
                id: 1
            }
        }
        jest.clearAllMocks();
    });

    it("Should delete the article with success", async () => {
        process.env.CLIENT_APP_PART = __dirname;
      
        db.query= jest.fn()
              .mockResolvedValueOnce([[{ fileName: "test.txt", imgName: "test.png" }]])
              .mockResolvedValueOnce([]),
      
        fs.promises.unlink
          .mockResolvedValueOnce() // filePath OK
          .mockResolvedValueOnce(); // imgPath OK
      
        await deleteArticle(mockReq, mockRes);
      
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ url: '/article' });
      });
    it("Should return delete file error", async () => {
        process.env.CLIENT_APP_PART = __dirname;
      
        db.query= jest.fn()
            .mockResolvedValueOnce([[{ fileName: "test.txt", imgName: "test.png" }]])
            .mockResolvedValueOnce([]),
      
        fs.promises.unlink = jest.fn()
            .mockRejectedValueOnce(new Error("Delete error"))
            .mockResolvedValueOnce();
      
        await deleteArticle(mockReq, mockRes);
      
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
          error: "Delete file error: Delete error",
        });
      });
      it("Should return delete img error", async () => {
        process.env.CLIENT_APP_PART = __dirname;
      
        db.query = jest.fn()
            .mockResolvedValueOnce([[{ fileName: "test.txt", imgName: "test.png" }]])
            .mockResolvedValueOnce([]),
      
        fs.promises.unlink = jest.fn()
            .mockResolvedValueOnce()
            .mockRejectedValueOnce(new Error("Delete error"));
       
      
        await deleteArticle(mockReq, mockRes);
      
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
          error: "Delete img error: Delete error",
        });
      });
    it("Should return an error if error", async () => {
        db.query= jest.fn().mockRejectedValue(new Error("DB error"))
        await deleteArticle(mockReq, mockRes);
          expect(mockRes.status).toHaveBeenCalledWith(500);
          expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur serveur: DB error"});
    })
})

