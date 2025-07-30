describe("adoptPage", () => {
    beforeEach(() => {
        cy.visit('/adopter')
    })
    it("should render 3 animals", () => {
        cy.get("[data-testid=presentationAnimal]").should("have.length",3)
    })

    it("should redirect to animalDetail on animal click", () => {
        cy.get("[data-testid=presentationAnimal]").first().click();
        cy.url().should("include",'/adopter/cf87dd08-6315-11f0-80a3-50ebf692f6a4')
    })

    it("searchbar should work", () => {
        cy.get("input[type=search]").type("Volt")
        cy.get("[data-testid=presentationAnimal] [data-cy=animal-name]").should("contain", "Volt")
    })
    it("filter should work", () => {
        cy.get('input[type="radio"][name="espece"][value="chien"]').check();
        cy.get("form").submit()
         cy.get("[data-testid=presentationAnimal]").should("have.length", 2)

         cy.get('input[type="radio"][name="age"][value="senior"]').check();
        cy.get("form").submit()
        cy.get(".noAnimal").should("contain", "Il n'y a pas d'animaux ou pas qui corresponde à votre demande")
        cy.get("[data-testid=presentationAnimal]").should("have.length", 0)
    })
    it("should create an animal", () => {
        cy.createAnimal();
        cy.task("deleteByField", {table: "animals", field: "name", fieldValue: "New animal"})
    })
    it("should fail if validation is invalid on add", () => {
        cy.adminLogin();
        cy.visit('/adopter');
        cy.get("[aria-label='Ajouter un animal']").click()
        cy.get("[data-testid=addAnimals-form]").submit();
        cy.get(".formError", { timeout: 2000 }).first().should("contain", "Le nom de l'animal est requis.")
    })
})