describe("adopterProfile page", () => {
    beforeEach(() => {
        cy.visit("/adopter/cf87dd08-6315-11f0-80a3-50ebf692f6a4");
        cy.get("[aria-label='Rencontrer cette animal']").click()
    })

    it("should not fill the personnal data", () => {
        cy.get("input[name=lastname]").should("have.value", "");
        cy.get("input[name=firstname]").should("have.value", "");
        cy.get("input[name=email]").should("have.value", "");
    })

    it("should fill the personnal data", () => {
        cy.userLogin();
        cy.visit("/adopterProfile");
        cy.get("input[name=lastname]").should("have.value", "Test");
        cy.get("input[name=firstname]").should("have.value", "Testname");
        cy.get("input[name=email]").should("have.value", "test@example.com");
    })

    it("should submit and redirect to adopterSumary", () => {
        cy.fillAdopterProfile();
    });   

    it("should add another animal and all arrond should work", () => {
        cy.get("input[name=animalCase][value=Autre]").click({force: true});
        cy.get("input[name='otherAnimals[0].name']").type("Ane");
        cy.get("input[name='otherAnimals[0].number']").type(5);

        //add another animal
        cy.get(".animalCaseElement [data-testid=plusBtn]").click()
        cy.get("input[name='otherAnimals[1].name']").type("Cheval");
        cy.get("input[name='otherAnimals[1].number']").type(2);

        //delete animal
        cy.get("[data-testid=delete-paraph]").first().click();
        cy.get("input[name='otherAnimals[0].name']").should('have.value', "Cheval")
        cy.get("input[name='otherAnimals[0].number']").should('have.value', 2);
       cy.get("input[name='otherAnimals[1].name']").should('not.exist');
    })

    it("have child should work", () => {
        cy.get("input[name=haveChildren][value=true]").click({force: true})
        cy.get("[name='child[0]']").type(5);

        //add an child 
        cy.get(".childrenElement [data-testid=plusBtn]").click()
        cy.get("[name='child[1]']").type(3);

        //delete child
        cy.get(".childrenElement [data-testid=delete-paraph]").first().click()
        cy.get("[name='child[0]']").should('have.value', 3);
        cy.get("[name='child[1]]']").should("not.exist");
    })

    it("should render the previous value on previous click in adopterSummary", () => {
        cy.fillAdopterProfile();
        cy.get("[aria-label='Précédent']").click();
        cy.get("select[name=civility]").should("have.value", "1");
        cy.get("input[name=firstname]").should("have.value", "Testname");
        cy.get("input[name=lastname]").should("have.value", "Test");
        cy.get("input[name=age]").should("have.value", 18);
        cy.get("input[name=adressePostale]").should("have.value", "59000");
        cy.get("input[name=phone]").should("have.value", "0600000000");
        cy.get("input[name=email]").should("have.value", "test@example.com");
        cy.get('input[name="animalPlace"][value="Maison avec jardin"]').should('be.checked');
        cy.get("input[name=animalCase][value=Chien]").should("be.checked");
        cy.get("input[name='animalNumber.Chien']").should("have.value", 2);
        cy.get("input[name=lifeRoutine][value=Calme]").should('be.checked');
        cy.get("input[name=haveChildren][value=false]").should('be.checked');
        cy.get("textarea[name=motivation]").should("have.value", "Adopter sumary's motivation aiming to test the motivation of the adopter and check that not error are here");
        cy.get('input[name=accept]').should('be.checked')
    })
    it("should not submit if form error", () => {
  cy.get("select[name=civility]").select("");
  cy.get("input[name=lastname]").type("Test");
  cy.get("input[name=firstname]").type("Testname");
  cy.get("input[name=age]").type(18);
  cy.get("input[name=adressePostale]").type("59000");
  cy.get("input[name=phone]").type("0600000000");
  cy.get("input[name=email]").type("test@example.com");

  cy.get("input[name=animalPlace][value='Maison avec jardin']").click({force: true});
  cy.get("input[name=animalCase][value=Chien]").click({force: true});
  cy.get("input[name='animalNumber.Chien']").type(2);
  cy.get("input[name=lifeRoutine][value=Calme]").click({force: true})
  cy.get("input[name=haveChildren][value=false]").click({force: true})
  cy.get("textarea[name=motivation]").type("Adopter sumary's motivation aiming to test the motivation of the adopter and check that not error are here");
  cy.get("input[name=accept]").click({force: true});
  cy.get("form").submit();
  cy.get(".formError", { timeout: 2000 }).should("contain", "La civilité est requise.")
    })

    it("reset btn should work", () => {
        cy.fillAdopterProfile();
        cy.get("[aria-label='Précédent']").click();
        cy.get("[aria-label='Recommencer']").click();
        cy.get("select[name=civility]").should("have.value", "");
        cy.get("input[name=firstname]").should("have.value", "");
        cy.get("input[name=lastname]").should("have.value", "");
        cy.get("input[name=age]").should("have.value", "");
        cy.get("input[name=adressePostale]").should("have.value", "");
        cy.get("input[name=phone]").should("have.value", "");
        cy.get("input[name=email]").should("have.value", "");
        cy.get('input[name="animalPlace"][value="Maison avec jardin"]').should('be.not.checked');
        cy.get("input[name=animalCase][value=Chien]").should("be.not.checked");
        cy.get("input[name=lifeRoutine][value=Calme]").should('be.not.checked');
        cy.get("input[name=haveChildren][value=false]").should('be.not.checked');
        cy.get("textarea[name=motivation]").should("have.value", "");
        cy.get('input[name=accept]').should('be.not.checked')
    })
})