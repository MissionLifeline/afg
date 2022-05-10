import {
  ControlProps,
  isDescriptionHidden,
  OwnPropsOfEnum,
  showAsRequired} from '@jsonforms/core'
import {useFocus} from '@jsonforms/material-renderers'
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Hidden,
  Radio,
  RadioGroup
} from '@mui/material'
import merge from 'lodash/merge'
import React from 'react'

export const MaterialRadioGroup = (props: ControlProps & OwnPropsOfEnum) => {
  const [focused, onFocus, onBlur] = useFocus()
  const {
    config,
    id,
    label,
    required,
    description,
    errors,
    data,
    visible,
    options,
    handleChange,
    path,
    enabled
  } = props
  const isValid = !errors?.length
  const appliedUiSchemaOptions = merge(
    {},
    config,
    props.uischema.options
  )
  const showDescription = !isDescriptionHidden(
    visible,
    description,
    focused,
    appliedUiSchemaOptions.showUnfocusedDescription
  )
  const onChange = (_ev:any, value:any) => handleChange(path, value)

  return (
    <Hidden xsUp={!visible}>
      <FormControl
        component={'fieldset' as 'div'}
        fullWidth={!appliedUiSchemaOptions.trim}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <FormLabel
          htmlFor={id}
          error={!isValid}
          component={'legend' as 'label'}
          required={showAsRequired(Boolean(required),
            appliedUiSchemaOptions.hideRequiredAsterisk)}
        >
          {label} - hello
        </FormLabel>

        <RadioGroup
          value={props.data}
          onChange={onChange}
          row={true}
        >
          {(options || []).map(option => (
            <FormControlLabel
              value={option.value}
              key={option.label}
              control={<Radio checked={data === option.value} />}
              label={option.label}
              disabled={!enabled}
            />
          ))}
        </RadioGroup>
        <FormHelperText error={!isValid}>
          {!isValid ? errors : showDescription ? description : null}
        </FormHelperText>
      </FormControl>
    </Hidden>
  )
}
