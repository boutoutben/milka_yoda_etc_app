describe('Welcome page', () => {
  beforeEach(() => {
    cy.visit('/'); // mettre l’URL exacte
  });

  it('should find the action \'s container and images', () => {
    cy.get('#actionSumary').should('exist').and('be.visible');
    cy.get('#actionSumary #welcomeImg img').should('have.length', 2)
      .each(($img) => {
        expect($img.attr('src')).to.not.be.empty;
      });
  });
  it("should redirect to the page if the image is clicked", () => {
    // Clique sur la première image d'action
    cy.get('#actionSumary #welcomeImg img') // ← si tu as une classe welcomeImg
      .first()
      .should('be.visible')
      .click();

    // Vérifie l’URL après redirection
    cy.url({ timeout: 10000 }).should("include", "mediatorAnimal");
  });
  it("should redirect to action's page on action arrow click", () => {
    cy.get('#actionSumary [data-testid="arrowSeeMore"]')
      .should('be.visible')
      .click();

    // Attendre que l'URL change, avec un timeout raisonnable
    cy.url({ timeout: 5000 }).should("include", "action");
  });
  it("should find the animals's container", () => {
    cy.get("#animalToAdopt #presentationAnimal").should("exist").and("be.visible");
    cy.get("#animalToAdopt #presentationAnimal").should("have.length",2)
  });
  it("should redirect to animalDetail on animal click", () => {
    cy.get("#animalToAdopt #presentationAnimal")
    .first()
    .click();

    cy.url().should("include", "adopter/cf87dd08-6315-11f0-80a3-50ebf692f6a4")
  })
  it("should redirect to adopter on animals arrow click", () => {
    cy.get("#animalToAdopt [data-testid='arrowSeeMore']").click();
    cy.url().should("include", "adopter");
  })
  it("should find the article's container and img", () => {
    cy.get("#beingCarefullAboutAnimales [data-testid='article']").should("exist").and("be.visible");
    cy.get("#beingCarefullAboutAnimales [data-testid='article'] img").should("have.length", 3)
    .each(($img) => {
        expect($img.attr('src')).to.not.be.empty;
      });
  })
  it("should redirect to article detail on article's click", () => {
    cy.get("#beingCarefullAboutAnimales [data-testid='article'] img")
  .first()
  .should('be.visible')
  .click({force: true});
    cy.url({ timeout: 5000 }).should("include", "/article/947b1228-6316-11f0-80a3-50ebf692f6a4")
  })
  it("should redirect to all article on plus btn click", () => {
    cy.get("#beingCarefullAboutAnimales [data-testid='mainBtn']")
    .should("be.visible")
    .click();

    cy.url().should("include", 'article')  

  })
});
