// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add('userLogin', () => {
  cy.visit("/login");
  cy.get("input[name=email]").type("test@example.com");
    cy.get("input[name=password]").type("Test123!");

    cy.get("form [data-testid=mainBtn]").click();
     cy.url({ timeout: 5000 }).should("include", "userSpace");
    
})


Cypress.Commands.add("adminLogin", () => {
    cy.visit("/login");
    cy.get("input[name=email]").type("test.admin@example.com");
    cy.get("input[name=password]").type("Test123!");

    cy.get("form [data-testid=mainBtn]").click();

    cy.url().should("include", "/adminSpace")
})

Cypress.Commands.add("createAnimal", () => {
  cy.adminLogin();
        cy.visit('/adopter')
        cy.get("[aria-label='Ajouter un animal']").click()
        cy.get("input[name=name]").type("New animal");
        cy.get("textarea[name=description]").type("Description of the new animal aiming to tell more detail about it");
        cy.get("select[name=sexe]").select("Mâle");
        cy.get("select[name=isSterile]").select("1");
        cy.get("input[name=born]").type("2024-07-09");
        cy.get("select[name=animal]").select("chien");
        cy.get("[data-testid=races-select]").click();
        cy.get("input[type=checkbox][value=67e2c055daa0667b5a4eeb89]").click({force: true});
        cy.get('input[name="file"]').selectFile('cypress/fixtures/fake.jpg', { force: true });
        cy.get("[data-testid=addAnimals-form]").submit();
        cy.get("[data-testid=presentationAnimal]").should("have.length", 4)
})

Cypress.Commands.add("fillAdopterProfile", () => {
  cy.visit("/adopter/cf87dd08-6315-11f0-80a3-50ebf692f6a4");
  cy.get("[aria-label='Rencontrer cette animal']").click();
  cy.get("select[name=civility]").select("1");
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
  cy.get("form").submit()
  cy.url().should("include", "/adopterSumary")
})

Cypress.Commands.add("addArticle", () => {
  cy.adminLogin();
  cy.visit("/article");

  cy.get("[aria-label='Ajouter un article']").click();
  cy.get("input[name=title]").type("New article");
  cy.get("textarea[name=description]").type(
    "Description of the new article aiming to tell more information about the article"
  );
  cy.get('input[name="file"]').selectFile('cypress/fixtures/fake.jpg', { force: true });

  cy.get("form").submit();

  // 🔎 Attendre la redirection vers l'éditeur après création
  cy.task("findByField", {
    table: "articles",
    field: "title",
    fieldValue: "New article"
  }).then(article => {
    cy.url().should("include", `writeArticle/${article.id}`);

    // 💾 Enregistrer l’article depuis l’éditeur
    cy.get("[aria-label=Enregistrer]").click({ force: true });

    // Attendre la redirection vers l’article publié
    cy.url().should("include", `article/${article.id}`);
  cy.task("findByField", {
      table: "articles",
      field: "id",
      fieldValue: article.id
    }).then(updatedArticle => {
      expect(updatedArticle.isPublish).to.equal(1); // ou `true` selon DB
    });
  })
})

Cypress.Commands.add("loginResetPasswordClick", () => {
  cy.visit("/login")
  cy.get("[data-cy = forgot_password]").click({force: true});
    cy.wait(500);
    cy.get("[name=email]").first().type("test@example.com")
    cy.get("form").first().submit()
})

Cypress.Commands.add("resetPassword", (password, confirmPassword) => {
  cy.loginResetPasswordClick();
  cy.task("findUserByEmail","test@example.com").then((user) => {
    cy.visit(`/reset-password/${user.resetToken}`);
    cy.get("form").should("be.visible");
    cy.get("input[name=password]").type(password);
    cy.get("input[name=confirmPassword]").type(confirmPassword);
    cy.get("form").submit();
  });
})