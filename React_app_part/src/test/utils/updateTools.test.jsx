import updateTools from "../../utils/updateTools";

describe("updateTools", () => {
  const initialTools = [
    { name: "test1", value: false },
    { name: "test2", value: false },
  ];

  test("should update the tool with the given name", () => {
    const mockSetTools = jest.fn();

    // Appelle la fonction
    updateTools("test1", true, mockSetTools);

    // Récupère la fonction de mise à jour passée à setTools
    const updateFn = mockSetTools.mock.calls[0][0];
    const result = updateFn(initialTools);

    // Vérifie le résultat
    expect(result).toEqual([
      { name: "test1", value: true },
      { name: "test2", value: false },
    ]);
  });

  test("should not change anything if name not found", () => {
    const mockSetTools = jest.fn();

    updateTools("nonexistent", true, mockSetTools);

    const updateFn = mockSetTools.mock.calls[0][0];
    const result = updateFn(initialTools);

    expect(result).toEqual(initialTools); // rien ne change
  });
});