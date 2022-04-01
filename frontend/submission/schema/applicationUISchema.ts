import {RuleEffect, Scopable, UISchemaElement, VerticalLayout} from '@jsonforms/core'

import schema from './application.json'
import {jsonSchema2UISchemaElements, overrideScopes, showOnTrue} from './utils'

const overrides: (UISchemaElement & Scopable)[] = [
  ...showOnTrue('#/properties/hazzardApplicationFiled', ['#/properties/hazzardApplicationDate', '#/properties/hazzardApplicationAttachments']),
  ...showOnTrue('#/properties/admissionApplicationFiled', ['#/properties/admissionApplicationDate', '#/properties/admissionApplicationAttachments']),
  ...showOnTrue('#/properties/admissionApprovalReceived', ['#/properties/admissionApprovalDate', '#/properties/admissionApprovalAttachments']),
  { type: 'ListWithDetail',
    scope: '#/properties/familyMembersInGermany',
    options: {
      elementLabelProp: ['firstName', 'lastName'],
      detail: {
        type: 'VerticalLayout',
        elements: overrideScopes([], jsonSchema2UISchemaElements(schema.properties.familyMembersInGermany.items))
      }
    }
  }
]
export const applicationUISchema: VerticalLayout = {
  type: 'VerticalLayout',
  elements: overrideScopes(overrides,
      jsonSchema2UISchemaElements(schema))

}
