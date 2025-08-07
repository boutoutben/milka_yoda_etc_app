import convertExpiresInToMs from "../../React_app_part/src/utils/convertExpiresInToMS";

describe("loginPage", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("should login and redirect to userSpace", () => {
   cy.userLogin();
    cy.window().then((win) => {
    cy.window().then((win) => {
    const token = win.localStorage.getItem('token');
    expect(token).to.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/); // JWT format
    });
    cy.window().should((win) => {
      const raw = win.localStorage.getItem('tokenExpiration');
      expect(raw).to.be.a('string').and.not.be.empty;

      const tokenExpiration = new Date(raw);
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;

      expect(tokenExpiration.getTime()).to.be.closeTo(now + oneHour, 5000);
    });
  });
  });

  it("remember me should set tokenExpiration to 30d", () => {
  cy.get("input[name=email]").type("test@example.com");
  cy.get("input[name=password]").type("Test123!");

  // Make sure you also check or set the remember_me checkbox!
   cy.get("input[name=remember_me]").check({force: true});

  cy.get("form [data-testid=mainBtn]").click();

  cy.window().should((win) => {
    const raw = win.localStorage.getItem('tokenExpiration');
    expect(raw).to.be.a('string').and.not.be.empty;

    const tokenExpiration = new Date(raw);
    const now = Date.now();
    const thirtyDaysMs = convertExpiresInToMs("30d");

    expect(tokenExpiration.getTime()).to.be.closeTo(now + thirtyDaysMs, 5000);
  });
});

it("should return invalid data if password ou email are not rigth", () => {
  cy.get("input[name=email]").type("test@example.com");
    cy.get("input[name=password]").type("Test123?");

    cy.get("form [data-testid=mainBtn]").click();

    cy.get(".formError").should("contain", "L'email ou le mot de passe est incorect")

  cy.get("input[name=email]").type("test@exampl.com");
    cy.get("input[name=password]").type("Test123!");

    cy.get("form [data-testid=mainBtn]").click();

    cy.get(".formError").should("contain", "L'email ou le mot de passe est incorect")
})

it("should block login after 7 failed attempts, then allow after 15 minutes", () => {
  // Fail login 8 times
  const failLogin = () => {
    cy.get("input[name=email]").clear().type("test@example.com");
    cy.get("input[name=password]").clear().type("WrongPass123!");
    cy.get("form [data-testid=mainBtn]").click();
    cy.get(".formError", { timeout: 2000 }).should("exist");
  };

  Cypress._.times(7, failLogin);

  cy.get(".formError").should("contain", "Trop de tentatives. Réessayez dans 15 min");

  cy.wait(15000);

  // Then retry login
  cy.get("input[name=email]").clear().type("test@example.com");
  cy.get("input[name=password]").clear().type("Test123!");
  cy.get("form [data-testid=mainBtn]").click();

  cy.url().should("include", "/userSpace");
})  

  it("should login as admin", () => {
    cy.adminLogin()

  })

  it("should not submit is form not valid", () => {
    cy.get("input[name=email]").type("testexample.com");
    cy.get("input[name=password]").type("Test123!");

    cy.get("form [data-testid=mainBtn]").click();

    cy.get(".formError").should("contain", "Adresse e-mail invalide.")
  })

  it("should redirect to register", () => {
    cy.get('a[href="/register"]').click()
    cy.url().should("include", "register")
  })

  it("should send a mail on forgotten btn click", () => {
    cy.loginResetPasswordClick()
    cy.wait(500);
    cy.get(".sucess_message", { timeout: 5000 }).should("contain", "Un email vous a été envoyé");
  })
});