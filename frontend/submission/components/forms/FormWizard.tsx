import {JsonFormsCore} from '@jsonforms/core'
import {Box} from '@mui/system'
import log from 'loglevel'
import {useRouter} from 'next/router'
import React, {useCallback, useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'

import {useGet_KeysQuery} from '../../api/generates'
import {steps, WizardOverride} from '../../schema'
import {useArmoredDatastore, useTokenStore, useWizardQueryState} from '../../state'
import {useUnload} from '../../utils'
import {LoadingSpinner} from '../layout'
import FinalControlStep from './FinalControlStep'
import LocalizedJsonForms from './LocalizedJsonForms'
import WelcomeStep from './WelcomeStep'

type FormWizardProps = Record<string, never>

export const FormWizard = ({}: FormWizardProps) => {
  const { t } = useTranslation()
  const {currentStep} = useWizardQueryState()
  const {setSerializedPubKeys, formData, formDataDirty, setFormData, sendFormData} = useArmoredDatastore()
  const { replace } = useRouter()
  const [loading, setLoading] = useState(true)


  const {token, getSetUserId} = useTokenStore()
  const userId = getSetUserId()
  const {data} = useGet_KeysQuery({token: token || '', userId},
    {
      enabled: Boolean(token && userId),
      staleTime: 60 * 60 * 1000
    })

  useEffect(() => {
    if( token === '') {
      log.error('token is missing')
      replace({pathname: '/token_missing', query: {token}})
      return
    }
    if (typeof token !== 'string' || !data)
      return
    const {errors, tokenValid, pubKeys} = data.get_keys
    if (!tokenValid) {
      log.error('token or userId is not valid')
      replace({pathname: '/token_invalid', query: {token}})
      return
    }
    if (errors && tokenValid) throw Error(errors)
    setLoading(false)
    setSerializedPubKeys(pubKeys)
  }, [data, setSerializedPubKeys, token, replace, setLoading])

  // send formData on when wizard page changes
  useEffect(() => {
    if (formDataDirty && token && userId) {
      sendFormData(token, userId)
    }
  }, [currentStep, sendFormData])

  const handleFormChange = useCallback(
    (name: string, state: Pick<JsonFormsCore, 'data' | 'errors'>) => {
      setFormData(name, state.data)
    }, [setFormData])

  const onUnload = useCallback(e => {
    if (formDataDirty) {
      e.preventDefault()
      // No translation required, today's browser don't show the message anymore
      // @ts-ignore
      e.returnValue = 'Sure?'
      return e.returnValue
    } else {
      // allow tab close
      // @ts-ignore
      delete e['returnValue']
    }
  }, [formDataDirty])

  useUnload(onUnload)

  return <Box style={{marginTop: '1em', marginBottom: '1em'}}>
    {loading && <LoadingSpinner loading={loading}/>}
    {!data?.get_keys.tokenValid
      ? <p>{t('invalid_token')}</p>
      : <>
      {[steps[currentStep]].map(({name, jsonschema, uiSchema, override}) => {
        switch (override) {
          case WizardOverride.WELCOME:
            return <WelcomeStep key={'welcome'}/>
          case WizardOverride.FINAL:
            return <FinalControlStep key={'final'}/>
          default:
            return <LocalizedJsonForms
              key={name}
              name={name}
              schema={jsonschema}
              uischema={uiSchema}
              onChange={(state) => handleFormChange(name, state)}
              data={formData[name] || {}}
              validationMode={'ValidateAndShow'}
            />
        }
      })}
    </>}
  </Box>
}

