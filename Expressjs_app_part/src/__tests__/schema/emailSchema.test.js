const emailSchema = require("../../schema/emailSchema");


describe('emailSchema', () => {
    it('should pass with a valid email', async () => {
      const validData = { email: 'test@example.com' };
      await expect(emailSchema.validate(validData)).resolves.toEqual(validData);
    });
  
  it("should no pass if email invalid", () => {
    const invalidData = {email: "test"}
    expect(emailSchema.validate(invalidData)).rejects.toThrow("Adresse e-mail invalide");
  })  
  it("should no pass if email is empty", () => {
    const invalidData = {email: ""}
    expect(emailSchema.validate(invalidData)).rejects.toThrow("L'e-mail est requis.")
  })
  });