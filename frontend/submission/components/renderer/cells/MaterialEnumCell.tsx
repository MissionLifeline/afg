import {
  EnumCellProps,
  isEnumControl, isOneOfEnumControl, or,
  RankedTester,
  rankWith,
  WithClassname
} from '@jsonforms/core'
import { MuiSelect } from '@jsonforms/material-renderers'
import { withJsonFormsEnumCellProps } from '@jsonforms/react'
import React from 'react'

export const MaterialEnumCell = (props: EnumCellProps & WithClassname) => (
      <MuiSelect {...props}   />
)

/**
 * Default tester for enum controls.
 * @type {RankedTester}
 */
export const materialEnumCellTester: RankedTester = rankWith(10, or(isEnumControl, isOneOfEnumControl))

export default withJsonFormsEnumCellProps(MaterialEnumCell)
