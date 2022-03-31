import {JsonFormsCore} from '@jsonforms/core'
import log from 'loglevel'
import React, {useCallback, useEffect, useState} from 'react'

import {useGet_KeysQuery} from '../../api/generates'
import {steps} from '../../schema'
import {useArmoredDatastore, useTokenStore, useWizardState} from '../../state'
import FinalControlStep from './FinalControlStep'
import LocalizedJsonForms from './LocalizedJsonForms'

type FormWizardProps = Record<string, never>

export const FormWizard = ({}: FormWizardProps) => {
  const {currentStep} = useWizardState()
  const {setSerializedPubKeys, pubKeys, formData} = useArmoredDatastore()
  const [allFormsState, setAllFormsState] = useState<{ [k: string]: any }>({})

  const {token, getSetUserId} = useTokenStore()
  const userId = getSetUserId()
  const {data} = useGet_KeysQuery({token: token || '', userId},
    {
      enabled: Boolean(token && userId),
      staleTime: 60 * 60 * 1000
    })

  useEffect(() => {
    if (!data) return
    const {errors, tokenValid, pubKeys} = data.get_keys
    if (!tokenValid) console.error('token or userId is not valid')
    if (errors && tokenValid) throw Error(errors)
    log.debug({pubKeys})
    setSerializedPubKeys(pubKeys)
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
      setFormData(allFormsState)
    }, [setAllFormsState, pubKeys, allFormsState, setFormData])

  return !data?.get_keys.tokenValid ? 'TODO: show nice component when combination of token+userId is invalid' : <>
    {[steps[currentStep]]
      .map(({name, jsonschema, uiSchema, finalStep}) => <>
        {!finalStep
          ? <LocalizedJsonForms
            key={name}
            name={name}
            schema={jsonschema}
            uischema={uiSchema}
            onChange={(state) => handleFormChange(name, state)}
            data={allFormsState[name] || {}}
            validationMode={'ValidateAndShow'}
          />
          : <FinalControlStep/>}
      </>)}
  </>
}

