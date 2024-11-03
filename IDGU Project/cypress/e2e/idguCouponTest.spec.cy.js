/// <reference types="cypress" />

describe('Add Coupon', () => {

    beforeEach(() => {
        cy.visit('https://idgu.co.il');
        cy.wait(2000);

    });

    it('Checks if valid coupon works', () => {

        //Clicks on first item on carousel 
        cy.get('#featured_categories_home >div >div >div>div div:nth-child(2) a').first().click({ force: true });
        cy.wait(2000);

        //Saves product price
        let productPrice;
        cy.get('.u18195-4 span:nth-child(2)').invoke('text').then((price) => {
            productPrice = +price;
            cy.log('The price is: ', productPrice);
        });

        //Copy coupon and the amount
        let couponCode;
        let coupon;
        cy.get('#product p').invoke('text').then((text) => {
            let fullCoupon = text.match(/GET\d+/);

            if (fullCoupon) {
                couponCode = fullCoupon[0];
                coupon = +couponCode.slice(3);
                cy.log('Coupon amount is: ', coupon);
            } else {
                cy.log("No coupon code was found.");
            }
        })

        //Adds item to cart
        cy.get('#button-cart').click();
        cy.wait(2000);

        //Enter valid coupon
        cy.get('#collapse-coupon div input').first().type(couponCode).then(() => {
            cy.get('#button-coupon').click();
            cy.wait(2000);
            cy.get('.alert.alert-success').should('be.visible');
        })

        //Checks total price
        cy.get('.u11261 span:nth-child(2)').invoke('text').then((text) => {
            let totalPrice = +text;
            expect(totalPrice).to.equal(productPrice - coupon);
        });

        // removes item and validates removal 
        cy.get('.u10930 div:nth-child(2) a').click()
        cy.get('#content h1 ').should('have.text', 'עגלת הקניות שלי')
    });

    it('Checks if invalid coupon can not be entered', () => {

        //Clicks on first item on carousel 
        cy.get('#featured_categories_home >div >div >div>div div:nth-child(2) a').first().click({ force: true });
        cy.wait(2000);

        //Saves product price
        let productPrice
        cy.get('.u18195-4 span:nth-child(2)').invoke('text').then((price) => {
            productPrice = +price;
            cy.log('The price is: ', productPrice);
        });


        //Copy coupon and the amount
        let couponCode;
        let coupon;
        cy.get('#product p').invoke('text').then((text) => {
            let fullCoupon = text.match(/GET\d+/);
            couponCode = fullCoupon[0];
            if (fullCoupon) {
                coupon = +couponCode.slice(3);
                cy.log('Coupon amount is: ', coupon);
            } else {
                cy.log("No coupon code found.");
            }
        })

        //Adds item to cart
        cy.get('#button-cart').click();
        cy.wait(2000);

        //Enter Invalid coupon
        cy.get('#collapse-coupon div input').type(coupon).then(() => {
            cy.get('#button-coupon').click();
            cy.wait(2000);
            cy.get('.alert.alert-danger').should('be.visible');
        })

        //Checks total price
        cy.get('.u11261 span:nth-child(2)').invoke('text').then((text) => {
            let totalPrice = +text;
            expect(totalPrice).to.equal(productPrice);
            cy.log('Success - Coupon did not work!');
        });

        // removes item and validates removal 
        cy.get('.u10930 div:nth-child(2) a').click()
        cy.get('#content h1 ').should('have.text', 'עגלת הקניות שלי')
    })

    it('Checks if valid coupon can not be entered twice', () => {

        //Clicks on first item on carousel 
        cy.get('#featured_categories_home >div >div >div>div div:nth-child(2) a').first().click({ force: true });
        cy.wait(2000);

        //Saves product price
        let productPrice;
        cy.get('.u18195-4 span:nth-child(2)').invoke('text').then((price) => {
            productPrice = +price;
            cy.log('The price is: ', productPrice);
        });

        //Copy coupon and the amount
        let couponCode;
        let coupon;
        cy.get('#product p').invoke('text').then((text) => {
            let fullCoupon = text.match(/GET\d+/);
            couponCode = fullCoupon[0];
            if (fullCoupon) {
                coupon = +couponCode.slice(3);
                cy.log('Coupon amount is: ', coupon);
            } else {
                cy.log("No coupon code was found.");
            }
        })

        //Adds item to cart
        cy.get('#button-cart').click();
        cy.wait(2000);

        //Enter valid coupon
        cy.get('#collapse-coupon div input').type(couponCode).then(() => {
            cy.get('#button-coupon').click();
            cy.wait(2000);
            cy.get('#button-coupon').click();
            cy.wait(2000);
            cy.get('.alert.alert-success').should('be.visible');
        })

        //Checks total price
        cy.get('.u11261 span:nth-child(2)').invoke('text').then((text) => {
            let totalPrice = +text;

            console.log('Expected total price: ', productPrice - coupon);
            console.log('Actual total price: ', totalPrice);

            expect(totalPrice).to.equal(productPrice - coupon);
        });

        // removes item and validates removal 
        cy.get('.u10930 div:nth-child(2) a').click()
        cy.get('#content h1 ').should('have.text', 'עגלת הקניות שלי')
    });



});


