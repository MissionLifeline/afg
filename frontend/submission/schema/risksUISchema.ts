import {Scopable, UISchemaElement, VerticalLayout} from '@jsonforms/core'

import schema from './risks.json'
import {jsonSchema2UISchemaElements, overrideScopes} from './utils'

const overrides: (UISchemaElement & Scopable)[] = [{
  type: 'Control',
  scope: '#/properties/risksCV',
  options: {
    multi: true
  }
},{
  type: 'Control',
  scope: '#/properties/threatReport',
  options: {
    multi: true
  }
},
]

export const risksUISchema: VerticalLayout = {
  type: 'VerticalLayout',
  elements: overrideScopes(overrides,
    jsonSchema2UISchemaElements(schema))

}
