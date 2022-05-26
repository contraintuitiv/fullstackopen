describe('Blog list', function () {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'User',
      username: 'user',
      password: 'password'
    }

    cy.request('POST', 'http://localhost:3003/api/users', user)

    cy.visit('http://localhost:3000')
  })
  it('front page can be opened', function() {
    cy.contains('login')
  })

  it('login fails', function(){
    cy.get('#username').type('user')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()
    cy.get('.error').should('contain', 'Wrong username or password')
    cy.get('html').should('not.contain', 'Logged in')
  })

  describe('when user is logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('user')
      cy.get('#password').type('password')
      cy.get('#login-button').click()
      cy.contains('Logged in')
    })

    it('a new blog can be created', function() {
      cy.contains('New Blog').click()
      cy.get('#input-title').type('Walblog')
      cy.get('#input-author').type('Hans')
      cy.get('#input-url').type('walblog.de')
      cy.contains('add').click()
    })

    it('a blog can be liked succesfully', async function(){
      cy.contains('New Blog').click()
      cy.get('#input-title').type('Walblog')
      cy.get('#input-author').type('Hans')
      cy.get('#input-url').type('walblog.de')
      cy.contains('add').click()

      const before = await cy.get('.likeCounter').invoke('text')
      cy.contains('like').click()
      cy.get('.likeCounter').should('eq', before+2)
    })

    it('a blog can be deleted', async function(){
      cy.contains('New Blog').click()
      cy.get('#input-title').type('Walblog')
      cy.get('#input-author').type('Hans')
      cy.get('#input-url').type('walblog.de')
      cy.contains('add').click()

      cy.contains('view').click()
      cy.contains('delete').click()
      cy.get('html').should('not.contain', 'Walblog')
    })

    it('blogs are ordered correctly', async function(){

      for(let i=1;i<=5;i++){
        cy.contains('New Blog').click()
        cy.get('#input-title').type('Blog '+i)
        cy.get('#input-author').type('Hans')
        cy.get('#input-url').type('walblog.de')
        cy.contains('add').click()
      }

      cy.get('.blog').eq(0).should('contain', 'The title with the most likes')
      cy.get('.blog').eq(1).should('contain', 'The title with the second most likes')

    })
  })


})