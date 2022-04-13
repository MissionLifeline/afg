const gotoNextPage = () => {
  // wait for {formData} to hit the state
  cy.wait(300)

  cy.get('button[title="proceed to next step"]').click()
}

describe('Minimal test, to check the setup before testing details', () => {
  it('Attach passport and tazkira', () => {
    cy.visit('/?token=demoToken')
    cy.get('input[id="#/properties/passport-file-input"]', {timeout: 30000})
      .attachFile('passport.jpg')
    cy.get('input[id="#/properties/tazkira-file-input"]', {timeout: 30000})
      .attachFile('tazkira.jpg')
    cy.wait(300)

    gotoNextPage()
  })

  it('Submit the formData', () => {
    // TODO we need selectors for navigating to a wizard step (without reloading the page)
    gotoNextPage()
    gotoNextPage()
    gotoNextPage()
    gotoNextPage()
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
        expect(formData).to.have.any.keys('general')
        expect(formData.general).to.have.any.keys('firstName')
        expect(formData.general.firstName).to.equal('Max')
        expect(formData.general).to.have.any.keys('lastName')
        expect(formData.general.lastName).to.equal('Mustermann')
        expect(formData).to.have.any.keys('risks')
        expect(formData.risks).to.have.any.keys('risksCV')
        expect(formData.risks.risksCV).to.equal('risks…')
      })
    cy.exec('(cd ../../backend/data/upload/demoToken/; ls -lct)")')
      .then($result => {
	  cy.log($result.stdout)
          expect('').to.equal('fnord')
      })
  })
})
