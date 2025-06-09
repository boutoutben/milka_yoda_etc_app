const { filtedAnimals, animalAge } = require("../handles/filter.js");
const AnimalsRaces = require("../mongoose/Schemas/animalsRaces.js");

// Mock partiel pour ne mocker que animalAge, pas filtedAnimals
jest.mock("../handles/filter.js", () => {
  const actual = jest.requireActual("../handles/filter.js");
  return {
    ...actual,
    animalAge: jest.fn()
  };
});

// Mock complet de AnimalsRaces
jest.mock("../mongoose/Schemas/animalsRaces.js", () => ({
  findById: jest.fn()
}));

describe("filter animal", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    // Simule les données envoyées dans la requête
    mockReq = {
        body: {
          values: {
            gender: 1,
            espece: "chien",
            age: "young", // age attendu
          },
          filteredAnimals: [
            {
              sexe: 1,
              races: JSON.stringify([101]),
              born: "2025-01-01"
            },
          ],
        },
      };

    // Simule une réponse Express
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Simule les animaux filtrables (par exemple depuis la DB)
  });

  it("should match filter data with success", async () => {
    // Simule que la race 101 est de l'espèce "Chien"
    AnimalsRaces.findById.mockResolvedValueOnce({ espece: "chien" });

    // Simule que la fonction retourne l'âge "4"
    animalAge.mockReturnValueOnce("young");
    await filtedAnimals(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith([{"born": "2025-01-01", "races": "[101]", "sexe": 1}] );
  });
  it("Should no match filter data with sucess", async () => {
    mockReq = {
        body: {
          values: {
            gender: 1,
            espece: "chien",
            age: "young", // age attendu
          },
          filteredAnimals: [
            {
              sexe: 2,
              races: JSON.stringify([101]),
              born: "2025-01-01"
            },
          ],
        },
      };
    AnimalsRaces.findById.mockResolvedValueOnce({ espece: "chien" });

    // Simule que la fonction retourne l'âge "4"
    animalAge.mockReturnValueOnce("young");
    await filtedAnimals(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith([]);
  });
  it("Should return an error if serveur error", async () => {
    AnimalsRaces.findById.mockRejectedValue(new Error("DB error"));
    await filtedAnimals(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Erreur serveur: DB error" });
  });
});

