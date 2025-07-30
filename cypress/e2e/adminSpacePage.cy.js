describe("AdminSpace page", () => {
    beforeEach(() => {
        cy.adminLogin()
    })
    it("should logout on icon click", () => {
        cy.get("[data-testid='logout-icon']").click();
        cy.url().should("include", "/login")
    })
    it("should render the adoption to approuved", () => {
        cy.fillAdopterProfile();
        cy.get("[aria-label=Envoyer]").click();
        cy.url().should("include", "/adoptSucess");
        cy.visit("/adminSpace");
        cy.get("[data-testid=presentationAnimal] [data-cy=animal-name]").should("contain", "Beber");
        cy.task("deleteByField", {table: "adopter", field: "email", fieldValue:"test@example.com"});
         cy.task("updateAdoptAnimalStatus", {
        id: "cf87dd08-6315-11f0-80a3-50ebf692f6a4",
        value: false,
      });
    })
    it("should redirect to adopterApprouved on adoption click", () => {
        cy.fillAdopterProfile();
        cy.get("[aria-label=Envoyer]").click();
        cy.url().should("include", "/adoptSucess");
        cy.visit("/adminSpace");
        cy.get("[data-testid=presentationAnimal] [data-cy=animal-name]").click();
        cy.url().should("include", "/adopterApprouved/");
        cy.task("deleteByField", {table: "adopter", field: "email", fieldValue:"test@example.com"});
         cy.task("updateAdoptAnimalStatus", {
        id: "cf87dd08-6315-11f0-80a3-50ebf692f6a4",
        value: false,
      });
    })
    it("should render 2 users", () => {
        cy.get(".userPresentation").should("have.length", 2)
    })
    it("should block the user on block icon click", () => {
        cy.get(".userPresentation [data-testid=banUser]").first().click();
        cy.get(".userPresentation [data-testid=banUser]").first().should("have.class", "ban")
        cy.get("[data-testid='logout-icon']").click();
        cy.get("input[name=email]").type("test@example.com");
        cy.get("input[name=password]").type("Test123!");
        cy.get("form [data-testid=mainBtn]").click();
        cy.get(".formError", { timeout: 2000 }).first().should("contain", "Votre compte est bloqué suite à une infraction")
    })
    it("should unblock the user on second bock icon click", () => {
        cy.get(".userPresentation [data-testid=banUser]").first().click();
        cy.get(".userPresentation [data-testid=banUser]").first().should("not.have.class", "ban")
        cy.get("[data-testid='logout-icon']").click();
        cy.userLogin();
    })
    it("should only render the user with the email test2@example.com on search", () => {
        cy.get("input[type=search]").type("test2");
        cy.get(".userPresentation").should("have.length", 1);
        cy.get(".userPresentation>p").should("contain", "test2@example.com")
    })
})