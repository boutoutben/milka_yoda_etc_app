describe("contact page", () => {
    beforeEach(() => {
        cy.visit("/contact");
    });

    it("should send the email", () => {
        cy.get("input[name=lastname]").type("Testname");
        cy.get("input[name=firstname]").type("Test");
        cy.get("input[name=email]").type("test2@example.com");
        cy.get("input[name=subject]").type("Test of the suject's mail");
        cy.get("textarea[name=message]").type("Message of the suject aiming to test the message work correctly");

        cy.intercept('POST', 'https://api.emailjs.com/api/v1.0/email/send-form', {
            statusCode: 200,
            body: {},
        }).as('emailjsRequest');

        cy.get('form').submit();

        cy.wait('@emailjsRequest');

        cy.get('input[name="lastname"]').should('have.value', '');
        cy.get('input[name="firstname"]').should('have.value', '');
        cy.get('input[name="email"]').should('have.value', '');
        cy.get('input[name="phone"]').should('have.value', '');
        cy.get('input[name="subject"]').should('have.value', '');
        cy.get('textarea[name="message"]').should('have.value', '');
    })

    it("should not submit is form not valid", () => {
        cy.get("input[name=lastname]").type("Testname");
        cy.get("input[name=firstname]").type("Test");
        cy.get("input[name=email]").type("test2@example.com");
        cy.get("textarea[name=message]").type("Message of the suject aiming to test the message work correctly");
        cy.get('form').submit();

        cy.get(".formError", { timeout: 2000 }).should("contain", "Le sujet est requis.")

        cy.get('input[name="lastname"]').should('have.value', 'Testname');
        cy.get('input[name="firstname"]').should('have.value', 'Test');
        cy.get('input[name="email"]').should('have.value', 'test2@example.com');
        cy.get('input[name="phone"]').should('have.value', '');
        cy.get('input[name="subject"]').should('have.value', '');
        cy.get('textarea[name="message"]').should('have.value', 'Message of the suject aiming to test the message work correctly');
    })
})