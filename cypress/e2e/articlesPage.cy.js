describe("Article Page", () => {
    beforeEach(() => {
        cy.visit("/article")
    })
    it("should render 4 articles", () => {
        cy.get("[data-testid=article]").should("have.length",4)
    });
    it("should redirect to article details on article click", () => {
        cy.get("[data-testid=article]").last().click();
        cy.url().should("include", "/article/aa0d46f9-68b7-11f0-b51e-50ebf692f6a4");
    });
    it("should add an article", () => {
      cy.addArticle()  
    });
    it("should delete the article on click", () => {
        cy.adminLogin();
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
    });
    it("should update the article", () => {
        cy.adminLogin();
        cy.visit("/article");
        cy.task("findByField",{table:"articles", field: "title",fieldValue: "lastArticle"}).then(action => {
            expect(action.description).to.equal("articles's description aiming to tell more about the article's content");
        })
        cy.get("[data-testid=edit-paraph]").first().click();
        cy.get("textarea[name=description]").clear().type("new articles's description aiming to tell more about the article's content");
        cy.get("form").submit();
        cy.wait(500);
        cy.task("findByField",{table:"articles", field: "title",fieldValue: "lastArticle"}).then(action => {
            expect(action.description).to.equal("new articles's description aiming to tell more about the article's content");
        });
        cy.task("resetDescriptAfterUpdate", {
            table: 'articles',
            field: "title",
            fieldValue: "lastArticle",
            description: "articles's description aiming to tell more about the article's content"
        });
    })
})