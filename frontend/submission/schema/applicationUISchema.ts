import {RuleEffect, Scopable, UISchemaElement, VerticalLayout} from '@jsonforms/core'

import schema from './application.json'
import {jsonSchema2UISchemaElements, overrideScopes, showOnTrue} from './utils'

const overrides: (UISchemaElement & Scopable)[] = [
  ...showOnTrue('#/properties/hazzardApplicationFiled', '#/properties/hazzardApplicationDate'),
  ...showOnTrue('#/properties/admissionApplicationFiled', '#/properties/admissionApplicationDate'),
  ...showOnTrue('#/properties/admissionApprovalFiled', '#/properties/admissionApprovalDate'),
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
