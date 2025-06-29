import testMatches from "./testMatches";

function passwordTest(data, schema, hasPasswordConfirm) {
    const validPasswords = [
        'Abc1234!',
        'Password1!',
        'Mdp$2024',
        'Aa1@44444'
      ];
      
      const invalidPasswords = [
        { value: 'password', reason: 'Pas de majuscule, pas de chiffre, pas de spécial' },
        { value: 'PASSWORD', reason: 'Pas de minuscule, pas de chiffre, pas de spécial' },
        { value: 'Passw0rd', reason: 'Pas de caractère spécial' },
        { value: '1234567!', reason: 'Pas de lettres' },
        { value: 'abcdEFGH!', reason: 'Pas de chiffre' },
        { value: 'Pa$$word€', reason: 'Contient un caractère interdit (€)' }
      ];

    it('should pass with 8 characters password', async () => {
        data.password =  'Aa1@aa1@'
        if(hasPasswordConfirm) {
            data.confirmPassword = 'Aa1@aa1@'
        }
        await expect(schema.validate(data)).resolves.toEqual(data);
      });
      
      it('should pass with 30 characters password', async () => {
        data.password = 'Aa1@' + 'aA1@'.repeat(6);
        if(hasPasswordConfirm) {
            data.confirmPassword = 'Aa1@' + 'aA1@'.repeat(6);
        }
        await expect(schema.validate(data)).resolves.toEqual(data);
      });
  
    it('should fail when password is too short', async () => {
      data.password = 'Aa1@rrr' 
      if(hasPasswordConfirm) {
        data.confirmPassword = 'Aa1@rrr';
    }
      await expect(schema.validate(data)).rejects.toThrow("Le mot de passe doit contenir au moins 8 caractères.");
    });

    it("should fail when password is is too long", async () => {
        data.password = "A".repeat(35);
        if(hasPasswordConfirm) {
            data.confirmPassword = "A".repeat(35);
        }
        await expect(schema.validate(data)).rejects.toThrow("Le mot de passe ne doit pas dépasser 30 caractères.")
    })
  
    it('should fail when password is empty', async () => {
        data.password = '';
        if(hasPasswordConfirm) {
            data.confirmPassword = "";
        }
      await expect(schema.validate(data)).rejects.toThrow("Le mot de passe est requis.");
    });

    testMatches("password", validPasswords, invalidPasswords, schema, data, "Le mot de passe n'est pas conforme.", "confirmPassword");
    if(hasPasswordConfirm){ 
    test("should fail when confirmPassword is empty", async () => {
        data.password = "Password123!";
        data.confirmPassword = null;
        await expect(schema.validate(data)).rejects.toThrow("La confirmation est requise.");
    });
    test("should fail when confirmPassword is not equal to password", () => {
        data.password = "Password123!";
        data.confirmPassword = "password";
        expect(schema.validate(data)).rejects.toThrow("Les mots de passe doivent correspondre.");
    });
    test("should success when confirmPassword is equal to password", () => {
        data.password = "Password123!";
        data.confirmPassword = "Password123!";
        expect(schema.validate(data)).resolves.toEqual(data)
    })}
}

export default passwordTest;