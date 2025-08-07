describe("reset password", () => {
    it("should reset the password", () => {
        cy.resetPassword("NewPassword123!", "NewPassword123!")
        cy.visit("/login");
        cy.get("input[name=email]").type("test@example.com");
    cy.get("input[name=password]").type("NewPassword123!");

    cy.get("form [data-testid=mainBtn]").click();
     cy.url({ timeout: 5000 }).should("include", "userSpace");
     cy.resetPassword("Test123!", "Test123!")
    });
    it("should not submit error form", () =>  {
        cy.resetPassword("NewPassword123!", "Password123!");
        cy.get(".formError").should("contain", "Les mots de passe doivent correspondre.");
    })
    it("should show toke expires after the delai", () => {
        cy.loginResetPasswordClick();
        cy.task("findUserByEmail","test@example.com").then((user) => {
            cy.wait(10000);
            cy.visit(`/reset-password/${user.resetToken}`);
            cy.get("h4").should("contain","Votre permission est expirés ou votre ne l'avez pas")
        });
    })
});