describe('basic form', () => {
  it('should work', () => {
    cy.visit('http://localhost:5200/basic');

    cy.get('input[name="textInput"]').type('text input');
    cy.get('input[name="numberInput"]').type('123');
    // cy.get('select[name="select.nested"]').type('text input');
    cy.get('input[name="radio"]').check('radioB');
    // cy.get('input[name="checkbox"]').check('checkboxC');

    cy.get('button[type="submit"]').click();

    cy.get('pre').should(($state) =>
      expect(JSON.parse($state.text())).to.be.deep.equal({
        textInput: 'text input',
        numberInput: 123,
        radio: 'radioB',
        // checkbox: ['checkboxC'],
      }),
    );
  });
});
