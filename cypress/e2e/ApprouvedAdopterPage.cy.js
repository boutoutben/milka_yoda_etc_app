describe("ApprouvedAdopter page", () => {
    it("should approuved the adoption", () => {
        cy.fillAdopterProfile();
        cy.get("[aria-label=Envoyer]").click();
        cy.url().should("include", "/adoptSucess");
        cy.adminLogin()
        cy.get("[data-testid=presentationAnimal] [data-cy=animal-name]").click();
        cy.url().should("include", "/adopterApprouved/");
        cy.intercept("POST", "https://api.emailjs.com/api/v1.0/email/send*", {
      statusCode: 200,
      body: {},
    }).as("sendEmail");
        cy.get("[aria-label=Accepter]").click();
         cy.wait("@sendEmail").its("response.statusCode").should("eq", 200);

    // Vérifie le message d'alerte
    cy.contains("Adoption acceptée").should("be.visible");
    cy.wait(3000);
        cy.url().should("include", "/adminSpace");
        cy.task("findByField", {table:"adopter", field:"animal_id", fieldValue:"cf87dd08-6315-11f0-80a3-50ebf692f6a4" }).then((adopter) => {
            expect(adopter.isApprouved).to.equal(1);
        })
        cy.task("deleteByField", {table: "adopter", field: "email", fieldValue:"test@example.com"});
         cy.task("updateAdoptAnimalStatus", {
        id: "cf87dd08-6315-11f0-80a3-50ebf692f6a4",
        value: false,
      });
    })
    it("should disapprouved the adoption", () => {
        cy.fillAdopterProfile();
        cy.get("[aria-label=Envoyer]").click();
        cy.url().should("include", "/adoptSucess");
        cy.adminLogin()
        cy.get("[data-testid=presentationAnimal] [data-cy=animal-name]").click();
        cy.url().should("include", "/adopterApprouved/");
        cy.intercept("POST", "https://api.emailjs.com/api/v1.0/email/send*", {
            statusCode: 200,
            body: {},
        }).as("sendEmail");
        cy.get("[aria-label=Refuser]").click();
        cy.wait("@sendEmail").its("response.statusCode").should("eq", 200);

        // Vérifie le message d'alerte
        cy.contains("Adoption refusée").should("be.visible");
        cy.wait(3000);
        cy.url().should("include", "/adminSpace");
       cy.task("findByField", { 
  table: "adopter", 
  field: "animal_id", 
  fieldValue: "cf87dd08-6315-11f0-80a3-50ebf692f6a4" 
}).then((adopter) => {
  expect(adopter).to.be.null;
  
  // Une fois la première vérification faite, on enchaîne la seconde
  cy.task("findByField", { 
    table: "animals", 
    field: "name", 
    fieldValue: "Beber" 
  }).then((animal) => {
    expect(animal.isAdopted).to.equal(0);
  });
});
    })
})