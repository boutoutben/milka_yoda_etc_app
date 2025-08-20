function ageTest (data, schema) {
    const validAges = [18, 25, 30, 100];

  test.each(validAges)("✅ should pass for valid age: %s", async (value) => {
    data.age = value;
    await expect(schema.validate(data)).resolves.toEqual(data);
  });

  const invalidAges = [
    { value: undefined, reason: "L'âge est requis." },
    { value: null, reason: "L'âge est requis." },
    { value: '', reason: "Merci d'entrer un nombre." },
    { value: 'abc', reason: "Merci d'entrer un nombre." },
    { value: 17, reason: "L'âge doit être supérieur à 18 ans" },
    { value: 10, reason: "L'âge doit être supérieur à 18 ans" },
    { value: 18.5, reason: "L'âge doit être un nombre entier." },
  ];

  test.each(invalidAges)(
    "❌ should fail for invalid age: $value ($reason)",
    async ({ value, reason }) => {
      data.age = value;
      await expect(schema.validate(data)).rejects.toThrow(reason);
    }
  );
}

module.exports = ageTest;