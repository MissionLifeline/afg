const gotoNextPage = () => {
  // wait for {formData} to hit the state
  cy.wait(300)

  cy.get('button[title="proceed to next step"]').click()
}

describe('Minimal test, to check the setup before testing details', () => {
  it('Click through wizard and fill some of the forms', () => {
    cy.visit('/?token=demoToken')
    cy.log('In case of a dev build it might take some time to jit compile…')
    cy.log('The next test might fail, when the id is taken by another property with the same name. This sometimes happens with the combination of jsonforms and next dev builds.')
    cy.get('[data-testid="SendIcon"]').click()
    gotoNextPage()
    /** TODO We need proper test selectors from jsonforms inputs.
     *  - selectors should be stable in next dev builds
     *  - selectors should be uniq when properties are reused at different places or we always need select the parent component (form) first
     **/
    cy.get('input[id="#/properties/passportExisting-input"]', {timeout: 30000})
      .click()
    cy.wait(300)
    cy.get('input[id="passportAttachment-file-input"]', {timeout: 30000})
      .attachFile('passport.jpg')
    cy.get('input[id="#/properties/tazkiraExisting-input"]', {timeout: 30000})
      .click()
    cy.wait(300)
    cy.get('input[id="tazkiraAttachment-file-input"]', {timeout: 30000})
      .attachFile('tazkira.jpg')
    cy.wait(300)

    cy.get('input[id="attachment-description-tazkira.jpg"]', {timeout: 30000})
      .type('This is my Tazkira')
    cy.wait(300)

    gotoNextPage()
    cy.get('textarea[id="#/properties/risksCV-input"]')
      .type('risks…')
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
    // TODO we should use a separate keyring
    let formData
    cy.exec('(cd ../../backend/data/upload/demoToken/; gpg --decrypt --passphrase "test" "$(ls -t formData* | head -n1)")')
      .then($result => {
	const formData_ = JSON.parse($result.stdout)
        formData = formData_
        expect(formData).to.have.any.keys('general')
        expect(formData.general).to.have.any.keys('passportAttachment')
        expect(formData.general.passportAttachment.uploadStatus).to.equal(200)
        expect(formData.general.passportAttachment.fileType).to.equal('image/jpeg')
        expect(formData.general).to.have.any.keys('tazkiraAttachment')
        expect(formData.general.tazkiraAttachment.uploadStatus).to.equal(200)
        expect(formData.general.tazkiraAttachment.fileType).to.equal('image/jpeg')
        expect(formData.general.tazkiraAttachment.description).to.equal('This is my Tazkira')
        expect(formData).to.have.any.keys('risks')
        expect(formData.risks).to.have.any.keys('risksCV')
        expect(formData.risks.risksCV).to.equal('risks…')
      }).then(() =>
        cy.exec(`(cd ../../backend/data/upload/demoToken/; gpg --decrypt --passphrase "test" attachment_${formData.general.passportAttachment.id}_*.gpg) | cmp - cypress/fixtures/passport.jpg`)
      ).then(() =>
        cy.exec(`(cd ../../backend/data/upload/demoToken/; gpg --decrypt --passphrase "test" attachment_${formData.general.tazkiraAttachment.id}_*.gpg) | cmp - cypress/fixtures/tazkira.jpg`)
      )
  })
})
