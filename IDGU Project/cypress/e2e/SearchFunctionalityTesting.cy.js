/// <reference types="cypress" />
describe('Search Functionality Testing', () => {
    beforeEach(() => {
        cy.visit('https://idgu.co.il/');
        cy.wait(2000);
    });

    it('Entered a product that is not found on the site', () => {
        cy.get('#search input[type="text"]').type('בושם').should('have.value', 'בושם');
        cy.wait(2000);
        cy.get('.btn.btn-default.btn-lg').click({ force: true });
        cy.get('div.float-right.idgu-logo a').should('be.visible').click({ force: true });
    });
    it('Entered a product that is found on the site', () => {
        cy.get('#search input[type="text"]').clear().type('טוחן אשפה').should('have.value', 'טוחן אשפה');
        cy.wait(2000);
        cy.get('.btn.btn-default.btn-lg').click({ force: true });
        cy.get('div.image.special-image').eq(0).find('a').click({ force: true });
    });
    it('Entered partial search keywords', () => {
        cy.get('#search input[type="text"]').clear().type('מערכ').should('have.value', 'מערכ');
        cy.wait(2000);
        cy.get('li').contains('27964000 מערכת למקלחת GROHE Euphoria System 210').click({ force: true });
    });
    it('Checking search keywords in English', () => {
        cy.get('#search input[type="text"]').clear().type('lego').should('have.value', 'lego');
        cy.get('.btn.btn-default.btn-lg').click({ force: true });
        cy.screenshot()
    });

});