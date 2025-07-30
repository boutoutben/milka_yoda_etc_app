describe("ArticleDetail page", () => {
    it("should render the title of the article", () => {
        cy.visit("article/b3b9bc6e-6cb9-11f0-b3aa-50ebf692f6a4");
        cy.get("h1").should("contain", "ezrui zeri uaezr poiazeu poizeur ipaoz e");
    })
    it("should return to write article on update article", () => {
        cy.adminLogin();
        cy.visit("article/b3b9bc6e-6cb9-11f0-b3aa-50ebf692f6a4");
        cy.get("[data-testid='edit-paraph']").click();
        cy.url().should("include", '/writeArticle/b3b9bc6e-6cb9-11f0-b3aa-50ebf692f6a4')
    })

    it("should delete the article on delete click", () => {
        cy.addArticle();
        cy.visit("/article");
        cy.get("[data-testid=delete-paraph]").first().click();
        cy.get("[aria-label=Oui]").click();

        cy.task("findByField", {
            table: "articles",
            field: "title",
            fieldValue: "New article"
        }).then(article => {
            expect(article).to.be.null;
        });
    })
})