
import {
  and,
  ControlProps,
  isEnumControl,
  optionIs, OwnPropsOfEnum, RankedTester, rankWith
} from '@jsonforms/core'
import {  withJsonFormsEnumProps } from '@jsonforms/react'
import React from 'react'

import {MaterialRadioGroup} from './MaterialRadioGroup'

export const MaterialRadioGroupControl = (props: ControlProps & OwnPropsOfEnum) => {
  return <MaterialRadioGroup {...props} />
}

export const materialRadioGroupControlTester: RankedTester = rankWith(
  25,
  and(isEnumControl, optionIs('format', 'radio'))
)
export default withJsonFormsEnumProps(MaterialRadioGroupControl)
