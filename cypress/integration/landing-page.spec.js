/// <reference types="cypress" />

describe('Landing page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('user can sign up', () => {
    cy.intercept('POST', '/api/auth/signup', { statusCode: 201, body: { message: 'User created' } }).as('signupSuccess');
    cy.findByRole('button', { name: /sign up/i })
      .click()
      .get('[data-testid="modal-close-button"]')
      .click();
    cy.findByRole('button', { name: /create account/i }).click();
    // TODO: test error handling
    // invalid params
    // already taken username
    cy.findByLabelText('Username').type('demo');
    cy.findByLabelText('Password').type('password');
    // TODO: also listen for signin request here?
    cy.findByLabelText('Confirm Password')
      .type('password{enter}')
      .wait('@signupSuccess')
      .location('pathname')
      .should('equal', '/dashboard');
  });

  it('user can log in', () => {
    // open modal from navbar
    // mock login request?
    // should be redirected to /dashboard
  });

  // it('user can view demo', () => {
  //   // mock login request?
  //   // should be redirected to /dashboard
  // });
});
