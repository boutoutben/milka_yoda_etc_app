import generateAnimalNumberSchema from "../../validationSchema/genierateAnimalNumberSchema";

describe("generateAnimalNumberSchema", () => {
    const validData = {
      Chats: 2,
      Chiens: 1
    };
  
    const invalidData = {
      Chats: 0,
      Chiens: -1
    };
  
    it("should validate correctly with valid numbers", async () => {
      const schema = generateAnimalNumberSchema(["Chats", "Chiens"]);
      await expect(schema.validate(validData)).resolves.toEqual(validData);
    });
  
    it("should throw for Chats < 1", async () => {
        const schema = generateAnimalNumberSchema(["Chats"]);
        await expect(schema.validate({ Chats: 0 })).rejects.toThrow("Vous devez indiquer au moins un Chats");
      });
      
      it("should throw for Chiens < 0", async () => {
        const schema = generateAnimalNumberSchema(["Chiens"]);
        await expect(schema.validate({ Chiens: -1 })).rejects.toThrow("Vous devez indiquer au moins un Chiens");
      });
  
    it("should skip 'Pas encore' and 'Autre' fields", async () => {
      const schema = generateAnimalNumberSchema(["Chats", "Pas encore", "Autre"]);
  
      const valid = { Chats: 3 };
      await expect(schema.validate(valid)).resolves.toEqual(valid);
  
      const invalid = { Chats: null };
      await expect(schema.validate(invalid)).rejects.toThrow("Vous devez indiquer un nombre de Chats");
    });
  
    it("should throw typeError for non-number values", async () => {
      const schema = generateAnimalNumberSchema(["Lapins"]);
      const data = { Lapins: "beaucoup" };
  
      await expect(schema.validate(data)).rejects.toThrow("Le nombre de Lapins doit être un chiffre");
    });
  });