import testMatches from "./testMatches";

function adressePostaleTest (data, schema) {
    const validPostalCodes = [
        '75001',
        '13008',
        '59000',
        '92130',
        '00000', // Techniquement valide, bien que non attribué
      ];
    
      const invalidPostalCodes = [
        { value: '7500', reason: 'Trop court (4 chiffres)' },
        { value: '750001', reason: 'Trop long (6 chiffres)' },
        { value: '75A01', reason: 'Contient une lettre' },
        { value: 'ABCDE', reason: 'Contient uniquement des lettres' },
        { value: '1234 ', reason: 'Espace final' },
        { value: ' 12345', reason: 'Espace initial' },
        { value: '12 345', reason: 'Espace au milieu' },
      ];
    test("should fail when adressePostale is empty", () => {
        data.adressePostale = "";
        expect(schema.validate(data)).rejects.toThrow("Le code postal est requis.")
    })
    testMatches("adressePostale", validPostalCodes, invalidPostalCodes, schema, data, "Le code postal n'est pas conforme.")
}

export default adressePostaleTest;