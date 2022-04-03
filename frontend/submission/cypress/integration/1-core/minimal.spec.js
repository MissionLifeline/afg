describe('Minimal test, to check the setup before testing details', () => {
  it('Click through wizard and fill some of the forms', () => {
    cy.visit('/?token=demoToken')
    cy.log('In case of a dev build it might take some time to jit compile…')
    cy.log('The next test might fail, when the id is taken by another property with the same name. This sometimes happens with the combination of jsonforms and next dev builds.')
    /** TODO We need proper test selectors from jsonforms inputs.
     *  - selectors should be stable in next dev builds
     *  - selectors should be uniq when properties are reused at different places or we always need select the parent component (form) first
     **/
    cy.get('input[id="#/properties/firstName-input"]', {timeout: 30000})
      .type('Max')

    cy.get('button[title="proceed to next step"]').click()
    cy.get('textarea[id="#/properties/risksCV-input"]')
      .type('risks…')
  })

  it('Submit the formData', () => {
    // TODO we need selectors for navigating to a wizard step (without reloading the page)
    cy.get('button[title="proceed to next step"]').click()
    cy.get('button[title="proceed to next step"]').click()
    cy.get('button[title="proceed to next step"]').click()
    cy.get('main').contains('Almost done')

    cy.get('button[title="submit"]').first().click()
    cy.get('main').contains('Successfully submitted')
  })

  it('Decrypt formData', () => {
    cy.log('We expect, the test key is imported (gpg --import backend/data/keys/test.sec.gpg)')  // TODO we should use a separate keyring
    cy.exec('(cd ../../backend/data/upload/demoToken/; gpg --decrypt --passphrase "test" "$(ls -t formData* | head -n1)")')
      .then($result => {
	const formData = JSON.parse($result.stdout)
	cy.log(formData)
      })
  })
})
