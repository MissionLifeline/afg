import {RuleEffect, Scopable, UISchemaElement, VerticalLayout} from '@jsonforms/core'

import schema from './spouse.json'
import {jsonSchema2UISchemaElements, overrideScopes, showOnTrue} from './utils'

const scope = (s: string) => `#/properties/${s}`

const overrides: (UISchemaElement & Scopable)[] = [{
  type: 'ListWithDetail',
  scope: '#/properties/spouse',
  options: {
    elementLabelProp: ['firstName', 'lastName'],
    detail: {
      type: 'VerticalLayout',
      elements: overrideScopes([
        {
          type: 'Control',
          scope: scope('placeOfResidenceOther'),
          rule: {
            effect: RuleEffect.SHOW,
            condition: {
              //@ts-ignore
              scope: scope('placeOfResidenceList'),
              schema: {enum: [ 'other' ]}
            }
          }
        },
        ...showOnTrue(scope('passportExisting'),
          [scope('passportNumber'), scope('passportDateOfIssue'), scope('passportDateOfExpiration'), scope('passportAttachment')]),
        ...showOnTrue(scope('tazkiraExisting'),
          [scope('tazkiraNumber'), scope('tazkiraType'), scope('tazkiraAttachment')]),
        ...showOnTrue(scope('visaOtherCountryExisting'),
          [scope('visaOtherCountryWhich'), scope('visaOtherAttachments')]),
      ],
      jsonSchema2UISchemaElements(schema.properties.spouse.items)
      )
    }
  }
}]

export const spouseUISchema: VerticalLayout = {
  type: 'VerticalLayout',
  elements: overrideScopes(overrides,
    jsonSchema2UISchemaElements(schema))
}
