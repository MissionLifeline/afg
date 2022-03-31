import {JsonFormsCore} from '@jsonforms/core'
import log from 'loglevel'
import React, {useCallback, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'

import {useGet_KeysQuery} from '../../api/generates'
import {steps} from '../../schema'
import {useArmoredDatastore, useWizardState} from '../../state'
import LocalizedJsonForms from './LocalizedJsonForms'

type FormWizardProps = Record<string, never>

export const FormWizard = ({}: FormWizardProps) => {
  const { currentStep } = useWizardState()
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
      setFormData(allFormsState)
    }, [setAllFormsState, pubKeys, allFormsState, setFormData])

  return <>
    {[steps[currentStep]]
      .map(({name, jsonschema, uiSchema, stepElement}) =>  <>
        {jsonschema && <LocalizedJsonForms
          key={name}
          name={name}
          schema={jsonschema}
          uischema={uiSchema}
          onChange={(state) => handleFormChange(name, state)}
          data={allFormsState[name] || {}}
          validationMode={'ValidateAndShow'}
        />}
        {stepElement && stepElement()}
      </>)}
  </>
}

