import {RuleEffect, Scopable, UISchemaElement, VerticalLayout} from '@jsonforms/core'

import schema from './general.json'
import {jsonSchema2UISchemaElements, overrideScopes, showOnTrue} from './utils'


const overrides: (UISchemaElement & Scopable)[] = [
  {
    type: 'Control',
    scope: '#/properties/placeOfResidenceOther',
    rule: {
      effect: RuleEffect.SHOW,
      condition: {
        //@ts-ignore
        scope: '#/properties/placeOfResidenceList',
        schema: {enum: [ 'other' ]}
      }
    }
  },
  ...showOnTrue('#/properties/passportExisting',
    ['#/properties/passportNumber', '#/properties/passportDateOfIssue', '#/properties/passportDateOfExpiration', '#/properties/passportAttachment']),
  ...showOnTrue('#/properties/tazkiraExisting',
    ['#/properties/tazkiraNumber', '#/properties/tazkiraType', '#/properties/tazkiraAttachment']),
  ...showOnTrue('#/properties/visaOtherCountryExisting',
    ['#/properties/visaOtherCountryWhich', '#/properties/visaOtherAttachments']),
]

export const generalUISchema: VerticalLayout = {
  type: 'VerticalLayout',
  elements: overrideScopes(overrides,
    jsonSchema2UISchemaElements(schema))
}
