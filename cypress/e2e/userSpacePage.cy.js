 describe("userSpace Page", () => {
    it("should logout on icon click", () => {
        cy.userLogin();
        cy.get("[data-testid='logout-icon']").click();
        cy.url().should("include", '/login');
    })
    it("should update the personnel info", () => {
        cy.userLogin();
        cy.get("select[name=civility]").select("1");
        cy.get("input[name=age]").type(20);
        cy.get("input[name=adressePostale]").type("59600");
        cy.get("form").submit()
        cy.get(".userMessage").should("contain", "Infos mises à jour !")
        cy.task("clearUserPersonneldata", "test@example.com")
    })

    it("should render the animal adopt and be in waiting", () => {
        cy.fillAdopterProfile();
        cy.get("[aria-label=Envoyer]").click();
        cy.url().should("include", "/adoptSucess");
        cy.userLogin();
        cy.get("[data-testid=presentationAnimal] [data-cy=animal-name]").should("contain", "Beber");
        cy.get(".waiting").should("be.visible");
        cy.task("deleteByField", {table: "adopter", field: "email", fieldValue:"test@example.com"});
         cy.task("updateAdoptAnimalStatus", {
        id: "cf87dd08-6315-11f0-80a3-50ebf692f6a4",
        value: false,
      });
    })
    it("should redirect to animal detail in animal click", () => {
        cy.fillAdopterProfile();
        cy.get("[aria-label=Envoyer]").click();
        cy.url().should("include", "/adoptSucess");
        cy.userLogin();
        cy.get("[data-testid=presentationAnimal]").click();
        cy.task("deleteByField", {table: "adopter", field: "email", fieldValue:"test@example.com"});
         cy.task("updateAdoptAnimalStatus", {
        id: "cf87dd08-6315-11f0-80a3-50ebf692f6a4",
        value: false,
      });
    })
    it("should render not animal adopted yet", () => {
        cy.userLogin();
        cy.get("h4").should("contain", "Vous n'avez pas encore adopter d'animaux");
    })
 })