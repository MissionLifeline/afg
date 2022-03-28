import {RuleEffect, Scopable, UISchemaElement, VerticalLayout} from '@jsonforms/core'

import schema from './application.json'
import {jsonSchema2UISchemaElements, overrideScopes} from './utils'

const overrides: (UISchemaElement & Scopable)[] = [
  {
    type: 'Control',
    scope: '#/properties/hazzardApplicationDate',
    rule: {
      effect: RuleEffect.SHOW,
      condition: {
        //@ts-ignore
        scope: '#/properties/hazzardApplicationFiled',
        schema: { const: true }
      }
    }
  },
  {
    type: 'Control',
    scope: '#/properties/admissionApplicationDate',
    rule: {
      effect: RuleEffect.SHOW,
      condition: {
        //@ts-ignore
        scope: '#/properties/admissionApplicationFiled',
        schema: { const: true }
      }
    }
  },
  {
    type: 'Control',
    scope: '#/properties/admissionApprovalDate',
    rule: {
      effect: RuleEffect.SHOW,
      condition: {
        //@ts-ignore
        scope: '#/properties/admissionApprovalFiled',
        schema: { const: true }
      }
    }
  }
]
export const applicationUISchema: VerticalLayout = {
  type: 'VerticalLayout',
  elements: overrideScopes(overrides,
      jsonSchema2UISchemaElements(schema))

}
