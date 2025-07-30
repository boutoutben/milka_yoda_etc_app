describe("adopter sumary page", () => {
    it("should render all right data", () => {
        cy.fillAdopterProfile();
        cy.get("aside").should("be.visible");
        cy.get("#adopterDetails").should("be.visible")
    })
    it("should send the profile and redirect to adoptSucess", () => {
        cy.fillAdopterProfile();
        cy.get("[aria-label=Envoyer]").click();
        cy.url().should("include", "/adoptSucess");
        cy.task("findByField", {table: "adopter", field: "email", fieldValue: "test@example.com"}, (adopter) => {
            expect(adopter).toHaveLength(1);
        })
        cy.visit('/adopter')
        cy.get("[data-testid=presentationAnimal]").should("have.length",2)
        cy.task("deleteByField", {table: "adopter", field: "email", fieldValue:"test@example.com"});
         cy.task("updateAdoptAnimalStatus", {
        id: "cf87dd08-6315-11f0-80a3-50ebf692f6a4",
        value: false,
      });
    })
})