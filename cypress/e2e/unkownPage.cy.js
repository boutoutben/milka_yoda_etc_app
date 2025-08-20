describe("unkown page", () => {
    it("should render the 404 error page on unkown url", () => {
        cy.visit("/test");
        cy.get("h1").should("contain", "Erreur 404 - page non trouvée")
    })
})