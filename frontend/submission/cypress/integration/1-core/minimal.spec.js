describe('Minimal test before testing details', () => {
  it('Click through wizard and submit the form', () => {
    cy.visit('/?token=demoToken')
    cy.log('In case of a dev build it might take some time to jit compile…')
    // TODO can we change the property name to something namespaced by the form?
    cy.get('input[id="#/properties/firstName2-input"]', {timeout: 30000})
      .type('Max')

    cy.log('Visit wizards last form step before submission')
    cy.visit('/?token=demoToken&step=3')
    cy.get('button[title="proceed to next step"]').click()

    cy.get('main').contains('Almost done')
    // TODO we need proper selectors for the submit buttons
  })
})
