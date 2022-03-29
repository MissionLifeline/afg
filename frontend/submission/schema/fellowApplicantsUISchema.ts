import {Scopable, UISchemaElement, VerticalLayout} from '@jsonforms/core'

import schema from './fellowApplicants.json'
import {jsonSchema2UISchemaElements, overrideScopes} from './utils'

const overrides: (UISchemaElement & Scopable)[] = [{
  type: 'Control',
  scope: '#/properties/fellowApplicantFamilyMembers',
  options: {
    elementLabelProp: ['firstName', 'lastName']
  }
}]

export const fellowApplicantsUISchema: VerticalLayout = {
  type: 'VerticalLayout',
  elements: overrideScopes(overrides,
    jsonSchema2UISchemaElements(schema))

}
