/// <reference types="cypress" />


describe('Shipping calculator', () => {
    beforeEach(() => {
        cy.visit('https://idgu.co.il');
        cy.wait(2000);

        //Enter calculator's page
        cy.get('.container >div >div ul .main-menu.dropdown a').first().click({ force: true })
            .then(() => {
                cy.get('.container >div >div> ul >li ul li a', { timeout: 10000 }).first().click({ force: true });
            });
        cy.get('.col-sm-12.nopadding').find('a[href="/shipping_cost_calculator"]').click({ force: true });

    });

    it('Calculate clothing category- Cheapest spec', () => {

        //Clothing
        cy.get('#main-category').find('div[onclick="getSubCategories(\'28\')"]').click({ force: true });
        //Underwear
        cy.get('div[id="sub-category"]').find('div[onclick="getCalculator(\'30\',\'28\')"] >div').click({ force: true }).should('have.attr', 'class', 'blue_box_2 step_box selected', { timeout: 10000 });
        //Filling Calculator
        cy.get('div[id="calculator"]').find('#our_price').type('50', { force: true });
        cy.get('div[id="calculator"]').find('input[type="checkbox"]').first().click({ force: true }).should('be.checked');
        cy.get('div[id="calculator"]').find('#weight').type('1', { force: true });//weight
        cy.get('div[id="calculator"]').find('#length').type('10', { force: true });//length
        cy.get('div[id="calculator"]').find('#width').type('10', { force: true });//width
        cy.get('div[id="calculator"]').find('#height').type('10', { force: true });//height
        cy.get('div[id="calculator"]').find('#button-calculate').click({ force: true });

        //Check result
        let taxesAndShipping = 0;
        let totalTax = 0;
        let productPrice = 0;

        cy.get('div[id="calculator-results"]')
            .find('span')
            .should('have.length.greaterThan', 0)
            .each(($span, index, $list) => {
                const text = $span.text().trim();
                const spanStyle = $span.attr('style') || '';
                const isLineThrough = spanStyle.includes('line-through');

                // Match numeric values and ignore other text
                const priceMatch = text.match(/[\d,.]+/);
                //cy.log('priceMatch is ', priceMatch);

                if (priceMatch && priceMatch[0]) {
                    const price = parseFloat(priceMatch[0].replace('$', '').trim());
                    cy.log('price is ', price);
                    //cy.log('index is ', index)
                    //Saves product price
                    if (index == 3) {
                        productPrice = price;
                    }

                    // Sums all taxes and shipping  
                    if (
                        text.includes('$') &&
                        spanStyle.includes('float:left') &&
                        (spanStyle.includes('font-size:15px') || spanStyle.includes('font-size:20px')) &&
                        !isLineThrough &&
                        index < $list.length - 4 //Exclude Total Tax span
                    ) {
                        taxesAndShipping = Number((taxesAndShipping + price).toFixed(2));;
                        cy.log('Sum of taxes and shipping is: ', taxesAndShipping);
                    }

                    // Capture and validate the sum of tax at the correct index
                    if (index === $list.length - 4) {
                        totalTax = price;
                        cy.log('Total price for taxes:', totalTax);

                        // Self-check if all tax and shipping costs match the shown price
                        cy.wrap(null).then(() => {
                            expect(Number((taxesAndShipping - productPrice).toFixed(2))).to.eq(Number(totalTax.toFixed(2)));
                            cy.log('Total Sum Check Passed');
                        });
                    }

                    // Capture and validate the final price at the correct index
                    if (index === $list.length - 2) {
                        const finalPrice = price;
                        cy.log('Final Price Span:', finalPrice);

                        // Perform the final assertion
                        cy.wrap(null).then(() => {
                            expect(Number(taxesAndShipping.toFixed(2))).to.eq(Number(finalPrice.toFixed(2)));
                            cy.log('Final Price Check Passed');
                        });
                    }
                }
            });

    });

    it('Calculate clothing category- Special delivery tax 30$ (under 20kg, length +120cm)', () => {

        //Clothing
        cy.get('#main-category').find('div[onclick="getSubCategories(\'28\')"]').click({ force: true });
        //Underwear
        cy.get('div[id="sub-category"]').find('div[onclick="getCalculator(\'30\',\'28\')"] >div').click({ force: true }).should('have.attr', 'class', 'blue_box_2 step_box selected', { timeout: 10000 });
        //Filling Calculator
        cy.get('div[id="calculator"]').find('#our_price').type('50', { force: true });
        cy.get('div[id="calculator"]').find('input[type="checkbox"]').first().click({ force: true }).should('be.checked');
        cy.get('div[id="calculator"]').find('#weight').type('10', { force: true });//weight
        cy.get('div[id="calculator"]').find('#length').type('130', { force: true });//length
        cy.get('div[id="calculator"]').find('#width').type('10', { force: true });//width
        cy.get('div[id="calculator"]').find('#height').type('10', { force: true });//height
        cy.get('div[id="calculator"]').find('#button-calculate').click({ force: true });

        //Check result
        let taxesAndShipping = 0;
        let totalTax = 0;
        let productPrice = 0;

        cy.get('div[id="calculator-results"]')
            .find('span')
            .should('have.length.greaterThan', 0)
            .each(($span, index, $list) => {
                const text = $span.text().trim();
                const spanStyle = $span.attr('style') || '';
                const isLineThrough = spanStyle.includes('line-through');


                //Checks if Special tax included
                if (index === $list.length - 5) {
                    expect(text).to.include('משקל חריג');
                    cy.log('Special tax was included Successfully')
                }

                // Match numeric values and ignore other text
                const priceMatch = text.match(/[\d,.]+/);
                //cy.log('priceMatch is ', priceMatch);

                if (priceMatch && priceMatch[0]) {
                    const price = parseFloat(priceMatch[0].replace('$', '').trim());
                    cy.log('price is ', price);
                    //cy.log('index is ', index)
                    //Saves product price
                    if (index == 3) {
                        productPrice = price;
                    }

                    // Sums all taxes and shipping  
                    if (
                        text.includes('$') &&
                        spanStyle.includes('float:left') &&
                        (spanStyle.includes('font-size:15px') || spanStyle.includes('font-size:20px')) &&
                        !isLineThrough &&
                        index < $list.length - 4 //Exclude Total Tax span
                    ) {
                        taxesAndShipping = Number((taxesAndShipping + price).toFixed(2));;
                        cy.log('Sum of taxes and shipping is: ', taxesAndShipping);
                    }

                    //Checks if Special tax included
                    if (index === $list.length - 5) {
                        expect(text).to.include('משקל חריג');
                    }

                    // Capture and validate the sum of tax at the correct index
                    if (index === $list.length - 4) {
                        totalTax = price;
                        cy.log('Total price for taxes:', totalTax);

                        // Self-check if all tax and shipping costs match the shown price
                        cy.wrap(null).then(() => {
                            expect(Number((taxesAndShipping - productPrice).toFixed(2))).to.eq(Number(totalTax.toFixed(2)));
                            cy.log('Total Sum Check Passed');
                        });
                    }

                    // Capture and validate the final price at the correct index
                    if (index === $list.length - 2) {
                        const finalPrice = price;
                        cy.log('Final Price Span:', finalPrice);

                        // Perform the final assertion
                        cy.wrap(null).then(() => {
                            expect(Number(taxesAndShipping.toFixed(2))).to.eq(Number(finalPrice.toFixed(2)));
                            cy.log('Final Price Check Passed');
                        });
                    }
                }
            });

    });

    it('Calculate clothing category- Special delivery tax 50$ ( 20kg - 50kg )', () => {

        //Clothing
        cy.get('#main-category').find('div[onclick="getSubCategories(\'28\')"]').click({ force: true });
        //Underwear
        cy.get('div[id="sub-category"]').find('div[onclick="getCalculator(\'30\',\'28\')"] >div').click({ force: true }).should('have.attr', 'class', 'blue_box_2 step_box selected', { timeout: 10000 });
        //Filling Calculator
        cy.get('div[id="calculator"]').find('#our_price').type('50', { force: true });
        cy.get('div[id="calculator"]').find('input[type="checkbox"]').first().click({ force: true }).should('be.checked');
        cy.get('div[id="calculator"]').find('#weight').type('40', { force: true });//weight
        cy.get('div[id="calculator"]').find('#length').type('10', { force: true });//length
        cy.get('div[id="calculator"]').find('#width').type('10', { force: true });//width
        cy.get('div[id="calculator"]').find('#height').type('10', { force: true });//height
        cy.get('div[id="calculator"]').find('#button-calculate').click({ force: true });

        //Check result
        let taxesAndShipping = 0;
        let totalTax = 0;
        let productPrice = 0;

        cy.get('div[id="calculator-results"]')
            .find('span')
            .should('have.length.greaterThan', 0)
            .each(($span, index, $list) => {
                const text = $span.text().trim();
                const spanStyle = $span.attr('style') || '';
                const isLineThrough = spanStyle.includes('line-through');

                //Checks if Special tax included
                if (index === $list.length - 5) {
                    expect(text).to.include('משקל חריג');
                    cy.log('Special tax was included Successfully')
                }
                // Match numeric values and ignore other text
                const priceMatch = text.match(/[\d,.]+/);
                //cy.log('priceMatch is ', priceMatch);

                if (priceMatch && priceMatch[0]) {
                    const price = parseFloat(priceMatch[0].replace('$', '').trim());
                    cy.log('price is ', price);
                    //cy.log('index is ', index)
                    //Saves product price
                    if (index == 3) {
                        productPrice = price;
                    }

                    // Sums all taxes and shipping  
                    if (
                        text.includes('$') &&
                        spanStyle.includes('float:left') &&
                        (spanStyle.includes('font-size:15px') || spanStyle.includes('font-size:20px')) &&
                        !isLineThrough &&
                        index < $list.length - 4 //Exclude Total Tax span
                    ) {
                        taxesAndShipping = Number((taxesAndShipping + price).toFixed(2));;
                        cy.log('Sum of taxes and shipping is: ', taxesAndShipping);
                    }

                    // Capture and validate the sum of tax at the correct index
                    if (index === $list.length - 4) {
                        totalTax = price;
                        cy.log('Total price for taxes:', totalTax);

                        // Self-check if all tax and shipping costs match the shown price
                        cy.wrap(null).then(() => {
                            expect(Number((taxesAndShipping - productPrice).toFixed(2))).to.eq(Number(totalTax.toFixed(2)));
                            cy.log('Total Sum Check Passed');
                        });
                    }

                    // Capture and validate the final price at the correct index
                    if (index === $list.length - 2) {
                        const finalPrice = price;
                        cy.log('Final Price Span:', finalPrice);

                        // Perform the final assertion
                        cy.wrap(null).then(() => {
                            expect(Number(taxesAndShipping.toFixed(2))).to.eq(Number(finalPrice.toFixed(2)));
                            cy.log('Final Price Check Passed');
                        });
                    }
                }
            });

    });

    it('Calculate clothing category- Special delivery tax 100$ ( above 50kg )', () => {

        //Clothing
        cy.get('#main-category').find('div[onclick="getSubCategories(\'28\')"]').click({ force: true });
        //Underwear
        cy.get('div[id="sub-category"]').find('div[onclick="getCalculator(\'30\',\'28\')"] >div').click({ force: true }).should('have.attr', 'class', 'blue_box_2 step_box selected', { timeout: 10000 });
        //Filling Calculator
        cy.get('div[id="calculator"]').find('#our_price').type('80', { force: true });
        cy.get('div[id="calculator"]').find('input[type="checkbox"]').first().click({ force: true }).should('be.checked');
        cy.get('div[id="calculator"]').find('#weight').type('60', { force: true });//weight
        cy.get('div[id="calculator"]').find('#length').type('10', { force: true });//length
        cy.get('div[id="calculator"]').find('#width').type('10', { force: true });//width
        cy.get('div[id="calculator"]').find('#height').type('10', { force: true });//height
        cy.get('div[id="calculator"]').find('#button-calculate').click({ force: true });

        //Check result
        let taxesAndShipping = 0;
        let totalTax = 0;
        let productPrice = 0;

        cy.get('div[id="calculator-results"]')
            .find('span')
            .should('have.length.greaterThan', 0)
            .each(($span, index, $list) => {
                const text = $span.text().trim();
                const spanStyle = $span.attr('style') || '';
                const isLineThrough = spanStyle.includes('line-through');

                //Checks if Special tax included
                if (index === $list.length - 5) {
                    expect(text).to.include('משקל חריג');
                    cy.log('Special tax was included Successfully');
                }
                // Match numeric values and ignore other text
                const priceMatch = text.match(/[\d,.]+/);
                //cy.log('priceMatch is ', priceMatch);
                if (priceMatch && priceMatch[0]) {
                    const price = parseFloat(priceMatch[0].replace('$', '').trim());
                    cy.log('price is ', price);
                    //cy.log('index is ', index)
                    //Saves product price
                    if (index == 3) {
                        productPrice = price;
                    }

                    // Sums all taxes and shipping  
                    if (
                        text.includes('$') &&
                        spanStyle.includes('float:left') &&
                        (spanStyle.includes('font-size:15px') || spanStyle.includes('font-size:20px')) &&
                        !isLineThrough &&
                        index < $list.length - 4 //Exclude Total Tax span
                    ) {
                        taxesAndShipping = Number((taxesAndShipping + price).toFixed(2));
                        cy.log('Sum of taxes and shipping is: ', taxesAndShipping);
                    }

                    // Capture and validate the sum of tax at the correct index
                    if (index === $list.length - 4) {
                        totalTax = price;
                        cy.log('Total price for taxes:', totalTax);

                        // Self-check if all tax and shipping costs match the shown price
                        cy.wrap(null).then(() => {
                            expect(Number((taxesAndShipping - productPrice).toFixed(2))).to.eq(Number(totalTax.toFixed(2)));
                            cy.log('Total Sum Check Passed');
                        });
                    }

                    // Capture and validate the final price at the correct index
                    if (index === $list.length - 2) {
                        const finalPrice = price;
                        cy.log('Final Price Span:', finalPrice);

                        // Perform the final assertion
                        cy.wrap(null).then(() => {
                            expect(Number(taxesAndShipping.toFixed(2))).to.eq(Number(finalPrice.toFixed(2)));
                            cy.log('Final Price Check Passed');
                        });
                    }
                }
            });

    });

    it.only('Calculate clothing category- Maximum spec', () => {

        //Clothing
        cy.get('#main-category').find('div[onclick="getSubCategories(\'28\')"]').click({ force: true });
        //Underwear
        cy.get('div[id="sub-category"]').find('div[onclick="getCalculator(\'30\',\'28\')"] >div').click({ force: true }).should('have.attr', 'class', 'blue_box_2 step_box selected', { timeout: 10000 });
        //Filling Calculator
        cy.get('div[id="calculator"]').find('#our_price').type('1000000', { force: true });
        cy.get('div[id="calculator"]').find('input[type="checkbox"]').first().click({ force: true }).should('be.checked');
        cy.get('div[id="calculator"]').find('#weight').type('100', { force: true });//weight
        cy.get('div[id="calculator"]').find('#length').type('100', { force: true });//length
        cy.get('div[id="calculator"]').find('#width').type('100', { force: true });//width
        cy.get('div[id="calculator"]').find('#height').type('100', { force: true });//height
        cy.get('div[id="calculator"]').find('#button-calculate').click({ force: true });

        //Check result
        let taxesAndShipping = 0;
        let totalTax = 0;
        let productPrice = 0;

        cy.get('div[id="calculator-results"]')
            .find('span')
            .should('have.length.greaterThan', 0)
            .each(($span, index, $list) => {
                const text = $span.text().trim();
                const spanStyle = $span.attr('style') || '';
                const isLineThrough = spanStyle.includes('line-through');

                //Checks if Special delivery tax included
                if (index === $list.length - 5) {
                    expect(text).to.include('משקל חריג');
                    cy.log('Special delivery tax was included Successfully');
                }
                //Checks if VAT tax included
                if (index === 8) {
                    expect(text).to.include('מיסים בישראל');
                    cy.log('VAT tax was included Successfully');
                }


                // Match numeric values and ignore other text
                const priceMatch = text.match(/[\d,.]+/);
                //cy.log('priceMatch is ', priceMatch);
                if (priceMatch && priceMatch[0]) {
                    const price = parseFloat(priceMatch[0].replace('$', '').trim());
                    cy.log('price is ', price);
                    //cy.log('index is ', index)
                    //Saves product price
                    if (index == 3) {
                        productPrice = price;
                    }

                    // Sums all taxes and shipping  
                    if (
                        text.includes('$') &&
                        spanStyle.includes('float:left') &&
                        (spanStyle.includes('font-size:15px') || spanStyle.includes('font-size:20px')) &&
                        !isLineThrough &&
                        index < $list.length - 4 //Exclude Total Tax span
                    ) {
                        taxesAndShipping = Number((taxesAndShipping + price).toFixed(2));
                        cy.log('Sum of taxes and shipping is: ', taxesAndShipping);
                    }

                    // Capture and validate the sum of tax at the correct index
                    if (index === $list.length - 4) {
                        totalTax = price;
                        cy.log('Total price for taxes:', totalTax);

                        // Self-check if all tax and shipping costs match the shown price
                        cy.wrap(null).then(() => {
                            expect(Number((taxesAndShipping - productPrice).toFixed(2))).to.be.closeTo(Number(totalTax.toFixed(2)), 30);
                            cy.log('Total Sum Check Passed');
                        });
                    }

                    // Capture and validate the final price at the correct index
                    if (index === $list.length - 2) {
                        const finalPrice = price;
                        cy.log('Final Price Span:', finalPrice);

                        // Perform the final assertion
                        cy.wrap(null).then(() => {
                            expect(Number(taxesAndShipping.toFixed(2))).to.be.closeTo(Number(finalPrice.toFixed(2)), 30);
                            cy.log('Final Price Check Passed');
                        });
                    }
                }
            });

    });

    it('Calculate clothing category- Error message - Not Shippable', () => {

        //Clothing
        cy.get('#main-category').find('div[onclick="getSubCategories(\'28\')"]').click({ force: true });
        //Underwear
        cy.get('div[id="sub-category"]').find('div[onclick="getCalculator(\'30\',\'28\')"] >div').click({ force: true }).should('have.attr', 'class', 'blue_box_2 step_box selected', { timeout: 10000 });
        //Filling Calculator
        cy.get('div[id="calculator"]').find('#our_price').type('80', { force: true });
        cy.get('div[id="calculator"]').find('input[type="checkbox"]').first().click({ force: true }).should('be.checked');
        cy.get('div[id="calculator"]').find('#weight').type('600', { force: true });//weight
        cy.get('div[id="calculator"]').find('#length').type('200', { force: true });//length
        cy.get('div[id="calculator"]').find('#width').type('200', { force: true });//width
        cy.get('div[id="calculator"]').find('#height').type('200', { force: true });//height
        cy.get('div[id="calculator"]').find('#button-calculate').click({ force: true });
        //Check result
        cy.get('div[id="calculator"]').find('#error_msg').should('be.visible', { timeout: 10000 });




    });
});

