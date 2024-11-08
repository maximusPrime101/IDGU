/// <reference types="cypress" />


describe('Sign up to the website', () => {
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

    it('Calculate clothing category- minimal specs', () => {

        //Clothing
        cy.get('#main-category').find('div[onclick="getSubCategories(\'28\')"]').click({ force: true });
        //Underwear
        cy.get('div[id="sub-category"]').find('div[onclick="getCalculator(\'30\',\'28\')"] >div').click({ force: true }).should('have.attr', 'class', 'blue_box_2 step_box selected', { timeout: 10000 });
        //Filling Calculator
        cy.get('div[id="calculator"]').find('#our_price').type('50', { force: true });
        cy.get('div[id="calculator"]').find('input[type="checkbox"]').first().click({ force: true }).should('be.checked');
        cy.get('div[id="calculator"]').find('#weight').type('1', { force: true });
        cy.get('div[id="calculator"]').find('#length').type('10', { force: true });
        cy.get('div[id="calculator"]').find('#width').type('10', { force: true });
        cy.get('div[id="calculator"]').find('#height').type('10', { force: true });
        cy.get('div[id="calculator"]').find('#button-calculate').click({ force: true });
        //Check result
        //cy.get('div[id="calculator-results"]').find('#length').type('10', { force: true });
        /*
                // Perform calculation and verify prices
                let totalSum = 0;
                cy.get('div[id="calculator-results"]')
                    .find('span')
                    .should('have.length.greaterThan', 0)
                    .each(($span, index, $list) => {
                        const text = $span.text().trim();
                        const spanStyle = $span.attr('style') || '';
                        const isLineThrough = spanStyle.includes('line-through'); // Check for line-through
                        cy.log(spanStyle);
                        cy.log(text);
                        // Only add price to the sum if it includes '$', is not line-through, and has float:left
                        //      if (text.includes('$') && !isLineThrough && spanStyle.includes('float:left')) {
                        if (text.includes(' $') && spanStyle.includes('float:left') && spanStyle.includes('font-size:15px')) {
                            const price = parseFloat(text.replace('$', '').trim());
                            if (isLineThrough == false) {
                                totalSum += price;
                                cy.log('total Sum: ', totalSum)
                                cy.log('index:', index);
                                cy.log('$list.length - 1:', $list.length - 1);
                                if (index === $list.length - 1) {
                                    const finalPrice = price;
                                    expect(totalSum).to.eq(finalPrice);
                                    cy.log('finnish2')
                                }
                            }
                        }
                    });
                    */

        let totalSum = 0;

        cy.get('div[id="calculator-results"]')
            .find('span')
            .should('have.length.greaterThan', 0)
            .each(($span, index, $list) => {
                const text = $span.text().trim();
                const spanStyle = $span.attr('style') || '';
                const isLineThrough = spanStyle.includes('line-through'); // Check for line-through

                cy.log('spanStyle:', spanStyle);  // Log the style of each span
                cy.log('text:', text);  // Log the text of the span

                // Check if text contains a valid number (ignoring non-numeric characters)
                const priceMatch = text.match(/[\d,.]+/);  // Match numeric values with commas or dots
                if (priceMatch && priceMatch[0]) {
                    // Price is a valid number, now check for the conditions
                    const price = parseFloat(priceMatch[0].replace('$', '').trim());

                    // Ensure it's a valid price and the style matches what you need
                    if (text.includes(' $') && spanStyle.includes('float:left') && spanStyle.includes('font-size:15px') && !isLineThrough) {
                        totalSum += price;
                        cy.log('total Sum: ', totalSum);
                        cy.log('index:', index);
                        cy.log('$list.length - 1:', $list.length - 1);

                        // Check if it's the last element and perform the final assertion
                        if (index === $list.length - 1) {
                            const finalPrice = price;
                            expect(totalSum).to.eq(finalPrice);
                            cy.log('finished2');
                        }
                    }
                } else {
                    cy.log('Skipping non-numeric span:', text); // Skip spans that don't have numeric values
                }
            });

    });



    it.skip('Enter Address Details', () => {
        cy.get('#input-address-1').type('Netzach Yisrael 6', { force: true });
        cy.get('input[name="city"]').type('Sderot', { force: true });
        cy.get('input[name="postcode"]').type('8707795', { force: true });
    });

    it.skip('Set Password and Agreement', () => {
        cy.get('#input-password').type('12345678', { force: true });
        cy.get('#input-confirm').type('12345678', { force: true });
        cy.get('.radio-inline [value="0"]').click();
        cy.get('input[name="agree"]').click();
        cy.wait(4000);
        cy.get('input[type="submit"]').click({ force: true });
    });
});
