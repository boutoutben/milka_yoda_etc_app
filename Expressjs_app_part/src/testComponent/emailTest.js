function emailTest (data, schema) {
    const invalidEmail = [
        { value: '', reason: "L'e-mail est requis." },
        { value: "invalid-email", reason: "Adresse e-mail invalide." },
      ];
      test.each(invalidEmail)(
        "❌ should fail for invalid email: $value ($reason)",
        async ({ value, reason }) => {
          data.email = value;
          await expect(schema.validate(data)).rejects.toThrow(reason);
        })
}

module.exports = emailTest;