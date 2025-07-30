describe("Action Page", () => {
    beforeEach(() => {
        cy.visit("/action");
    })
    it("should render 2 actions", () => {
        cy.get('[id^="action-"]').should("have.length", 3)
    });
    it("should redirect to the page link to the actions on click", () => {
        cy.get('[id^="action-"] button').click();
        cy.url().should("include","/mediatorAnimal")
    });
    
    // if admin roles 
    it("should created an action", () => {
        cy.adminLogin();
        cy.visit("/action");
        cy.get('[aria-label="Ajouter une action"]').click();

        cy.get('input[name="title"]').type("New action");
        cy.get('textarea[name="description"]').type('Description of the new actions aiming to give more inf to the action');
        cy.get('input[name="file"]').selectFile('cypress/fixtures/fake.jpg', { force: true });

        cy.get("form").submit();
        cy.wait(1000)
        cy.get('[id^="action-"]').should("have.length", 4)
    })
    it("should delete an action on click", () => {
        cy.adminLogin();
        cy.visit("/action");
        cy.get('[id^="action-"] [data-testid="delete-paraph"]').last().click();
        cy.get('button[aria-label=Oui]').click();

        cy.get('[id^="action-"]').should("have.length", 3);
        cy.task("findByField", {table: "actions", field: "title", fieldValue:'New action'}).then((action) => {
            expect(action).to.be.null;
        });
    })

    it("should update an action", () => {
        cy.adminLogin();
        cy.visit("/action");
        cy.task("findByField",{table:"actions", field: "title",fieldValue: "Other actions"}).then(action => {
            expect(action.description).to.equal("Description of the other action");
        })
        cy.get('[id^="action-"] [data-testid="edit-paraph"]').last().click();
        cy.get('textarea[name="description"]').clear().type("New description of the other action aiming to prouve the update work");
        cy.get("form").submit();
         cy.task("findByField",{table:"actions", field: "title",fieldValue: "Other actions"}).then(action => {
            expect(action.description).to.equal("New description of the other action aiming to prouve the update work");
        })
        cy.task("resetDescriptAfterUpdate", {
            table: 'actions',
            field: "title",
            fieldValue: "Other actions",
            description: "Description of the other action"
        });
        
    })
})