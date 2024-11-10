/// <reference types="cypress" />

describe('Enter to Sign up web and enter your Personal Details', () => {
    it('Enter Personal Details', () => {
        cy.visit('https://idgu.co.il/');
        cy.wait(2000); // חכה יותר זמן אם יש עיכוב בטעינת הדף
        cy.get('div.float-left.home-login-box span a').click();
        cy.get('#column-right div.list-group a:nth-child(2)').click({ force: true });

        // להאזין לשגיאות לא מנוהלות
        Cypress.on('uncaught:exception', (err, runnable) => {
            console.log('Ignoring uncaught exception:', err.message);
            return false; // נמנע מהפסקת הבדיקה
        });

        cy.get('.col-sm-9').find('input[name="firstname"]').type('matanel');
        cy.get('.col-sm-9').find('input[name="lastname"]').type('amram');
        cy.get('.col-sm-9').find('input[name="user_id"]').type('303030456');
        cy.get('.col-sm-9').find('input[name="email"]').type('matanel003@gmail.com');
        cy.get('#input-ext-id').find('option').eq(3).then((option) => {
            cy.get('#input-ext-id').select(option.val());
        });
        cy.get('.col-sm-5').find('input[name="telephone"]').type('2031084');
        cy.get('.col-sm-9').find('input[name="address_1"]').type('Netzach Yisrael 6', { force: true });
        cy.get('.col-sm-9').find('input[name="city"]').type('Sderot', { force: true });
        cy.get('.col-sm-9').find('input[name="postcode"]').type('8707795', { force: true });

        cy.get('.col-sm-9').find('input[name="password"]').type('12345678', { force: true });
        cy.get('.col-sm-9').find('input[name="confirm"]').type('12345678', { force: true });
        cy.get('.col-sm-8').find('input[name="newsletter"]').eq(0).click();
        cy.get('input[name="agree"]').eq(0).click();
        cy.wait(2000); // המתן לאחר לחיצה על הכפתור
        cy.get('input[type="submit"]').click({ force: true });
        cy.contains('חשבונך נוצר בהצלחה').should('be.visible');
        cy.screenshot();

    });
});