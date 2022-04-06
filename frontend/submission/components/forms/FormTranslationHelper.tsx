import {formatIs, JsonFormsCore, JsonSchema, rankWith, UISchemaElement} from '@jsonforms/core'
import {materialCells, materialRenderers} from '@jsonforms/material-renderers'
import {JsonForms} from '@jsonforms/react'
import {Box, ToggleButton} from '@mui/material'
import React, {useCallback, useState} from 'react'

import {formNamespace, fromTranslationStateToFormTranslation} from '../../i18n'
import {useTranslationState} from '../../state'
import MarkdownTextFieldRenderer from '../renderer/MarkdownTextFieldRenderer'
import FormTranslationDownloader from './FormTranslationDownloader'
import FormTranslationUploader from './FormTranslationUploader'

type FormTranslationHelperProps = {
  name: string,
  onTranslationChange: (change: Pick<JsonFormsCore, 'data' | 'errors'>) => void
  translationData: any
  schema?: JsonSchema
  uischema?: UISchemaElement
  language: string,
  injectToCurrentLang?: boolean
}

const defaultRenderers = [
  ...materialRenderers,
  {
    tester: rankWith(5, formatIs('markdown')),
    renderer: MarkdownTextFieldRenderer
  }
]

const FormTranslationHelper =
  ({
     name,
     translationData,
     onTranslationChange,
     schema,
     uischema,
     language,
    injectToCurrentLang
   }: FormTranslationHelperProps) => {


    const [showForm, setShowForm] = useState(false)
    const {formTranslation} = useTranslationState()

    const prepareTranslations = useCallback(
      () => {

        const formTranslationFolded = fromTranslationStateToFormTranslation(
          Object.fromEntries(Object.entries(formTranslation)
            .map(([k, v]) => [formNamespace(k), v])))
        if(injectToCurrentLang) {
          formTranslationFolded[language] = {
            ...(formTranslationFolded[language] || {}),
            [name]: translationData
          }
        }
        return formTranslationFolded
      },
      [ formTranslation, language, injectToCurrentLang, name, translationData],
    )


    return <>
      <ToggleButton
        value="check"
        selected={showForm}
        onChange={() => setShowForm(prevState => !prevState)}
      >help translating {name} into {language}</ToggleButton>
      {showForm && <>
        <JsonForms
          schema={schema}
          uischema={uischema}
          data={translationData}
          renderers={defaultRenderers}
          cells={materialCells}
          onChange={onTranslationChange}
        />
        <Box display='flex' flexDirection='column'>
          <FormTranslationUploader language={language} getAllTranslations={prepareTranslations}/>
          <FormTranslationDownloader language={language} getAllTranslations={prepareTranslations}/>
        </Box>
      </>}
    </>
  }

export default FormTranslationHelper
