import {
  createAjv,
  formatIs,
  JsonFormsCore,
  JsonSchema,
  or,
  rankWith,
  scopeEndsWith,
  UISchemaElement
} from '@jsonforms/core'
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
  language: string
}

const defaultRenderers = [
  ...materialRenderers,
  {
    tester: rankWith(5,
        or(
            formatIs('markdown'),
            scopeEndsWith('markdown')
        )),
    renderer: MarkdownTextFieldRenderer
  }
]

const ajv = createAjv({
  allErrors: true,
  verbose: true,
  formats: {'markdown': true}
})

const FormTranslationHelper =
    ({
       name,
       translationData,
       onTranslationChange,
       schema,
       uischema,
       language,
     }: FormTranslationHelperProps) => {


      const [showForm, setShowForm] = useState(false)
      const {formTranslation, common} = useTranslationState()

      const prepareTranslations = useCallback(
          () => {
            return fromTranslationStateToFormTranslation({
              ...Object.fromEntries(Object.entries(formTranslation)
                  .map(([k, v]) => [formNamespace(k), v])),
              common
            })
          },
          [formTranslation, common],
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
              ajv={ajv}
          />
          <Box display='flex' flexDirection='column'>
            <FormTranslationUploader language={language} getAllTranslations={prepareTranslations}/>
            <FormTranslationDownloader language={language} getAllTranslations={prepareTranslations}/>
          </Box>
        </>}
      </>
    }

export default FormTranslationHelper
