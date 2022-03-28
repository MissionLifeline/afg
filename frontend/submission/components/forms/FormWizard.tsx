import {JsonFormsCore} from '@jsonforms/core'
import {LockOpen} from '@mui/icons-material'
import {Button, Divider} from '@mui/material'
import log from 'loglevel'
import React, {useCallback, useEffect, useState} from 'react'

import {useGet_KeysQuery} from '../../api/generates'
import {steps} from '../../schema'
import {useArmoredDatastore, useWizardState} from '../../state'
import LocalizedJsonForms from './LocalizedJsonForms'

type FormWizardProps = Record<string, never>

export const FormWizard = ({}: FormWizardProps) => {
  const { currentStep } = useWizardState()
  const { setSerializedPubKeys, pubKeys, encryptedFormData } = useArmoredDatastore()
  const [allFormsState, setAllFormsState] = useState<{[k: string]:  any}>({})

  const { data } = useGet_KeysQuery({token: 'exampleToken'})

  useEffect(() => {
    if(!data) return
    const { get_keys: fetchedPubKeys } =  data
    log.debug({fetchedPubKeys})
    setSerializedPubKeys(fetchedPubKeys)
  }, [data, setSerializedPubKeys])


  const { setFormData } = useArmoredDatastore()

  useEffect(() => {
    log.debug({encryptedFormData})
  }, [encryptedFormData])


  const handleFormChange = useCallback(
    (name: string, state: Pick<JsonFormsCore, 'data' | 'errors'> ) => {
      setAllFormsState(prev => ({
        ...prev,
        [name]: state.data
      }))
    }, [setAllFormsState])

  const handleEncryptAndSend = useCallback(
    () => {
      if(pubKeys.length <= 0) return
      setFormData(allFormsState)
    },
    [pubKeys, allFormsState, setFormData])

  return <>
    {[steps[currentStep]]
      .map(({name, jsonschema, uiSchema }) => (
        <LocalizedJsonForms
          key={name}
          name={name}
          schema={jsonschema}
          uischema={uiSchema}
          onChange={(state) => handleFormChange(name, state)}
          data={allFormsState[name] || {}}
        />)) }
    <Divider style={{margin: '1em'}} />
    <Button startIcon={<LockOpen />} variant={'contained'} onClick={handleEncryptAndSend} >encrypt & send</Button>
  </>
}

