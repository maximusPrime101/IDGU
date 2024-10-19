/// <reference types="cypress" />

describe('IDGU project', () => {


    it('', () => {

        cy.visit('https://idgu.co.il/');


        //   מציאת אלמנט Delivery to ובדיקת קיומו
        cy.get('#glow-ingress-line1', { timeout: 30000 }).should('exist');

        //מציאת ul ראשונה והדפסה ללוג של טקסט הli הראשון בה
        cy.get('ul:first-of-type>li').then(() => {
            cy.log('input text to li')
        });

        //מציאת שדה טקסט חיפוש והקלדה headphones לתוכו
        cy.get('#twotabsearchtextbox').type('headphones {enter}');

        //סינון התוצאות שהתקבלו לחברה sony בלבד
        cy.get('[aria-label="Sony"] span a').click();

        //מצאו את העגלה והקליקו
        // וודאו הימצאות הטקסט שאומר שהעגלה ריקה
        cy.get('.nav-cart-icon.nav-sprite').click({ force: true });

        cy.get('.a-size-large.a-spacing-top-base.sc-your-amazon-cart-is-empty').within(() => {
            cy.contains('Your Amazon Cart is empty').should('exist');
        });


        //לחצו על הלוגו של אמזון לחזרה לדף הראשי
        cy.get('#nav-logo-sprites').click();

        //בצעו החלפת שפה לספרדית
        cy.get('#nav-tools a').first().click().then(() => {
            cy.get('input[value="es_US"]').click({ force: true });
            cy.get('#icp-save-button span input').click({ force: true });
        });

        //וודאו שהטקסט שהיה קודם Delivery to התחלף ל Enviar a בספרדית
        cy.wait(4000);
        cy.get('#glow-ingress-line1').within(() => {
            cy.contains('Enviar a').should('exist');
        });
    });
});