context('Login', function() {
  const url = 'https://localhost:4200/login';

  Cypress.Commands.add('is_login_page', () => {
    cy.url().should('include', '/login');
    cy.get('.form').within( ($form) => {
      cy.get('input[name="email"]').type('email').should('exist');
      cy.get('input[name="password"]').type('password').should('exist');
    });
  });
  
  beforeEach(() => {
    cy.server();
    cy.route(' http://localhost:3000/api/check-state', {"success":false,"message":"No token provided","status":401}).as('checkState');
    cy.visit(url);
  });

  it('should be a valid login page', function() {
    cy.is_login_page();
    cy.get('#login-button').should('disabled');
    cy.get('#facebook').should('be.visible');
    cy.get('#googleplus').should('be.visible');
    cy.get('#terms').should('have.attr', 'href').and('include', '/termsofuse');
    cy.get('#policy').should('have.attr', 'href').and('include', 'https://www.qnap.com/en/privacy-notice/qnap');
    cy.get('#cookie_policy').should('have.attr', 'href').and('include', 'https://www.qnap.com/en/privacy-notice/qnap');
  });

  it('should not be able to submit when invalid email', function() {
    cy.get('[name="email"]')
      .type('test').should('have.value', 'test');
    cy.get('#login-button').should('disabled');

    cy.get('[name="password"]')
      .type('password').should('have.value', 'password');

    cy.get('[name="email"]')
      .type('@test.com').should('have.value', 'test@test.com');

    cy.get('#login-button').should('not.disabled'); 
  });

  it('should show error when login failed', function() {
    cy.route('POST', 'http://localhost:3000/api/login', {"success":false,"message":"User does not exist"});
    cy.get('[name="email"]').type('test@test.com');
    cy.get('[name="password"]')
      .type('password');

    cy.get('form').submit();
  });

  it('should go to signup page', function() {
    cy.get('.signup').click();
    cy.url().should('include', '/signup');
  });

  it('should go to forget password page', function() {
    cy.get('.forget-password').click();
    cy.url().should('include', '/forget-password');
  });
});