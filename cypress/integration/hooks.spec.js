describe("API Tests", () => {
  it("POST - JsonPlaceHolder API", () => {
    let firstName = "EL MALHOUF";
    cy.request({
      url: "https://jsonplaceholder.typicode.com/posts",
      method: "POST",
      body: {
        name: name,
        firstName: firstName,
      },
    }).then((response) => {
      let body = response.body;
      expect(body.firstName).to.eq(firstName);
    });
  });
});
