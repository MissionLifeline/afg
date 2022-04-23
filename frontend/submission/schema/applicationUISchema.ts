import {VerticalLayout} from '@jsonforms/core'

import schema from './application.json'
import {UISchemaOverrides} from './types'
import {jsonSchema2UISchemaElements, overrideScopes, showOnTrue} from './utils'

export const applicationUIOverrides: UISchemaOverrides = scopeFn => [
  ...showOnTrue(scopeFn('hazzardApplicationFiled'), [scopeFn('hazzardApplicationDate'), scopeFn('hazzardApplicationAttachments')]),
  ...showOnTrue(scopeFn('admissionApplicationFiled'), [scopeFn('admissionApplicationDate'), scopeFn('admissionApplicationAttachments')]),
  ...showOnTrue(scopeFn('admissionApprovalReceived'), [scopeFn('admissionApprovalDate'), scopeFn('admissionApprovalAttachments')]),
  { type: 'ListWithDetail',
    scope: scopeFn('familyMembersInGermany'),
    options: {
      elementLabelProp: ['firstName', 'lastName'],
      detail: {
        type: 'VerticalLayout',
        elements: overrideScopes([], jsonSchema2UISchemaElements(schema.properties.familyMembersInGermany.items))
      }
    }
  }
]
const scope = (s: string) => `#/properties/${s}`
export const applicationUISchema: VerticalLayout = {
  type: 'VerticalLayout',
  elements: overrideScopes(applicationUIOverrides(scope),
      jsonSchema2UISchemaElements(schema))

}
