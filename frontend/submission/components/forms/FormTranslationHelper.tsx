import {JsonSchema} from '@jsonforms/core'
import {materialCells, materialRenderers} from '@jsonforms/material-renderers'
import {JsonForms} from '@jsonforms/react'
import {ToggleButton} from '@mui/material'
import React, {useState} from 'react'

type FormTranslationHelperProps = {
  onTranslationChange: (translationData: any) => void
  translationData: any
  schema: JsonSchema
  language: string
}

const defaultRenderers = [
  ...materialRenderers,
  //register custom renderers
]

const FormTranslationHelper =
  ({
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
      >help translating to {language}</ToggleButton>
      {showForm && <JsonForms
        schema={schema}
        data={translationData}
        renderers={defaultRenderers}
        cells={materialCells}
        onChange={({data}) => onTranslationChange(data)}
      />}
    </>
  }

export default FormTranslationHelper
