describe('Login de cliente', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/listpedidos/add');
  });

  it('deberia mostrar el formulario de login', () => {
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
    cy.get('button').contains('Iniciar Sesión').should('exist');
  });

  it('deberia mostrar error con credenciales invalidas', () => {
    cy.get('input[type="email"]').type('emailinvalido@test.com');
    cy.get('input[type="password"]').type('passwordincorrecto');
    cy.get('button').contains('Iniciar Sesión').click();
    cy.get('.toast-error').should('exist');
  });

  it('deberia autenticar correctamente con credenciales validas', () => {
    cy.get('input[type="email"]').type('augustopalmieri6@gmail.com');
    cy.get('input[type="password"]').type('123123');
    cy.get('button').contains('Iniciar Sesión').click();
    cy.get('.toast-success').should('exist');
  });
});