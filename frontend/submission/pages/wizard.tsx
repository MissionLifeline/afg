import {NextPage} from 'next'
import React from 'react'

import {FormWizard} from '../components/forms/FormWizard'
import {WizardStepper} from '../components/forms/WizardStepper'
import AppLayout from '../components/layout/AppLayout'


const wizard: NextPage = () => {

  return (<AppLayout>
      <>
          <WizardStepper />
          <FormWizard />
      </>
  </AppLayout>)
}

export default wizard
