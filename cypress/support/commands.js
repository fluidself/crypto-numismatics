import '@testing-library/cypress/add-commands';
import { signIn } from 'next-auth/client';

Cypress.Commands.add('login', (username = Cypress.env('username'), password = Cypress.env('password')) => {
  return new Cypress.Promise((resolve, reject) => {
    signIn('credentials', { redirect: false, username, password }).then(result => {
      console.log(result);
      if (!result.error) {
        resolve(result);
      } else {
        reject(result.error);
      }
    });
  });
});
