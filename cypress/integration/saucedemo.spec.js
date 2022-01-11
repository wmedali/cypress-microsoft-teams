describe("Sauce Demo Authentication tests", function () {
  beforeEach(function () {
    cy.visit("https://www.saucedemo.com/");
  });

  it("SC-1 : Authentication with valid username/password", function () {
    cy.get("[data-test='username']").type("standard_user");
    cy.get("[data-test='password']").type("secret_sauce");
    cy.get("[data-test='login-button']").click();

    cy.get("#inventory_container").should("be.visible");
    // Equivalent à : cy.get("[id=inventory_container]").should("be.visible");

    cy.get(".shopping_cart_link").should("be.visible");
    // Equivalent à : cy.get("[class=shopping_cart_link]").should("be.visible");

    cy.get("#item_3_title_link").then(($elem) => {
      cy.log($elem.text());
    });
  });

  it("SC-2 : Valid username and invalid password", function () {
    cy.get("[data-test='username']").type("standard_user");
    cy.get("[data-test='password']").type("AAAAA");
    cy.get("[data-test='login-button']").click();
  });

  it("SC-3 : Invalid username and valid password", function () {
    cy.get("[data-test='username']").type("mohammed_ali");
    cy.get("[data-test='password']").type("secret_sauce");
    cy.get("[data-test='login-button']").click();

    cy.get('[data-test="error"]').should("be.visible");
    cy.get('[data-test="error"]').should(
      "include.text",
      "Username and password do not match"
    );
  });

  it("SC-4 : Locked out user", function () {
    cy.get("[data-test='username']").type("locked_out_user");
    cy.get("[data-test='password']").type("secret_sauce");
    cy.get("[data-test='login-button']").click();

    cy.get('[data-test="error"]').should("be.visible");
    cy.get('[data-test="error"]').should("include.text", "locked out");
  });
});
