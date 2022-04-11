import {JsonFormsCore} from '@jsonforms/core'
import {Box} from '@mui/system'
import log from 'loglevel'
import {useRouter} from 'next/router'
import React, {useCallback, useEffect} from 'react'
import { useTranslation } from 'react-i18next'

import {useGet_KeysQuery} from '../../api/generates'
import {steps, WizardOverride} from '../../schema'
import {useArmoredDatastore, useTokenStore, useWizardQueryState} from '../../state'
import FinalControlStep from './FinalControlStep'
import LocalizedJsonForms from './LocalizedJsonForms'
import WelcomeStep from './WelcomeStep'

type FormWizardProps = Record<string, never>

export const FormWizard = ({}: FormWizardProps) => {
  const { t } = useTranslation()
  const {currentStep} = useWizardQueryState()
  const {setSerializedPubKeys, formData, setFormData} = useArmoredDatastore()
  const { replace } = useRouter()

  const {token, getSetUserId} = useTokenStore()
  const userId = getSetUserId()
  const {data} = useGet_KeysQuery({token: token || '', userId},
    {
      enabled: Boolean(token && userId),
      staleTime: 60 * 60 * 1000
    })

  useEffect(() => {
    if (!token) {
      log.error('token is missing')
      replace(`/token_invalid`)
    }

    if (!data) return
    const {errors, tokenValid, pubKeys} = data.get_keys
    if (!tokenValid) {
      log.error('token or userId is not valid')
      replace(`/token_invalid?token=${token}`)
    }
    if (errors && tokenValid) throw Error(errors)
    setSerializedPubKeys(pubKeys)
  }, [data, setSerializedPubKeys, token, replace])

  const handleFormChange = useCallback(
    (name: string, state: Pick<JsonFormsCore, 'data' | 'errors'>) => {
      setFormData(name, state.data)
    }, [setFormData])

  return <Box style={{marginTop: '1em', marginBottom: '1em'}}>{!data?.get_keys.tokenValid ?
    <p>{t('invalid_token')}</p> : <>
      {[steps[currentStep]].map(({name, jsonschema, uiSchema, override}) => {
        switch (override) {
          case WizardOverride.WELCOME:
            return <WelcomeStep/>
          case WizardOverride.FINAL:
            return <FinalControlStep/>
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

