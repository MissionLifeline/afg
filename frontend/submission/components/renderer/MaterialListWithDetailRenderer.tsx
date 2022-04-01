/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import {
  and,
  composePaths,
  computeLabel,
  createDefaultValue,
  findUISchema,
  isObjectArray,
  RankedTester,
  rankWith,
  uiTypeIs
} from '@jsonforms/core'
import {
  JsonFormsDispatch,
} from '@jsonforms/react'
import {Add} from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete'
import {Button, Grid, Hidden, IconButton, List, MenuItem, Select, Typography, useMediaQuery} from '@mui/material'
import map from 'lodash/map'
import merge from 'lodash/merge'
import range from 'lodash/range'
import React, {useCallback, useMemo, useState} from 'react'

import {ArrayLayoutToolbar} from './ArrayToolbar'
import {DeleteDialog} from './DeleteDialog'
import ListWithDetailMasterItem from './ListWithDetailMasterItem'
import SelectListWithDetailMasterItem from './SelectListWithDetailMasterItem'
import {CustomArrayLayoutProps, withJsonFormsArrayLayoutProps} from './withJsonFormsArrayLayoutProps'

export const MaterialListWithDetailRenderer =
  ({
     uischemas,
     schema,
     uischema,
     path,
     errors,
     visible,
     label,
     required,
     removeItems,
     addItem,
     data,
     renderers,
     cells,
     config
   }: CustomArrayLayoutProps) => {
    const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const matches = useMediaQuery('(min-width:600px)')
    const [aboutToRemove, setAboutToRemove] = useState<number | undefined>()
    const handleRemoveItem = useCallback(
      (p: string, value: number) => () => {
        removeItems && removeItems(p, [value])()
        setSelectedIndex(prev => !prev || prev === value ? undefined : (prev > value ? prev - 1 : prev))
      },
      [removeItems, setSelectedIndex])

    const handleRemoveitem = useCallback(
      (p: string, value: any) => {
        return () => {
          setAboutToRemove(value)
          setDeleteDialogOpen(true)
        }
      },
      [setAboutToRemove, setDeleteDialogOpen],
    )


    const handleListItemClick = useCallback(
      (index?: number) => () => setSelectedIndex(index),
      [setSelectedIndex]
    )
    const handleCreateDefaultValue = useCallback(
      () => schema && createDefaultValue(schema),
      [schema]
    )
    const foundUISchema = useMemo(
      () =>
         findUISchema(
          uischemas || [],
          schema,
          uischema.scope,
          path,
          undefined,
          uischema
        ),
      [uischemas, schema, uischema, path]
    )
    const appliedUiSchemaOptions = merge({}, config, uischema.options)

    const makeAddItemCallback = useCallback(
      (...args) => {
        // @ts-ignore
        const __addItem = addItem(...args)
        return (..._args: any[]) => {
          // @ts-ignore
          __addItem(..._args)
          setSelectedIndex(data)
        }
      },
      [addItem, setSelectedIndex, data],
    )

    const deleteCancel = useCallback(
      () => {
        setDeleteDialogOpen(false)
        setAboutToRemove(() => undefined)
      },
      [setDeleteDialogOpen, setAboutToRemove],)

    const deleteConfirm = useCallback(
      () => {
        if (aboutToRemove) {
          console.log({aboutToRemove})
          handleRemoveItem(path, aboutToRemove)()
        }
        setDeleteDialogOpen(false)
        setAboutToRemove(() => undefined)
      },
      [path, aboutToRemove, setAboutToRemove, setDeleteDialogOpen, handleRemoveItem],
    )


    return (
      <Hidden xsUp={!visible}>
        <DeleteDialog
          open={deleteDialogOpen}
          onCancel={deleteCancel}
          onConfirm={deleteConfirm}
          onClose={deleteCancel}
        />
        <ArrayLayoutToolbar
          label={computeLabel(
            label,
            !!required,
            appliedUiSchemaOptions.hideRequiredAsterisk
          )}
          errors={errors}
          path={path}
          addItem={makeAddItemCallback}
          createDefault={handleCreateDefaultValue}
        />
        <Grid container direction={matches ? 'row' : 'column'} spacing={2}>
          <Grid item xs={3}>
            {matches
              ? (<List>
                {data > 0 ? (
                  map(range(data), index => (
                    <ListWithDetailMasterItem
                      index={index}
                      path={path}
                      schema={schema}
                      handleSelect={handleListItemClick}
                      removeItem={handleRemoveitem}
                      selected={selectedIndex === index}
                      uischema={uischema}
                      key={index}
                    />
                  ))
                ) : (
                  <p>No data</p>
                )}
              </List>)
              : (<Grid container direction={'row'}>
                  <Select
                    style={{flex: '1', maxWidth: 'calc(100vw - 5em)'}}
                    value={selectedIndex === undefined ? '' : selectedIndex.toString()}
                    onChange={({target: {value}}) => {
                      setSelectedIndex(typeof value === 'string' ? parseInt(value) : value)
                    }}
                  >{data > 0 ? (
                    map(range(data), index => (<MenuItem key={index} value={index.toString()}>
                        <SelectListWithDetailMasterItem
                          index={index}
                          path={path}
                          uischema={uischema}
                          schema={schema}
                          removeItem={handleRemoveItem}
                        />
                      </MenuItem>
                    ))
                  ) : (
                    <p>No data</p>
                  )}
                  </Select>
                {typeof selectedIndex !== 'undefined' && <IconButton aria-label='Delete' onClick={() => handleRemoveitem(path, selectedIndex)()} size='large'>
                    <DeleteIcon />
                  </IconButton>}
                </Grid>
              )}
          </Grid>
          <Grid item xs>
            {selectedIndex !== undefined ? (
              <JsonFormsDispatch
                renderers={renderers}
                cells={cells}
                visible={visible}
                schema={schema}
                uischema={foundUISchema}
                path={composePaths(path, `${selectedIndex}`)}
              />
            ) : (
              <Typography variant='h6'> select one of {data.toString()} items</Typography>
            )}
            <Button endIcon={<Add />} variant='outlined' onClick={makeAddItemCallback()}>add to {label}</Button>
          </Grid>
        </Grid>
      </Hidden>
    )
  }

export const materialListWithDetailTester: RankedTester = rankWith(
  4,
  and(uiTypeIs('ListWithDetail'), isObjectArray)
)

export default withJsonFormsArrayLayoutProps(MaterialListWithDetailRenderer)
