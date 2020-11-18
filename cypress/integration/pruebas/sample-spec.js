describe("Pagina principal",
  () => {
    it("ir a la pagina principal", () => {
      cy.visit("/")
    })
  })


  describe('La pagina de login', () => {
    context('Startup', () => {
      beforeEach(() => {
        cy.visit('/employees/login');
      });
    
      it('loggearse', () => {
       
        // Fill the username
        cy.get('input[name="email"]')
          .type('nfigueroasan@gmail.com')
          .should('have.value', 'nfigueroasan@gmail.com');
    
        // Fill the password
        cy.get('input[name="password"]')
          .type('1234')
          .should('have.value', '1234');
    
        // Locate and submit the form
        cy.get('login-form').submit();
        
        cy.url().should('include', '/animals');

      });
    })
  })