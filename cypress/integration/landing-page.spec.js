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
    cy.findByLabelText('Username').type(Cypress.env('username'));
    cy.findByLabelText('Password').type(Cypress.env('password'));
    // TODO: also listen for signin request here?
    cy.findByLabelText('Confirm Password')
      .type('password{enter}')
      .wait('@signupSuccess')
      .location('pathname')
      .should('equal', '/dashboard');
  });

  it('user can log in', () => {
    cy.findByRole('button', { name: /log in/i }).click();
    cy.findByLabelText('Username').type(Cypress.env('username'));
    cy.findByLabelText('Password')
      .type(Cypress.env('password'))
      .get('.btn-primary')
      .contains(/log in/i)
      .click()
      .location('pathname')
      .should('equal', '/dashboard');
  });
});
