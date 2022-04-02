import {JsonFormsCore, JsonSchema} from '@jsonforms/core'
import {materialCells, materialRenderers} from '@jsonforms/material-renderers'
import {JsonForms} from '@jsonforms/react'
import {Box, ToggleButton} from '@mui/material'
import React, {useState} from 'react'

import FormTranslationDownloader from './FormTranslationDownloader'
import FormTranslationUploader from './FormTranslationUploader'

type FormTranslationHelperProps = {
  name: string,
  onTranslationChange: (change: Pick<JsonFormsCore, 'data' | 'errors'>) => void
  translationData: any
  schema?: JsonSchema
  language: string
}

const defaultRenderers = [
  ...materialRenderers,
  //register custom renderers
]

const FormTranslationHelper =
  ({
     name,
     translationData,
     onTranslationChange,
     schema,
     language
   }: FormTranslationHelperProps) => {


    const [showForm, setShowForm] = useState(false)

    return <>
      <ToggleButton
        value="check"
        selected={showForm}
        onChange={() => setShowForm(prevState => !prevState)}
      >help translating {name} into {language}</ToggleButton>
      {showForm && <>
        <JsonForms
          schema={schema}
          data={translationData}
          renderers={defaultRenderers}
          cells={materialCells}
          onChange={onTranslationChange}
        />
        <Box display='flex' flexDirection='column'>
          <FormTranslationUploader language={language}/>
          <FormTranslationDownloader language={language}/>
        </Box>
      </>}
    </>
  }

export default FormTranslationHelper
