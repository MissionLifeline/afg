import { ArrayLayoutProps } from '@jsonforms/core'
import {Cancel, Close} from '@mui/icons-material'
import {
  Checkbox, Chip, Fab, FormControl,
  Hidden,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent, useMediaQuery
} from '@mui/material'
import { createStyles, makeStyles } from '@mui/styles'
import _ from 'lodash'
import React, {useCallback, useState} from 'react'
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
const SelectListWithChipsRenderer = ({removeItems, addItem, visible, schema, arrayData: values = [], path, label }: CustomArrayLayoutProps) => {
  const  { t } = useTranslation()
  const [selectOpen, setSelectOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width:800px)')

  const classes = useStyles()

  const options = schema?.enum?.map((key) => ({
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
    <FormControl fullWidth={true} className={classes.formControl} sx={{ marginTop: '0.5rem' }}>
      <InputLabel id="multiple-chip-checkbox-label" sx={{ top: '-0.5rem' }}>{label}</InputLabel>
      {
        <Select
          labelId="multiple-chip-checkbox-label"
          id="multiple-chip-checkbox"
          multiple
          value={values}
          style={{maxWidth: '100%'}}
          autoWidth={true}
          onChange={handleChange}
          onOpen={() => setSelectOpen(true)}
          onClose={() => setSelectOpen(false)}
          open={selectOpen}
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
      {isMobile && selectOpen && <Fab
          style={{position: 'fixed', bottom: 16, right: 16, zIndex: 10000}}
          color={'primary'}
          onClick={() => setSelectOpen(false)}><Close/></Fab> }

    </FormControl>
  </Hidden>
}


export default withJsonFormsArrayLayoutProps(SelectListWithChipsRenderer)
