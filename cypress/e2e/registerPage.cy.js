describe("RegisterSection - E2E", () => {
  beforeEach(() => {
    cy.visit("/register"); // assuming /register renders <RegisterSection />
  });
  afterEach(() => {
  cy.task("deleteUserByEmail", "test2@example.com");
});

  it("should register a new user and navigate", () => {
    const testEmail = "test2@example.com";
    cy.get("input[name=lastname]").type("Test");
    cy.get("input[name=firstname]").type("Testname");
    cy.get("input[name=email]").type(testEmail);
    cy.get("input[name=phone]").type("0600000000");
    cy.get("input[name=password]").type("Test123!");
    cy.get("input[name=confirmPassword]").type("Test123!");
    cy.get("input[name=accept]").check({ force: true });

    cy.get("form").submit();

    // Optional: verify navigation if possible (needs custom setup)
    cy.url({timeout:1000}).should("include", "/login");
    cy.get(".sucess_message", { timeout: 5000 }).should("contain", "Inscription réussie");
    cy.task("findUserByEmail", testEmail).then((user) => {
    expect(user).to.not.be.null;
    expect(user.email).to.equal(testEmail);
  });
  });

  it("should not submit is form invalid", () => {
    cy.get("input[name=lastname]").type("test");
    cy.get("input[name=firstname]").type("Testname");
    cy.get("input[name=email]").type("test2@example.com");
    cy.get("input[name=phone]").type("0600000000");
    cy.get("input[name=password]").type("Test123!");
    cy.get("input[name=confirmPassword]").type("Test123!");
    cy.get("input[name=accept]").check({ force: true });

    cy.get("form").submit();

    cy.get(".formError").should("contain", "Format invalide : ex. Dupont ou Legrand-Duval")
  })
  it("should return user already existe", () => {
    cy.get("input[name=lastname]").type("Test");
    cy.get("input[name=firstname]").type("Testname");
    cy.get("input[name=email]").type("test@example.com");
    cy.get("input[name=phone]").type("0600000000");
    cy.get("input[name=password]").type("Test123!");
    cy.get("input[name=confirmPassword]").type("Test123!");
    cy.get("input[name=accept]").check({ force: true });

    cy.get("form").submit();
    cy.url({timeout:1000}).should("include", "/login");
    cy.get(".sucess_message", { timeout: 5000 }).should("contain", "Vous avez déjà un compte");
  })
  it("should redirect to login when 'already have an account' link is clicked", () => {
    cy.get("a[href='/login']")
      .should("be.visible")
      .click();

    cy.location("pathname", { timeout: 2000 }) // checks just the path
      .should("eq", "/login");
  });
});