import testMatches from "./testMatches";

function phoneTest (data, schema, isRequired=false) {
    const validPhones = [
        '0612345678',
        '06 12 34 56 78',
        '0711223344',
        '07 11 22 33 44',
        '+33612345678',
        '+33 6 12 34 56 78',
        '+33711223344',
        '+33 7 11 22 33 44',
      ];

      const invalidPhones = [
        { value: '012345678', reason: 'Trop court' },
        { value: '06123456789', reason: 'Trop long' },
        { value: '0612-34-56-78', reason: 'Contient des tirets' },
        { value: '06.12.34.56.78', reason: 'Contient des points' },
        { value: '08 12 34 56 78', reason: 'Commence par 08 (souvent interdit)' },
        { value: '03 12 34 56 78', reason: 'Commence par 03 (fixe)' },
        { value: '+33(0)612345678', reason: 'Parenthèses non autorisées' },
        { value: '+336 12 34 56 789', reason: 'Un chiffre en trop' },
        { value: '+336', reason: 'Trop court' },
        { value: 'abcdefg', reason: 'Caractères non numériques' },
      ];
      if(isRequired) {
        test("should fails when phone is empty", () => {
            data.phone = "";
            expect(schema.validate(data)).rejects.toThrow("Téléphone requis.")
        })  
      }
      

      testMatches("phone", validPhones, invalidPhones, schema, data, "Numéro de téléphone invalide." )
}

export default phoneTest;