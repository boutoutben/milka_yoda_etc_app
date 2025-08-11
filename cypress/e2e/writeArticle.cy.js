describe("write article", () => {
    it("should write a text", () => {
        cy.adminLogin();
        cy.visit("article/b3b9bc6e-6cb9-11f0-b3aa-50ebf692f6a4");
        cy.get("[data-testid='edit-paraph']").click();
        cy.url().should("include", '/writeArticle/b3b9bc6e-6cb9-11f0-b3aa-50ebf692f6a4');
        cy.get('#sampleeditor').clear().type("cc");
        cy.select("#sampleeditor")
    })
})