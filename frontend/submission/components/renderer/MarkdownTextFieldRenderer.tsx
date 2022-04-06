import {ControlProps, showAsRequired} from '@jsonforms/core'
import {withJsonFormsControlProps} from '@jsonforms/react'
import {FormControl, FormLabel, Hidden} from '@mui/material'
import merge from 'lodash/merge'
import React, {useCallback} from 'react'
import rehypeSanitize from 'rehype-sanitize'

import MDEditor from './MDEditor'



const MarkdownTextFieldRenderer = (props: ControlProps) => {
  const {
    id,
    errors,
    label,
    uischema,
    visible,
    required,
    config,
    data,
    handleChange,
    path
  } = props
  const isValid = errors.length === 0
  const appliedUiSchemaOptions = merge({}, config, uischema.options)


  const handleChange_ = useCallback(
    (v?: string) => {
      handleChange(path, v || '')
    },
    [path, handleChange],
  )


  return (
    <Hidden xsUp={!visible}>
      <FormControl
        fullWidth={!appliedUiSchemaOptions.trim}
        id={id}
        variant={'standard'}
        sx={theme => ({marginBottom: theme.spacing(2)})}
      >
        <FormLabel
          error={!isValid}
          required={showAsRequired(!!required,
            appliedUiSchemaOptions.hideRequiredAsterisk)}
        >
          {label}
        </FormLabel>
        <MDEditor
          textareaProps={{
            id: id + '-input'
          }}
          value={data as string}
          onChange={handleChange_}
          previewOptions={{
            rehypePlugins: [[rehypeSanitize]],
          }}
          commandsFilter={(cmd) => cmd?.name && /(divider|code|image|checked)/.test(cmd.name) ? false : cmd}
        />
      </FormControl>
    </Hidden>
  )
}

export default withJsonFormsControlProps(MarkdownTextFieldRenderer)
