import { ArrayLayoutProps } from '@jsonforms/core'
import { Cancel } from '@mui/icons-material'
import {
  Checkbox, Chip, FormControl,
  Hidden,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material'
import { createStyles, DefaultTheme, makeStyles } from '@mui/styles'
import _ from 'lodash'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { withJsonFormsArrayLayoutProps } from './withJsonFormsArrayLayoutProps'

type ArrayDataProp = {
  arrayData: any[]
}

type CustomArrayLayoutProps = ArrayLayoutProps & ArrayDataProp
const useStyles = makeStyles((theme: { spacing: (x: number) => number }) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: '100%'
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3)
    }
  })
)
const CustomArrayControlRenderer = ({removeItems, addItem, visible, schema, arrayData: values = [], path, label }: CustomArrayLayoutProps) => {
  const  { t } = useTranslation()

  const classes = useStyles()

  const options = schema.enum?.map((key) => ({
    key: key as string,
    value: key,
    label: key
  }))

  const handleChange = useCallback(
    ({ target: { value: targetValues } }: SelectChangeEvent<string[]>) => {
      const diff = _.xor(values, targetValues)
      if (targetValues.length > values.length) {
        diff.forEach(item => addItem(path, item)())
      } else {
        diff.forEach(item => {
          const i = values.indexOf(item)
          i >= 0 && removeItems && removeItems(path, [i])()
        })}},
    [path, addItem, removeItems, values])

  const handleDelete = useCallback(
    (_: any, value: string) => {
      const i = values.indexOf(value)
      i >= 0 && removeItems && removeItems(path, [i])()
    },
    [removeItems, values, path])



  return <Hidden xsUp={!visible}>
    <FormControl fullWidth={true} className={classes.formControl}>
      <InputLabel id="multiple-chip-checkbox-label">{label}</InputLabel>
      {
        <Select
          labelId="multiple-chip-checkbox-label"
          id="multiple-chip-checkbox"
          multiple
          value={values}
          style={{maxWidth: '100%'}}
          onChange={handleChange}
          onOpen={() => console.log('select opened')}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {(selected as string[]).map((value) => (
                <Chip
                  key={value}
                  label={value}
                  clickable
                  deleteIcon={
                    <Cancel
                      onMouseDown={(event) => event.stopPropagation()}
                    />
                  }
                  className={classes.chip}
                  onDelete={(e) => handleDelete(e, value)}
                  onClick={() => console.log('clicked chip')}
                />
              ))}
            </div>
          )}
        >
          {options?.map(({key, value, label}) => (
            <MenuItem key={key} value={value}>
              <Checkbox checked={values.indexOf(value) > -1} />
              <ListItemText primary={label ?  t(label) : t(key)} />
            </MenuItem>
          ))}
        </Select>
      }
    </FormControl>
  </Hidden>
}


export default withJsonFormsArrayLayoutProps(CustomArrayControlRenderer)
