describe("animalDetailsPage", () => {
  beforeEach(() => {
    cy.visit("/adopter/cf87dd08-6315-11f0-80a3-50ebf692f6a4");
  });

  it("should render animal identity and description", () => {
    cy.get("#AnimalIdentity").should("be.visible");
    cy.get("#animalDescription").should("be.visible");
  });

  it("should redirect to adopterInfo on meet him click", () => {
    cy.get("[aria-label='Rencontrer cette animal']").click();
    cy.url().should("include", "/adopterProfile");
  });

  it("meet btn should be disabled if animal is adopted", () => {
    cy.task("updateAdoptAnimalStatus", {
      id: "cf87dd08-6315-11f0-80a3-50ebf692f6a4",
      value: true,
    }).then(() => {
      cy.reload();

      cy.get("[aria-label='Rencontrer cette animal']")
        .should("exist")
        .and("be.disabled");

      // Nettoyage
      cy.task("updateAdoptAnimalStatus", {
        id: "cf87dd08-6315-11f0-80a3-50ebf692f6a4",
        value: false,
      });
    });
  });

  it("should update the name with sucess", () => {
    cy.adminLogin();
    cy.visit("/adopter/cf87dd08-6315-11f0-80a3-50ebf692f6a4");
    cy.task("findByField",{table:"animals", field: "name",fieldValue: "Beber"}).then(animal => {
      expect(animal.description).to.equal("Beber's description");
    })
    cy.get("[data-testid='edit-paraph']").click();
    cy.get("textarea[name=description]").clear().type("New beber's description aiming to test is animal update work and make sure the code work right now");
    cy.get("form").submit();
    cy.task("findByField",{table:"animals", field: "name",fieldValue: "Beber"}).then(animal => {
      expect(animal.description).to.equal("New beber's description aiming to test is animal update work and make sure the code work right now");
    })
    cy.task("resetDescriptAfterUpdate", {
      table: 'animals',
      field: "name",
      fieldValue: "Beber",
      description: "Beber's description"
    });
  })

  it("should delete the animal with sucess", () => {
    cy.createAnimal();
    cy.get("[data-testid=presentationAnimal]").first().click();
        cy.get("[data-testid='delete-paraph']").click();
        cy.get("[aria-label=Oui]").click();
        cy.wait(1000)
         cy.get("[data-testid=presentationAnimal]").should("have.length", 3)
  })
});