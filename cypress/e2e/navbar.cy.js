describe("navbar", () => {
    beforeEach(() => {
        cy.visit("/")
    })
    it("should redirect to action on action href click", () => {
        cy.get("#menuBtn").click();
        cy.get("nav [href='/action']").last().click();
        cy.url().should("include", '/action')
    })
    it("should redirect to adopter on adopter href click", () => {
        cy.get("#menuBtn").click();
        cy.get("nav [href='/adopter']").last().click();
        cy.url().should("include", '/adopter')
    })
    it("should redirect to article on article href click", () => {
        cy.get("#menuBtn").click();
        cy.get("nav [href='/article']").last().click();
        cy.url().should("include", '/article');
    })
    it("should redirect to contact on contact href click", () => {
        cy.get("#menuBtn").click();
        cy.get("nav [href='/contact']").last().click();
        cy.url().should("include", '/contact')
    })
    it("should redirect to home page on icon click", () => {
        //first icon
        cy.visit("/action")
        cy.get("header>button").click();
        cy.url().should("include", "/")

        //seconde icon
        cy.visit("/action")
        cy.get("#menuBtn").click();
        cy.get(".dropdownMenu [href='/']").click();
        cy.url().should("include", "/")
    })
    it("should redirect to login on icon click without connection", () => {
        cy.get("#menuBtn").click();
        cy.get("header [aria-label='Compte utilisateur']").last().click();
        cy.url().should("include", "/login")
    })
    it("should redirect to userspace on icon click with user log", () => {
        cy.userLogin();
        cy.visit('/');
        cy.get("#menuBtn").click();
        cy.get("header [aria-label='Compte utilisateur']").last().click();
        cy.url().should("include", "/userSpace")
    })
    it("should redirect to admin on icon click with admin log", () => {
        cy.adminLogin();
        cy.visit('/');
        cy.get("#menuBtn").click();
        cy.get("header [aria-label='Compte utilisateur']").last().click();
        cy.url().should("include", "/adminSpace")
    })
    it("should redirect to donnation page on btn click", () => {
        cy.get("[href='/don']").last().click();
        cy.url().should("include", "/don")
    })
})