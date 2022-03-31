import {
  createAjv,
  defaultErrorTranslator, ErrorTranslator, formatIs, JsonFormsI18nState,
  JsonFormsRendererRegistryEntry, or, rankWith, scopeEndIs,
  Translator, uiTypeIs
} from '@jsonforms/core'
import {materialCells, materialRenderers} from '@jsonforms/material-renderers'
import {JsonForms} from '@jsonforms/react'
import {JsonFormsInitStateProps, JsonFormsReactProps} from '@jsonforms/react/lib/JsonForms'
import {Divider} from '@mui/material'
import React, {useCallback, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'

import {formNamespace} from '../../i18n'
import {jsonSchema2TranslationJsonSchema} from '../../schema/utils'
import {LocalizedFormTranslation} from '../../schema/utils/types'
import {useTranslationState} from '../../state'
import MaterialListWithDetailRenderer from '../renderer/MaterialListWithDetailRenderer'
import UploadRenderer from '../renderer/UploadRenderer'
import FormTranslationHelper from './FormTranslationHelper'

type LocalizedJsonFormsProps = {
  name: string,
  translation?: LocalizedFormTranslation
  renderers?: JsonFormsRendererRegistryEntry[];
} & Omit<JsonFormsInitStateProps & JsonFormsReactProps, 'renderers'>

const scopesEndIs = (scopes: string[]) => or(...scopes.map(s => scopeEndIs(s)))

const defaultRenderers = [
  ...materialRenderers,
  {
    tester: rankWith(5, or(
      scopesEndIs(['fellowApplicantFamilyMembers', 'familyMembersInGermany']),
      uiTypeIs('ListWithDetail'))),
    renderer: MaterialListWithDetailRenderer
  }, {
    tester: rankWith(5, formatIs('upload')),
    renderer: UploadRenderer
  }
]


/** This is a first version of the `Part 1` of the questionnaire.
 *  See: `Online Tool Spezialfälle Vorschlag abzufragende Daten und Abfolge.docx`
 **/
const LocalizedJsonForms =
  ({
     name,
     renderers = defaultRenderers,
     data: initialData = {},
     translation = {},
     schema,
     ...props
   }: LocalizedJsonFormsProps) => {
    const [data, setData] = useState<any>(initialData)

    const {formTranslation, setFormTranslationForLang} = useTranslationState()
    const ns = formNamespace(name)

    const [currentLangData, setCurrentLangData] = useState<any>({})
    const [translationsSchema] = useState(jsonSchema2TranslationJsonSchema(schema || {}))
    const {
      t,
      i18n: {language, exists: _exists, addResourceBundle, removeResourceBundle, reloadResources}
    } = useTranslation(ns)
    const exists = useCallback((key: string) => _exists(key, {ns}), [_exists, ns])

    // @ts-ignore
    const translator = useCallback<Translator>((keyLabel, defaultMessage) =>
      exists(keyLabel) ? t(keyLabel) : (keyLabel.endsWith('error.custom') ? undefined : (defaultMessage || '')), [t, exists])
    const errorTranslator = useCallback<ErrorTranslator>((error, _1, uischema) =>
      defaultErrorTranslator(error, (k) => t(k, t(`common:error.${error.keyword}`, error.message)), uischema), [t])
    const [jsonFormsI18nState, setJsonFormsI18nState] = useState<JsonFormsI18nState>({
      locale: language,
      translate: translator,
      translateError: errorTranslator
    })
    const [ajv] = useState(createAjv({
      allErrors: true,
      verbose: true,
    }))

    useEffect(() => {
      setJsonFormsI18nState({
        locale: '',
        translate: translator,
        translateError: errorTranslator
      })
      const timeout = setTimeout(() =>
        setJsonFormsI18nState({
          locale: language,
          translate: translator,
          translateError: errorTranslator
        }), 100)
      return () => clearTimeout(timeout)
    }, [language, currentLangData, translator, errorTranslator, setJsonFormsI18nState])


    useEffect(() => {
      setCurrentLangData(formTranslation[name]?.[language] || {})
    }, [formTranslation, language, name, setCurrentLangData])


    useEffect(() => {
      if (!currentLangData) return
      removeResourceBundle(language, ns)
      addResourceBundle(language, ns, currentLangData, undefined, true)
      reloadResources(language, ns)

    }, [currentLangData, language, ns, addResourceBundle, removeResourceBundle, reloadResources])


    return (
      <>
        <JsonForms
          schema={schema}
          data={data}
          i18n={jsonFormsI18nState}
          renderers={renderers}
          cells={materialCells}
          onChange={({data}) => setData(data)}
          ajv={ajv}
          {...props}
        />
        <Divider style={{marginTop: '2em', marginBottom: '2em'}}/>
        {<FormTranslationHelper
          name={name}
          language={language}
          schema={translationsSchema}
          translationData={formTranslation[name]?.[language] || {}}
          onTranslationChange={({data}) => setFormTranslationForLang(name, language, data)}
        />}

      </>
    )
  }

export default LocalizedJsonForms
