import {JsonFormsRendererRegistryEntry, Translator} from '@jsonforms/core'
import {materialCells, materialRenderers} from '@jsonforms/material-renderers'
import {JsonForms} from '@jsonforms/react'
import {JsonFormsInitStateProps, JsonFormsReactProps} from '@jsonforms/react/lib/JsonForms'
import {Divider} from '@mui/material'
import log from 'loglevel'
import React, {useCallback, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'

import {formNamespace} from '../../i18n'
import {jsonSchema2TranslationJsonSchema} from '../../schema/utils'
import {LocalizedFormTranslation} from '../../schema/utils/types'
import {useTranslationState} from '../../state'
import FormTranslationHelper from './FormTranslationHelper'

type LocalizedJsonFormsProps = {
  name: string,
  translation?: LocalizedFormTranslation
  renderers?: JsonFormsRendererRegistryEntry[];
} & Omit<JsonFormsInitStateProps & JsonFormsReactProps, 'renderers'>

const defaultRenderers = [
  ...materialRenderers,
  //register custom renderers
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

    const { formTranslation , setFormTranslationForLang } = useTranslationState()

    const [currentLangData, setCurrentLangData] = useState<any>({})
    const [translationsSchema] = useState(jsonSchema2TranslationJsonSchema(schema || {}))
    const {
      t,
      i18n: {language, exists, addResourceBundle, removeResourceBundle, reloadResources}
    } = useTranslation(formNamespace(name))
    const translator = useCallback<Translator>((key, defaultMessage) => {
      const labelKey = `${key}`
      return (exists(labelKey) ? t(labelKey) : (defaultMessage && exists(defaultMessage) ? t(defaultMessage) : defaultMessage) || '')
    }, [t, exists])
    const [jsonFormsI18nState, setJsonFormsI18nState] = useState({
      locale: language,
      translate: translator
    })

    useEffect(() => {
      log.debug({i18N: true, currentLangData, language})
      setJsonFormsI18nState({
        locale: '',
        translate: translator
      })
      const timeout = setTimeout(() =>
        setJsonFormsI18nState({
          locale: language,
          translate: translator
        }), 100)
      return () => clearTimeout(timeout)
    }, [language, currentLangData, translator, setJsonFormsI18nState])


    useEffect(() => {
      setCurrentLangData(formTranslation[name]?.[language] || {})
    }, [formTranslation, language, name, setCurrentLangData])


    useEffect(() => {
      log.debug({currentLangData, language, ns: formNamespace(name)})
      if (!currentLangData) return
      removeResourceBundle(language, formNamespace(name))
      addResourceBundle(language, formNamespace(name), currentLangData, undefined, true)
      reloadResources(language, formNamespace(name))

    }, [currentLangData, language, name, addResourceBundle, removeResourceBundle,reloadResources])


    return (
      <>
        <JsonForms
          schema={schema}
          data={data}
          i18n={jsonFormsI18nState}
          renderers={renderers}
          cells={materialCells}
          onChange={({data}) => setData(data)}
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
