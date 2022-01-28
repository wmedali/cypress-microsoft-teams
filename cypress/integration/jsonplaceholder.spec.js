it("POST - JsonPlaceHolder API", () => {
  const firstName = "Tester";
  const lastName = "Cypress";
  cy.request({
    url: "https://jsonplaceholder.typicode.com/posts",
    method: "POST",
    body: {
      lastName: lastName,
      firstName: firstName,
    },
  }).then((response) => {
    let body = response.body;
    expect(body.firstName).to.eq(firstName);
    expect(body.lastName).to.eq(lastName);
  });
});
