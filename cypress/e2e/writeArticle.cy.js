const testTextSetter = (index, balise) => {
  cy.get('#sampleeditor')
  .clear()
  .type('test')
  .then($el => {
    cy.selectElement($el)
  });

  cy.get(`.sample-toolbar button:nth-child(${index})`).click();
  cy.get(`#sampleeditor ${balise}`).should("contain.text", "test");
};

describe("write article", () => {
    /*it("should write a text", () => {
        cy.writeArticlePage()
        cy.get('#sampleeditor')
        .clear()
        .type('test')   
        cy.get("#sampleeditor").should("contain", "test")
    })

    it("should reset to the previous and next element", () => {
      cy.writeArticlePage()
        cy.get('#sampleeditor')
        .clear()
        .type('test')   
        
        cy.get("#sampleeditor").should("contain", "test")

        cy.get(".sample-toolbar>button:first-child").click();
        cy.get("#sampleeditor").should("contain", "")
        cy.get(".sample-toolbar>button:nth-child(2)").click();
        cy.get("#sampleeditor").should("contain", "test");
    })

  const tags = ["b", "i", "u", "h1", "h2", "strike"];

  tags.forEach((tag, i) => {
    it(`should set the text in ${tag}` , () => {
      cy.writeArticlePage();
      testTextSetter(3 + i, tag);
    })
    
  });
  it("should set the text into a list", () => {
    cy.writeArticlePage()
    cy.get('#sampleeditor')
    .clear()
    .type('test')
    cy.get(`.sample-toolbar .dropdown`).first().click();
    cy.get("[data-testid=dropDownOption]").first().click();
    cy.get(`#sampleeditor ol>li`).should("contain.text", "test");
  })
  it("should center the text", () => {
    cy.writeArticlePage();
     cy.get('#sampleeditor')
    .clear()
    .type('test')
    cy.get(`.sample-toolbar .dropdown`).last().click();
    cy.get("[data-testid=dropDownOption]").eq(1).click();
    cy.get("#sampleeditor div").should('have.css', 'text-align', '-moz-center')
  })
  it("should change the color to grey", () => {
    cy.writeArticlePage();
     cy.get('#sampleeditor')
    .clear()
    .type('test')
    .then($el => {
      cy.selectElement($el)
    });
    cy.get(".chooseColor").click()
    cy.get("[aria-label='rgb(154,154,154)']").click()
    cy.get("#sampleeditor span").should('have.css', 'color', 'rgb(154, 154, 154)')
  })*/
  it("should register the article content", () => {
    cy.writeArticlePage();
    cy.get('#sampleeditor')
      .clear()
      .type('new test')
    cy.get("[aria-label=Enregistrer]").click();
    cy.url().should("include", '/writeArticle/b3b9bc6e-6cb9-11f0-b3aa-50ebf692f6a4');
    cy.get(".editor").should("contain", "new test");
    cy.writeArticlePage();
    cy.get('#sampleeditor')
      .clear()
      .type('test')
    cy.get("[aria-label=Enregistrer]").click();
  })
  it("should cancelle the change", () => {
    cy.writeArticlePage();
    cy.get('#sampleeditor')
      .clear()
      .type('new test')
    cy.get("[aria-label=Anuller]").click();
    cy.url().should("include", '/writeArticle/b3b9bc6e-6cb9-11f0-b3aa-50ebf692f6a4');
    cy.get(".editor").should("contain", "test");
  })
})