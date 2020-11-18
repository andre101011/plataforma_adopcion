describe("Pagina principal",
  () => {
    it("ir a la pagina principal", () => {
      cy.visit("/")
    })
  })


  describe('The Login Page', () => {
    beforeEach(() => {
      // reset and seed the database prior to every test
      cy.exec('npm run db:reset && npm run db:seed')
  
      // seed a user in the DB that we can control from our tests
      // assuming it generates a random password for us
      cy.request('POST', '/employees/login', { username: 'nfigueroas@gmail.com', password:'1234'})
        .its('body')
        .as('currentUser')
    })
  
    it('sets auth cookie when logging in via form submission', function () {
      // destructuring assignment of the this.currentUser object
      const { username, password } = this.currentUser
  
      cy.visit('/employees/login')
  
      cy.get('input[name=email]').type(username)
  
      // {enter} causes the form to submit
      cy.get('input[name=password]').type(`${password}{enter}`)
  
      // we should be redirected to /dashboard
      cy.url().should('include', '/animals')
  
  

    })
  })