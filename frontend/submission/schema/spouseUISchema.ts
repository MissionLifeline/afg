import {JsonSchema, UISchemaElement} from '@jsonforms/core'

import application from './application.json'
import {applicationUIOverrides} from './applicationUISchema'
import general from './general.json'
import {generalUIOverride} from './generalUISchema'
import risks from './risks.json'
import {risksUIOverride} from './risksUISchema'
import {UISchemaOverrides} from './types'
import {jsonSchema2UISchemaElements, overrideScopes} from './utils'

const verticalGroup = (elements: UISchemaElement[], path: string, label?: string) => ({
  type: 'Group',
  label: label || path,
  elements: [{
    type: 'VerticalLayout',
    elements
  }]
})

const scopedVerticalGroupOverride = (path: string, overrideFn: UISchemaOverrides, schema: JsonSchema) =>
    verticalGroup(
        overrideScopes(overrideFn(s => `#/properties/${path}/properties/${s}`), jsonSchema2UISchemaElements(schema, `${path}/properties/`)),
        path)

export const spouseUISchema = {
  type: 'ListWithDetail',
  scope: '#/properties/spouse',
  options: {
    elementLabelProp: ['general.firstName', 'general.lastName'],
    detail: {
      type: 'VerticalLayout',
      elements: [
        scopedVerticalGroupOverride('general', generalUIOverride, general),
        scopedVerticalGroupOverride('risks', risksUIOverride, risks),
        scopedVerticalGroupOverride('application', applicationUIOverrides, application)
      ]
    }
  }
}
