const { animalAge } = require("../../utils/animalAge");

describe("animalAge", () => {
    it("should return 'young' for a young dog", () => {
      expect(animalAge("chien", 0)).toBe("young");
    });
  
    it("should return 'adult' for an adult dog", () => {
      expect(animalAge("chien", 3)).toBe("adult");
    });
  
    it("should return 'senior' for an old dog", () => {
      expect(animalAge("chien", 10)).toBe("senior");
    });
  
    it("should return 'young' for a young cat", () => {
      expect(animalAge("chat", 0)).toBe("young");
    });
  
    it("should return 'adult' for an adult cat", () => {
      expect(animalAge("chat", 5)).toBe("adult");
    });
  
    it("should return 'senior' for an old cat", () => {
      expect(animalAge("chat", 12)).toBe("senior");
    });
  
    it("should return 'Inconnu' for unknown animal type", () => {
      expect(animalAge("lapin", 2)).toBe("Inconnu");
    });
  });