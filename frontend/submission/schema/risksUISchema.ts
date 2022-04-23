import {VerticalLayout} from '@jsonforms/core'

import schema from './risks.json'
import {UISchemaOverrides} from './types'
import {jsonSchema2UISchemaElements, overrideScopes} from './utils'

export const risksUIOverride: UISchemaOverrides = scopeFn => [{
  type: 'Control',
  scope: scopeFn('risksCV'),
  options: {
    multi: true
  }
},{
  type: 'Control',
  scope: scopeFn('threatReport'),
  options: {
    multi: true
  }
}]

const scope = (s: string) => `#/properties/${s}`

export const risksUISchema: VerticalLayout = {
  type: 'VerticalLayout',
  elements: overrideScopes(risksUIOverride(scope),
    jsonSchema2UISchemaElements(schema))

}
