import { getGreeting } from '../support/app.po';

describe('real-world-app', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to real-world-app!');
  });
});
