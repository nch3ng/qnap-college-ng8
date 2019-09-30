context('Admin', function() {
  const url = 'https://localhost:4200/admin'

  beforeEach(() => {
    cy.server();
    cy.route(' http://localhost:3000/api/check-state', {"success":false,"message":"No token provided","status":401}).as('checkState');
    cy.visit(url);
  });

  it('should go to admin page', function() {
  });
});