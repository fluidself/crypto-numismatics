/// <reference types="cypress" />

describe('Dashboard page', () => {
  it('user can add, edit, and delete holdings', () => {
    cy.login().visit('/').location('pathname').should('equal', '/dashboard');
    // mock state into blank slate?
    // mock assets to search in?
    // mock DB call to add holding?
    // mock DB call to edit holding?
    // mock DB call to deletee holding?
  });
});
