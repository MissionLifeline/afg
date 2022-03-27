import React from 'react'

import {steps} from '../../schema'
import {useWizardState} from '../../state'
import LocalizedJsonForms from './LocalizedJsonForms'

type FormWizardProps = Record<string, never>

export const FormWizard = ({}: FormWizardProps) => {
  const { currentStep } = useWizardState()


  return <>
    {steps
      .map(({name, jsonschema, uiSchema }) => (
        <LocalizedJsonForms
          key={name}
          name={name}
          data={{}}
          schema={jsonschema}
          uischema={uiSchema} />))[currentStep] || null }
  </>
}

