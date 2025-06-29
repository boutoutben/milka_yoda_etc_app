import emailSchema from "../../validationSchema/emailSchema";

describe('emailSchema', () => {
    it('should pass with a valid email', async () => {
      const validData = { email: 'test@example.com' };
      await expect(emailSchema.validate(validData)).resolves.toEqual(validData);
    });
  
    
  });