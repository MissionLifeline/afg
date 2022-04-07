import {JsonSchema} from '@jsonforms/core'
import {withJsonFormsControlProps} from '@jsonforms/react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import React from 'react'
import {useTranslation} from 'react-i18next'

type EnumRendererProps = {
  data: any
  handleChange(path: string, value: any): void
  path: string
  label: string
  schema: JsonSchema
  visible?: boolean
}

const EnumRenderer = React.memo(
  ({data, handleChange, path, label, schema, visible}: EnumRendererProps) => {
    const {t} = useTranslation()

    return ( <FormControl>
      <FormLabel id={`enum-label-${path}`}>{t(label)}</FormLabel>
      <RadioGroup
        aria-labelledby={`enum-label-${path}`}
        sx={{ flexDirection: 'row' }}
      >
        {(schema.enum || []).map(value =>
          <FormControlLabel value={value} control={<Radio />} label={t(value)} />
        )}
      </RadioGroup>
    </FormControl> )
  }
)

export default withJsonFormsControlProps(EnumRenderer)
