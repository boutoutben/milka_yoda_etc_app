const {setPersonnelInfo, fetchPersonnelsInfos, fetchAdoptedAnimals, getRole, fetchAdoptionNotApprouved, fetchApprouveAdoption, deleteAdoptionNotApprouved, approuveAdoption, fetchAllUsers, blockUpdate } = require("../handles/user");
const db = require("../mysqlDatabase.js");
const { encryptData } = require("../Routes/encryptData");
const { loadKeys } = require("../utils/generateKeys");
const { publicKey, privateKey } = loadKeys();

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

describe("Fetch adopted animals", () => {
    beforeEach(() => {
        mockReq = {
            user: {
                userId: 1
            }
        }
        jest.clearAllMocks();
    })
    it("should return the animals", async () => {
        db.query= jest.fn().mockResolvedValue([[{
            email: "boutout.ben@gmail.com"
        }]])
        db.query= jest.fn().mockResolvedValue([[{
                id: 1,
                name: "test",
                description: "test'description",
            },
            {
                id:2,
                name: "test",
                description: "description",
            }
        ]])
        await fetchAdoptedAnimals(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith([{
            id: 1,
            name: "test",
            description: "test'description",
        },
        {
            id:2,
            name: "test",
            description: "description",
        }
    ])
    });
    it("should return an error", async () => {
        db.query= jest.fn().mockRejectedValue(new Error("DB error"))
        await fetchAdoptedAnimals(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur serveur: DB error"})
    })
})

describe("Fetch personnel info", () => {
    beforeEach(() => {
        mockReq = {
            user: {
                userId: 1
            }
        };
        jest.clearAllMocks();
    });
    it("Should fetch personnel info with sucess", async () => {
        db.query= jest.fn().mockResolvedValue([[{
                id: 1,
                name: "test",
                description: "test'description",
            }]])
        await fetchPersonnelsInfos(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith([{
            id: 1,
            name: "test",
            description: "test'description",
        }])
    });
    it("Should return an error if DB query fails", async () => {
        db.query= jest.fn().mockRejectedValue(new Error("DB error"))
    
        await fetchPersonnelsInfos(mockReq, mockRes);
    
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "Erreur serveur: DB error" });
    });
})

describe("Set personnel Info", () => {
    const mockData = {
        civility: 1,
        lastname: "testname",
        firstname:'test',
        age:'18',
        adressePostale: "59000",
        email: "boutout.ben@gmail.com",
        phone: "0600000000"
    }
    beforeEach(async () => {
        mockReq = {
            body: {
                data: await encryptData(mockData, publicKey),
                id: 1
            }
        }
        jest.clearAllMocks();
    })
    it("Should set personnel data with success", async () => {
        db.query= jest.fn().mockResolvedValue([[{
                id: 1,
                civility: 1,
                lastname: "testname",
                firstname:'test',
                age:'18',
                adressePostale: "59000",
                email: "boutout.ben@gmail.com",
                phone: "0600000000"
            }]])
        await setPersonnelInfo(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({message: "Infos mises à jour !", userInfo: {
            id: 1,
                civility: 1,
                lastname: "testname",
                firstname:'test',
                age:'18',
                adressePostale: "59000",
                email: "boutout.ben@gmail.com",
                phone: "0600000000"
        }})
    });
    it("Should return not user found", async () => {
        db.query= jest.fn().mockResolvedValue([{ affectedRows: 0 }]) // no rows updated
      
        await setPersonnelInfo(mockReq, mockRes);
      
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Aucun utilisateur trouvé avec cet ID" });
      });
    it("Should return an error is error", async () => {
        db.query= jest.fn().mockRejectedValue(new Error("DB error"))
        await setPersonnelInfo(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur serveur: DB error"});
    })
})

describe("getRole", () => {
    beforeEach(() => {
        mockReq = {
            user: {
                userId: 1
            }
        }
        jest.clearAllMocks();
    })
    it("should return the role", async () => {
        db.query= jest.fn().mockResolvedValue([
                [{roleName: 'MOCK_ROLE'}]
            ])
        await getRole(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            ok: true,
            role: [{ roleName: 'MOCK_ROLE' }]
        });
  
    });
    it("should return an error", async () => {
        db.query= jest.fn().mockRejectedValue(new Error("DB error"))
        await getRole(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur serveur: DB error"})
    })
})

describe("Fetch doption not approuved", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })
    it("Should fetch adoption not approuved with success", async () => {
        db.query= jest.fn().mockResolvedValue([[{
                id: 1,
                animalId: 3,
                name: "test",
                description: "test's description",
            }]])
        await fetchAdoptionNotApprouved(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith([{
            id: 1,
            animalId: 3,
            name: "test",
            description: "test's description",
        }])
    });
    it("Should return an error if error server", async () => {
        db.query= jest.fn().mockRejectedValue(new Error("DB error"))
        await fetchAdoptionNotApprouved(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur serveur: DB error"})
    })
});

describe("Fetch approuve adoption", () => {
    beforeEach(() => {
        mockReq = {
            params: {
                id: 1
            }
        };
        jest.clearAllMocks()
    });
    it("Should fetch approuve the adoption with success", async () => {
        db.query= jest.fn().mockResolvedValue([[{
              id: 1,
              civility: 1,
              lastname: "testname",
              firstname: "test",
              adressePostale: "59000",
              email: "boutout.ben@gmail.com",
              phone: "0600000000",
              animalCase: JSON.stringify(["Pas encore"]),
              animalNumber: null,
              otherAnimals: JSON.stringify([{ name: "", number: "" }]),
              lifeRoutine: JSON.stringify(["Dynamique"]),
              haveChildren: false,
              motivation: "test'motivation",
              animalPlace: JSON.stringify(["Maison avec cour"]),
              child: null,
              animalId: 2,
              name: "animalTest",
              description: "animal's description",
              isSterile: true,
              imgName: 'test.jpg',
              races: JSON.stringify([102, 103]),
              born: "2020-10-14",
              incompatibility: null,
              createdAt: "2025-06-04",
              isApprouved: false
            }]])
        await fetchApprouveAdoption(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({"animal": {"born": "2020-10-14", "createdAt": "2025-06-04", "description": "animal's description", "id": 2, "imgName": "test.jpg", "incompatibility": null, "isApprouved": false, "isMediator": undefined, "isSterile": true, "name": "animalTest", "races": "[102,103]"}, "values": {"adressePostale": "59000", "animalCase": ["Pas encore"], "animalNumber": null, "animalPlace": ["Maison avec cour"], "child": null, "civility": 1, "email": "boutout.ben@gmail.com", "firstname": "test", "haveChildren": false, "id": undefined, "lastname": "testname", "lifeRoutine": ["Dynamique"], "motivation": "test'motivation", "otherAnimals": [{"name": "", "number": ""}], "phone": "0600000000"}})
    });
    it("Should retunr an error if error server", async () => {
        db.query= jest.fn().mockRejectedValue(new Error("DB error"))
        await fetchApprouveAdoption(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur serveur: DB error"})
    })
});

describe("Delete adoption not approuved", () => {
    beforeEach(() => {
        mockReq = {
            params: {
                id: 1
            }
        };
        jest.clearAllMocks();
    })
    it("Shoud delete the adoption not approuved with sucess", async () => {
        db.query= jest.fn()
              .mockResolvedValueOnce([[{ animal_id: 12 }]])  // pour le SELECT
              .mockResolvedValueOnce([])                    // pour le UPDATE
              .mockResolvedValueOnce([])                    // pour le DELETE
        await deleteAdoptionNotApprouved(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({message: "Adoption refusée"});
    });
    it("Should return data not found", async () => {
        db.query= jest.fn()
              .mockResolvedValueOnce([[]]) 
        await deleteAdoptionNotApprouved(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Nous n'avons pas trouvé les données"});
    });
    it("Should return an error is server error", async () => {
        db.query= jest.fn()
              .mockRejectedValue(new Error("DB error")) 
        await deleteAdoptionNotApprouved(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur serveur: DB error"});
    })
});

describe("Approuve adoption", () => {
    beforeEach(() => {
        mockReq = {
            params: {
                id: 1
            }
        };
        jest.clearAllMocks();
    });
    it("Should approuve the adoption with succes", async () => {
        db.query= jest.fn().mockResolvedValue()
        await approuveAdoption(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({message: "Adoption acceptée"});
    });
    it("Should return an error if server error", async () => {
        db.query= jest.fn().mockRejectedValue(new Error("DB error"))
        
        await approuveAdoption(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur serveur: DB error"});
    })
});

describe("Fetch all users", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("Should fetch all users with sucess", async () => {
        db.query= jest.fn().mockResolvedValueOnce([[{
                id: 1,
                firstname: "test",
                lastname: "testname",
                email: "boutout.ben@gmail.com",
                isBlock:false
            },
            {
                id: 2,
                firstname: "test2",
                lastname: "testname2",
                email: "boutout.ben2@gmail.com",
                isBlock:false
            },
        ]])
        await fetchAllUsers(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({"users": [{"email": "boutout.ben@gmail.com", "firstname": "test", "id": 1, "isBlock": false, "lastname": "testname"}, {"email": "boutout.ben2@gmail.com", "firstname": "test2", "id": 2, "isBlock": false, "lastname": "testname2"}]})
    });
    it("Should return an error if server error", async () => {
        db.query= jest.fn().mockRejectedValue(new Error("DB error"))
        await fetchAllUsers(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur serveur: DB error"})
    })
});

describe("Block update", () => {
    beforeEach(() => {
        mockReq = {
            body: {
                id: 1,
                argument: true
            }
        };
        jest.clearAllMocks();
    })
    it("Should update block user", async () => {
        db.query= jest.fn().mockResolvedValueOnce()
        await blockUpdate(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({message: "Update"});
    });
    it("Should return an error if server error", async () => {
        db.query= jest.fn().mockRejectedValue(new Error("DB error"))
        await blockUpdate(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Erreur serveur: DB error"});
    })
})