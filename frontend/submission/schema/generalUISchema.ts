import {RuleEffect, Scopable, UISchemaElement, VerticalLayout} from '@jsonforms/core'

import schema from './general.json'
import {jsonSchema2UISchemaElements, withoutProperties} from './utils'


const overrides: (UISchemaElement & Scopable)[] = [
  {
    type: 'Control',
    scope: '#/properties/visaOtherCountryWhich',
    rule: {
      effect: RuleEffect.SHOW,
      condition: {
        //@ts-ignore
        scope: '#/properties/visaOtherCountryExisting',
        schema: { const: true }
      }
    }
  }
]

export const generalUISchema: VerticalLayout = {
  type: 'VerticalLayout',
  elements: [
    ... withoutProperties(
      jsonSchema2UISchemaElements(schema),
      overrides.map(({ scope }) => scope)),
    ...overrides
  ]
}
