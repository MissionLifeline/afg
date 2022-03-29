import {JsonFormsCore} from '@jsonforms/core'
import {Check,Lock, LockOpen} from '@mui/icons-material'
import {Box, Button, Divider} from '@mui/material'
import log from 'loglevel'
import React, {useCallback, useEffect, useState} from 'react'

import {useGet_KeysQuery} from '../../api/generates'
import {steps} from '../../schema'
import {useArmoredDatastore, useWizardState} from '../../state'
import LocalizedJsonForms from './LocalizedJsonForms'
import SubmitFormButton from './SubmitFormButton'

type FormWizardProps = Record<string, never>

export const FormWizard = ({}: FormWizardProps) => {
  const {currentStep} = useWizardState()
  const {setSerializedPubKeys, pubKeys, encryptedFormData} = useArmoredDatastore()
  const [allFormsState, setAllFormsState] = useState<{ [k: string]: any }>({})
  const [encrypted, setEncrypted] = useState(false)

  const {data} = useGet_KeysQuery({token: 'exampleToken'})


  useEffect(() => {
    if (!data) return
    const {get_keys: fetchedPubKeys} = data
    log.debug({fetchedPubKeys})
    setSerializedPubKeys(fetchedPubKeys)
  }, [data, setSerializedPubKeys])


  const {setFormData} = useArmoredDatastore()

  useEffect(() => {
    log.debug({encryptedFormData})
  }, [encryptedFormData])


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
      setEncrypted(true)
    },
    [pubKeys, allFormsState, setFormData])

  useEffect(() => {
    setEncrypted(false)
  }, [allFormsState, setEncrypted])


  return <>
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
    <Divider style={{margin: '1em'}}/>
    <Box display='flex' flexDirection='row'>
      <Button startIcon={encrypted ? <Lock /> :  <LockOpen/>} endIcon={encrypted ? <Check /> : undefined} variant={'contained'} onClick={handleEncryptAndSend}>encrypt</Button>
      <SubmitFormButton />
    </Box>
  </>
}

