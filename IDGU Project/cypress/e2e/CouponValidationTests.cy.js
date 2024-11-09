/// <reference types="cypress" />
describe('Coupon Validation Tests', () => {
    beforeEach(() => {
        cy.visit('https://idgu.co.il/');
        cy.wait(2000);
    });
    it('Valid coupon should apply discount', () => {
        cy.get('img[title="ברז מים חם/קר InSinkErator HC1100 עם דוד אלקטרוני מתקדם דגם NEO"]').click({ multiple: true, force: true });
        cy.get('p').contains('קבלו 100 ₪ הנחה עם קופון GET100').should('exist');
        cy.get('div.form-group.button-cart img[height="25"]').click();
        cy.wait(2000);
        cy.get('div.input-group').find('input[name="coupon"]').first().should('exist').type('GET100');
        cy.wait(2000);
        cy.get('.input-group-btn').find('input[type="button"]').click({ force: true });
        cy.wait(2000);
        cy.contains('span.u11278-4', 'לתשלום').click();
        cy.contains('span.total', '2,499').should('exist');

    });
    it('InValid coupon should Not apply discount', () => {
        cy.get('div.image.special-image img[title="מכונת קפה Sage the Bambino Plus"]').eq(1)
            .should('exist').and('be.visible').click({ force: true });
        cy.get('div.form-group.button-cart img[height="25"]').click();
        cy.wait(2000);
        cy.get('div.input-group').find('input[name="coupon"]').first().should('exist').type('GET800i97');
        cy.wait(2000);
        cy.get('.input-group-btn').find('input[type="button"]').click({ force: true });
        cy.wait(2000);
        cy.contains('div.alert.alert-danger', 'הקופון לא קיים / פג תוקפו או נוצל עד תם!').should('exist');
    });

    it('Testing a coupon is similar to testing a valid coupon.', () => {
        cy.get('div.image.special-image img[title="רסיבר DENON דגם AVR-X1800H"]')
            .should('exist').and('be.visible').click({ force: true });
        cy.get('div.form-group.button-cart img[height="25"]').click();
        cy.wait(2000);
        cy.get('div.input-group').find('input[name="coupon"]').first().should('exist').type('GET5O');
        cy.wait(2000);
        cy.get('.input-group-btn').find('input[type="button"]').click({ force: true });
        cy.wait(2000);
        cy.contains('div.alert.alert-danger', 'הקופון לא קיים / פג תוקפו או נוצל עד תם!').should('exist');
        cy.screenshot()

    });

});
