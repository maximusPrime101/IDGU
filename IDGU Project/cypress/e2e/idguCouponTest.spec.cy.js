/// <reference types="cypress" />

describe('Add Coupon', () => {

    beforeEach(() => {
        cy.visit('https://idgu.co.il');
        //cy.wait(4000);

    });

    it('Add items to cart', () => {

        //validate empty cart
        cy.get('.float-left.home-shopping-cart-box a').first().click({ force: true })
        cy.get('.pull-right').should('exist').click();

        //Clicks on first item on carousel 
        cy.get('#featured_categories_home >div >div >div>div div:nth-child(2) a').first().click({ force: true });

        //Saves the price of product
        let productPrice;
        cy.get('.u18195-4 span:nth-child(2)').invoke('text').then((productPrice) => {
            console.log('The price is: ', productPrice);
        });


        //Adds item to cart
        cy.get('#button-cart').click();


        //checks total price
        let totalPrice = cy.get('.u11261 span:nth-child(2)').invoke('text');

        if (totalPrice == productPrice) {
            console.log('Total payment amount is valid');
        } else console.log('Total payment amount is invalid');


        // removes item and validates removale 
        cy.get('.u10930 div:nth-child(2) a').click()
        cy.get('#content h1 ').should('have.text', 'עגלת הקניות שלי')
    });







});


