import {RuleEffect, Scopable, UISchemaElement, VerticalLayout} from '@jsonforms/core'

import schema from './application.json'
import {jsonSchema2UISchemaElements, overrideScopes, showOnTrue} from './utils'

const overrides: (UISchemaElement & Scopable)[] = [
  ...showOnTrue('#/properties/hazzardApplicationFiled', '#/properties/hazzardApplicationDate'),
  ...showOnTrue('#/properties/admissionApplicationFiled', '#/properties/admissionApplicationDate'),
  ...showOnTrue('#/properties/admissionApprovalFiled', '#/properties/admissionApprovalDate'),
]
export const applicationUISchema: VerticalLayout = {
  type: 'VerticalLayout',
  elements: overrideScopes(overrides,
      jsonSchema2UISchemaElements(schema))

}
