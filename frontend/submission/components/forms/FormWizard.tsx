import {JsonFormsCore} from '@jsonforms/core'
import {LockOpen} from '@mui/icons-material'
import {Button, Divider} from '@mui/material'
import React, {useCallback, useState} from 'react'

import {steps} from '../../schema'
import {useArmoredDatastore, useWizardState} from '../../state'
import LocalizedJsonForms from './LocalizedJsonForms'

type FormWizardProps = Record<string, never>

export const FormWizard = ({}: FormWizardProps) => {
  const { currentStep } = useWizardState()
  const [allFormsState, setAllFormsState] = useState<{[k: string]:  any}>({})


  const { setFormData } = useArmoredDatastore()

  const handleFormChange = useCallback(
    (name: string, state: Pick<JsonFormsCore, 'data' | 'errors'> ) => {
      setAllFormsState(prev => ({
        ...prev,
        [name]: state.data
      }))
    },
    [setAllFormsState],)

  const handleEncryptAndSend = () => {
    setFormData(allFormsState)
  }

  return <>
    {steps
      .map(({name, jsonschema, uiSchema }) => (
        <LocalizedJsonForms
          key={name}
          name={name}
          schema={jsonschema}
          uischema={uiSchema}
          onChange={(state) => handleFormChange(name, state)}
          data={allFormsState[name] || {}}
        />))[currentStep] || null }
    <Divider style={{margin: '1em'}} />
    <Button startIcon={<LockOpen />} variant={'contained'} onClick={handleEncryptAndSend} >encrypt & send</Button>
  </>
}

