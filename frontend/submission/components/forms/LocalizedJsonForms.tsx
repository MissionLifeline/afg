import {JsonFormsI18nState, JsonFormsRendererRegistryEntry, Translator} from '@jsonforms/core'
import {materialCells, materialRenderers} from '@jsonforms/material-renderers'
import {JsonForms} from '@jsonforms/react'
import {JsonFormsInitStateProps, JsonFormsReactProps} from '@jsonforms/react/lib/JsonForms'
import log from 'loglevel'
import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'

import {jsonSchema2TranslationJsonSchema} from '../../schema/utils'
import FormTranslationHelper from './FormTranslationHelper'

type LocalizedJsonFormsProps = {
  name: string
  renderers?: JsonFormsRendererRegistryEntry[];
} &  Omit<JsonFormsInitStateProps & JsonFormsReactProps, 'renderers'>

const defaultRenderers = [
  ...materialRenderers,
  //register custom renderers
]


/** This is a first version of the `Part 1` of the questionnaire.
 *  See: `Online Tool Spezialfälle Vorschlag abzufragende Daten und Abfolge.docx`
 **/
const LocalizedJsonForms = ({name, renderers = defaultRenderers, data: initialData = {}, schema,  ...props}: LocalizedJsonFormsProps) => {
  const [data, setData] = useState<any>(initialData)

  const [translationData, setTranslationData] = useState<any>({})
  const [translationsSchema] = useState(jsonSchema2TranslationJsonSchema(schema || {}))
  const {t, i18n: {language, exists, addResourceBundle}} = useTranslation(`form_${name}`)

  const translator: Translator = (key, defaultMessage) => {
    const labelKey = `${key}`
    log.debug({[labelKey]: {t: t(labelKey), exists: exists(labelKey)}})
    return (exists(labelKey) ? t(labelKey) : (defaultMessage && exists(defaultMessage) ? t(defaultMessage) : defaultMessage) || '')
  }

  useEffect(() => {
    if(!translationData[language]) return
    addResourceBundle(language, `form_${name}`, translationData[language], undefined , true)

  }, [translationData, language, name, addResourceBundle])



  const i18n: JsonFormsI18nState = {
    locale: language,
    translate: translator
  }

  return (
    <>
      <JsonForms
        schema={schema}
        data={data}
        i18n={i18n}
        renderers={renderers}
        cells={materialCells}
        onChange={({data}) => setData(data)}
        {...props}
      />
      <FormTranslationHelper
        language={language}
        schema={translationsSchema}
        translationData={translationData[language] || {}}
        onTranslationChange={({data}) => setTranslationData((trans: any) => ({...trans, [language]: data}))}
      />

    </>
  )
}

export default LocalizedJsonForms
