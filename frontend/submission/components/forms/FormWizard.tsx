import {JsonFormsCore} from '@jsonforms/core'
import {Box, Button, Divider} from '@mui/material'
import log from 'loglevel'
import React, {useCallback, useEffect, useState} from 'react'

import {useGet_KeysQuery} from '../../api/generates'
import {steps} from '../../schema'
import {useArmoredDatastore, useWizardState} from '../../state'
import AddAttachmentButton from './AddAttachmentButton'
import AttachmentsList from './AttachmentsList'
import LocalizedJsonForms from './LocalizedJsonForms'
import SubmitFormButton from './SubmitFormButton'

type FormWizardProps = Record<string, never>

export const FormWizard = ({}: FormWizardProps) => {
  const {currentStep, nextStep, prevStep} = useWizardState()
  const {setSerializedPubKeys, pubKeys, formData} = useArmoredDatastore()
  const [allFormsState, setAllFormsState] = useState<{ [k: string]: any }>({})

  const {data} = useGet_KeysQuery({token: 'exampleToken'})


  useEffect(() => {
    if (!data) return
    const {get_keys: fetchedPubKeys} = data
    log.debug({fetchedPubKeys})
    setSerializedPubKeys(fetchedPubKeys)
  }, [data, setSerializedPubKeys])


  const {setFormData} = useArmoredDatastore()

  useEffect(() => {
    log.debug({formData})
  }, [formData])


  const handleFormChange = useCallback(
    (name: string, state: Pick<JsonFormsCore, 'data' | 'errors'>) => {
      setAllFormsState(prev => ({
        ...prev,
        [name]: state.data
      }))
    }, [setAllFormsState])

  const handleEncryptAndSend = useCallback(
    () => {
      if (pubKeys.length <= 0) return
      setFormData(allFormsState)
    },
    [pubKeys, allFormsState, setFormData])

  return <>
    { currentStep > 0 ?
      <Button variant='contained' color='secondary' onClick={prevStep}>Back</Button> :
      ''
    }
    {[steps[currentStep]]
      .map(({name, jsonschema, uiSchema}) => (
        <LocalizedJsonForms
          key={name}
          name={name}
          schema={jsonschema}
          uischema={uiSchema}
          onChange={(state) => handleFormChange(name, state)}
          data={allFormsState[name] || {}}
          validationMode={'ValidateAndShow'}
        />))}
    <AddAttachmentButton/>
    <AttachmentsList/>
    <Divider style={{margin: '1em'}}/>
    <Box display='flex' flexDirection='row'>
      { currentStep < 3 ?
        <Button variant='contained' color='primary' onClick={nextStep}>Next</Button> :
        <SubmitFormButton />
      }
    </Box>
  </>
}

