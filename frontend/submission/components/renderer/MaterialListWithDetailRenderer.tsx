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
import {
  Button,
  FormHelperText,
  Grid,
  Hidden,
  IconButton,
  List,
  MenuItem,
  Select,
  useMediaQuery
} from '@mui/material'
import map from 'lodash/map'
import merge from 'lodash/merge'
import range from 'lodash/range'
import React, {useCallback, useMemo, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {PluggableList} from 'react-markdown/lib/react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeSanitize from 'rehype-sanitize'

import {ArrayLayoutToolbar} from './ArrayToolbar'
import {DeleteDialog} from './DeleteDialog'
import ListWithDetailMasterItem from './ListWithDetailMasterItem'
import {MDEditorMarkdown} from './MDEditor'
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
     description,
     required,
     removeItems,
     addItem,
     data: dataLength,
     renderers,
     cells,
     config
   }: CustomArrayLayoutProps) => {
    const {t} = useTranslation()
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
          setSelectedIndex(dataLength)
        }
      },
      [addItem, setSelectedIndex, dataLength],
    )

    const deleteCancel = useCallback(
      () => {
        setDeleteDialogOpen(false)
        setAboutToRemove(() => undefined)
      },
      [setDeleteDialogOpen, setAboutToRemove],)

    const deleteConfirm = useCallback(
      () => {
        if (typeof aboutToRemove !== 'undefined') {
          handleRemoveItem(path, aboutToRemove)()
        }
        setDeleteDialogOpen(false)
        setAboutToRemove(() => undefined)
      },
      [path, aboutToRemove, setAboutToRemove, setDeleteDialogOpen, handleRemoveItem],
    )
    const rehypePlugins = useMemo<PluggableList>(() => [[rehypeSanitize],[rehypeExternalLinks, { target: '_blank' }]], [])


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
        {description && description.length > 0 && <Hidden xsUp={!visible}>
          <Grid item xs>
            <FormHelperText>
              <MDEditorMarkdown
                source={description}
                rehypePlugins={rehypePlugins}/>
            </FormHelperText>
          </Grid>
        </Hidden>}
        <Grid container direction={matches ? 'row' : 'column'} spacing={2}>
          <Grid item xs={4}>
            {matches
              ? (<List>
                {dataLength > 0 ? (
                  map(range(dataLength), index => (
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
                  >{dataLength > 0 ? (
                    map(range(dataLength), index => (<MenuItem key={index} value={index.toString()}>
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
              <FormHelperText>{dataLength > 0 ? t('choose_or_add') : t('no_entry_add') }</FormHelperText>
            )}
            <Button
              endIcon={<Add />}
              variant='outlined'
              onClick={makeAddItemCallback(path, handleCreateDefaultValue())}
            >{t(dataLength > 0 ? 'add_another' : 'add_first', {item: label})}</Button>
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
