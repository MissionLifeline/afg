import {NextPage} from 'next'
import React from 'react'

import {FormWizard} from '../components/forms/FormWizard'
import {WizardStepper} from '../components/forms/WizardStepper'
import AppLayout from '../components/layout/AppLayout'
import PageFooter from '../components/layout/PageFooter'


const wizard: NextPage = () => {

  return (<AppLayout>
    <>
      <WizardStepper/>
      <FormWizard/>
      <div className={'footer'}>
        <PageFooter/>
      </div>
    </>
  </AppLayout>)
}

export default wizard
