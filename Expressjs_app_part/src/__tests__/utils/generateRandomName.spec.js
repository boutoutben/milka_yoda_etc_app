const { generateRandomName } = require("../../utils/generateRandowName");


describe("generateRandomName", () => {
  it("should return a string starting with 'Article_' and ending with '.jsx'", () => {
    const name = generateRandomName();
    expect(name.startsWith("Article_")).toBe(true);
    expect(name.endsWith(".jsx")).toBe(true);
  });

  it("should return a string of correct length", () => {
    const name = generateRandomName();
    // "Article_" = 8 chars, ".jsx" = 4 chars, randomPart = 6 chars → total: 18
    expect(name.length).toBe(18);
  });

  it("should generate different names on multiple calls", () => {
    const name1 = generateRandomName();
    const name2 = generateRandomName();
    expect(name1).not.toBe(name2); // très peu probable d’être identiques
  });
});