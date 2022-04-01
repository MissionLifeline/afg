import {Scopable, UISchemaElement, VerticalLayout} from '@jsonforms/core'

import schema from './fellowApplicants.json'
import {jsonSchema2UISchemaElements, overrideScopes, showOnTrue} from './utils'

const scope = (s: string) => `#/properties/${s}`

const overrides: (UISchemaElement & Scopable)[] = [{
  type: 'ListWithDetail',
  scope: '#/properties/fellowApplicantFamilyMembers',
  options: {
    elementLabelProp: ['firstName', 'lastName'],
    detail: {
      type: 'VerticalLayout',
      elements: overrideScopes([
          ...showOnTrue(scope('passportExisting'),
            [scope('passportNumber'), scope('passportDateOfIssue'), scope('passportDateOfExpiration'), scope('passportAttachment')]),
          ...showOnTrue(scope('tazkiraExisting'),
            [scope('tazkiraNumber'), scope('tazkiraType'), scope('tazkiraAttachment')]),
          ...showOnTrue(scope('visaOtherCountryExisting'),
            [scope('visaOtherCountryWhich'), scope('visaOtherAttachments')]),
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
