import {Scopable, UISchemaElement, VerticalLayout} from '@jsonforms/core'

import schema from './fellowApplicants.json'
import {jsonSchema2UISchemaElements, overrideScopes} from './utils'

const overrides: (UISchemaElement & Scopable)[] = [{
  type: 'ListWithDetail',
  scope: '#/properties/fellowApplicantFamilyMembers',
  options: {
    elementLabelProp: ['firstName', 'lastName'],
    detail: {
      type: 'VerticalLayout',
      elements: overrideScopes([

        ],
        jsonSchema2UISchemaElements(schema.properties.fellowApplicantFamilyMembers.items)
        )
    }
  }
}]

export const fellowApplicantsUISchema: VerticalLayout = {
  type: 'VerticalLayout',
  elements: overrideScopes(overrides,
    jsonSchema2UISchemaElements(schema))

}
