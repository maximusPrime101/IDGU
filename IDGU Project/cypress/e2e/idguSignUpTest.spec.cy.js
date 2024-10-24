/// <reference types="cypress" />


describe('Sign up to the website', () => {
    beforeEach(() => {
        cy.visit('https://idgu.co.il');
        cy.wait(2000);
        cy.get('div.float-left.home-login-box span a').click();
        cy.get('#column-right div.list-group a:nth-child(2)').click({ force: true });
    });

    it('Enter Personal Details', () => {
        cy.get('.col-sm-9').find('input[name="firstname"]').type('matanel');
        cy.get('.col-sm-9').find('input[name="lastname"]').type('arman');
        cy.get('.col-sm-9').find('input[name="user_id"]').type('303030456');
        cy.get('.col-sm-9').find('input[name="email"]').type('matanel01@gmail.com');
        // cy.get('#input-ext-id').find('option').eq(3).then((option) => {
        //     cy.get('#input-ext-id').select(option.val());
        // });
        cy.get('#input-ext-id').select(3)
        cy.get('#input-telephone').type('8918186');
    });

    it('Enter Address Details', () => {
        cy.get('#input-address-1').type('Netzach Yisrael 6', { force: true });
        cy.get('input[name="city"]').type('Sderot', { force: true });
        cy.get('input[name="postcode"]').type('8707795', { force: true });
    });

    it('Set Password and Agreement', () => {
        cy.get('#input-password').type('12345678', { force: true });
        cy.get('#input-confirm').type('12345678', { force: true });
        cy.get('.radio-inline [value="0"]').click();
        cy.get('input[name="agree"]').click();
        cy.wait(4000);
        cy.get('input[type="submit"]').click({ force: true });
    });
});
