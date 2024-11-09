/// <reference types="cypress" />

describe('Product Filtering Tests', () => {
    beforeEach(() => {
        cy.visit('https://idgu.co.il/');
        cy.wait(2000); // מומלץ להימנע מ- wait אם אפשר
    });

    it('Price Filter: High to Low Category 1', () => {
        cy.get('.main_menu_header a').contains('רסיברים ומגברים').click({ force: true });
        cy.get('a.sortdesc.price_filter').click({ force: true });
        cy.get('#u8591-4').should('exist');
    });

    it('Price Filter: Low to High Category 1', () => {
        cy.get('.main_menu_header a').contains('רסיברים ומגברים').click({ force: true });
        cy.get('a.sortasc.price_filter').click({ force: true });
        cy.get('#u8591-4').should('exist');
    });

    it('Price Filter: High to Low Category 2', () => {
        cy.get('a.dropdown-toggle').contains('מעילי יוניקלו').trigger('mouseover');
        cy.get('a').contains('מעילי יוניקלו לגברים').click();
        cy.get('a.sortdesc.price_filter').click({ force: true });
        cy.contains('.u8591', '539').should('be.visible');
    });

    it('Price Filter: Low to High Category 2', () => {
        cy.get('a.dropdown-toggle').contains('מעילי יוניקלו').trigger('mouseover');
        cy.get('a').contains('מעילי יוניקלו לגברים').click();
        cy.get('.col-xs-12 a').contains('מחיר מהנמוך לגבוה').click({ force: true });
        cy.contains('#u8591-4', '299').should('be.visible');
    });

    it('Product Filtering by Brand - Yamaha and Denon', () => {
        cy.get('.main_menu_header a').contains('רסיברים ומגברים').click({ force: true });

        // בדיקת סינון על המותג "YAMAHA"
        cy.get('.checkbox').find('input[name="filtered[]"],input[type=checkbox]').first().should('be.visible').click({ force: true });
        cy.wait(2000); // להמתין לטעינת המוצרים של YAMAHA
        cy.get('#column-left>div')
            .each((el) => {
                cy.wrap(el).invoke('text').should('include', 'YAMAHA');
            })
            .its('length').should('be.gte', 5);

        // הסרת הסינון של YAMAHA
        cy.get('.checkbox').find('input[name="filtered[]"],input[type=checkbox]').first().click({ force: true });

        // בדיקת סינון על המותג "Denon"
        cy.get('.checkbox').find('input[name="filtered[]"],input[type=checkbox]').eq(1).should('be.visible').click({ force: true });
        cy.wait(2000); // להמתין לטעינת המוצרים של Denon
        cy.get('#column-left>div')
            .should('have.length', 6) // לוודא שיש בדיוק 6 מוצרים
            .each((el) => {
                cy.wrap(el).invoke('text').then((text) => {
                    expect(text.toLowerCase()).to.contain('denon');
                });
                cy.get('input[name="filtered[]"][value="17"]')
                    .should('be.visible')
                    .click({ multiple: true, force: true });
                cy.screenshot()
            });
    });
});