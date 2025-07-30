describe("mediatorAnimal page", () => {
    beforeEach(() => {
        cy.visit("/mediatorAnimal");
    });

    it("should render 2 mediator animal", () => {
        cy.get("[data-testid=presentationAnimal]").should("have.length", 2);
    })
    it("should redirect to animalDetail on animalMediator click", () => {
        cy.get("[data-testid=presentationAnimal]").first().click();
        cy.url().should("include", '/mediatorAnimal/0b7ad6a7-6c81-11f0-b1fe-50ebf692f6a4')
    })
    it("should add a new mediator animal", () => {
        cy.adminLogin();
        cy.visit("/mediatorAnimal");
        cy.get("[aria-label='Ajouter un animal']").click();
        cy.get("input[name=name]").type("New animal");
        cy.get("textarea[name=description]").type("Description of the new animal aiming to tell more detail about it");
        cy.get("select[name=sexe]").select("Mâle");
        cy.get("select[name=isSterile]").select("1");
        cy.get("input[name=born]").type("2024-07-09");
        cy.get("select[name=animal]").select("chien");
        cy.get("[data-testid=races-select]").click();
        cy.get("input[type=checkbox][value=67e2c055daa0667b5a4eeb89]").click({force: true});
        cy.get('input[name="file"]').selectFile('cypress/fixtures/fake.jpg', { force: true });
        cy.get("[data-testid=addAnimals-form]").submit();

        cy.get("[data-testid=presentationAnimal]").should("have.length", 3);
        cy.task("deleteByField", {table: "animals", field: "name", fieldValue: "New animal"})
    })
    it("should fail if validation is invalid on add", () => {
        cy.adminLogin();
        cy.visit('/mediatorAnimal');
        cy.get("[aria-label='Ajouter un animal']").click()
        cy.get("[data-testid=addAnimals-form]").submit();
        cy.get(".formError", { timeout: 2000 }).first().should("contain", "Le nom de l'animal est requis.")
    })
})