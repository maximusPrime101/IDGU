/// <reference types="cypress" />

describe('Add Coupon', () => {

    beforeEach(() => {

        // Suppress specific POST requests to analytics
        // cy.intercept('POST', '**/g/collect').as('suppressPost');

        cy.visit('https://idgu.co.il');
        cy.wait(2000);
    });

    it('Checks if valid coupon works', () => {
        // Clicks on first item on carousel
        cy.get('#featured_categories_home >div >div >div>div div:nth-child(2) a')
            .first().click({ force: true });

        // Save product price
        cy.get('.u18195-4 span:nth-child(2)').invoke('text').then((priceText) => {
            priceText = priceText.replace(/,/g, '');
            const productPrice = +priceText;
            cy.log('The price is: ', productPrice);

            // Get coupon code and amount
            cy.get('#product p').invoke('text').then((text) => {
                const fullCoupon = text.match(/GET\d+/);
                if (fullCoupon) {
                    const couponCode = fullCoupon[0];
                    const couponAmount = +couponCode.slice(3);
                    cy.log('Coupon amount is: ', couponAmount);

                    // Add item to cart and apply coupon
                    cy.get('#button-cart').click();
                    cy.get('#collapse-coupon div input').first().type(couponCode).then(() => {
                        cy.get('#button-coupon').click();
                        cy.get('.alert.alert-success').should('be.visible');

                        // Check total price
                        cy.get('.u11261 span:nth-child(2)').invoke('text').then((totalText) => {
                            totalText = totalText.replace(/,/g, '');
                            const totalPrice = +totalText;
                            expect(totalPrice).to.equal(productPrice - couponAmount);
                        });
                    });
                } else {
                    cy.log("No coupon code was found.");
                }
            });
            // Assert no analytics POST requests are visible
            //   cy.wait('@suppressPost').its('response.statusCode').should('eq', 204);
        });

        // Remove item and validate removal
        cy.get('.u10930 div:nth-child(2) a').click();
        cy.get('#content h1').should('have.text', 'עגלת הקניות שלי');
    });

    it('Checks if invalid coupon cannot be entered', () => {

        // Clicks on first item on carousel
        cy.get('#featured_categories_home >div >div >div>div div:nth-child(2) a')
            .first().click({ force: true });

        // Save product price
        cy.get('.u18195-4 span:nth-child(2)').invoke('text').then((priceText) => {
            priceText = priceText.replace(/,/g, '');
            const productPrice = +priceText;
            cy.log('The price is: ', productPrice);

            // Add item to cart
            cy.get('#button-cart').click();

            // Enter invalid coupon
            const invalidCouponCode = "INVALID123";
            cy.get('#collapse-coupon div input').first().type(invalidCouponCode).then(() => {
                cy.get('#button-coupon').click();
                cy.get('.alert.alert-danger').should('be.visible');
            });

            // Check total price remains the same
            cy.get('.u11261 span:nth-child(2)').invoke('text').then((totalText) => {
                totalText = totalText.replace(/,/g, '');
                const totalPrice = +totalText;
                expect(totalPrice).to.equal(productPrice);
                cy.log('Success - Coupon did not work!');
            });
        });

        // Remove item and validate removal
        cy.get('.u10930 div:nth-child(2) a').click();
        cy.get('#content h1').should('have.text', 'עגלת הקניות שלי');
    });


    it('Checks if valid coupon cannot be entered twice', () => {

        // Click on the first item on the carousel
        cy.get('#featured_categories_home >div >div >div>div div:nth-child(2) a')
            .first().click({ force: true });

        // Save product price
        cy.get('.u18195-4 span:nth-child(2)').invoke('text').then((priceText) => {
            priceText = priceText.replace(/,/g, '');
            const productPrice = +priceText;
            cy.log('The price is: ', productPrice);

            // Get coupon code and amount
            cy.get('#product p').invoke('text').then((text) => {
                const fullCoupon = text.match(/GET\d+/);
                if (fullCoupon) {
                    const couponCode = fullCoupon[0];
                    const couponAmount = +couponCode.slice(3);
                    cy.log('Coupon amount is: ', couponAmount);

                    // Add item to cart and apply the coupon
                    cy.get('#button-cart').click();
                    cy.get('#collapse-coupon div input').first().type(couponCode).then(() => {
                        cy.get('#button-coupon').click();

                        // Verify coupon applied successfully
                        cy.get('.alert.alert-success').should('be.visible');
                        cy.get('.alert.alert-success button').click({ force: true });

                        // Apply the same coupon again
                        cy.get('#button-coupon').click({ force: true });
                        cy.get('.alert.alert-success button').click({ force: true });

                        // Check that total price remains as expected after first application
                        cy.get('.u11261 span:nth-child(2)').invoke('text').then((totalText) => {
                            totalText = totalText.replace(/,/g, '');
                            const totalPrice = +totalText;
                            expect(totalPrice).to.equal(productPrice - couponAmount);
                            cy.log('Total price after attempting to reapply coupon:', totalPrice);
                        });
                    });
                } else {
                    cy.log("No coupon code was found.");
                }
            });
        });

        // Remove item and validate removal
        cy.get('.u10930 div:nth-child(2) a').click();
        cy.get('#content h1').should('have.text', 'עגלת הקניות שלי');
    });

});


