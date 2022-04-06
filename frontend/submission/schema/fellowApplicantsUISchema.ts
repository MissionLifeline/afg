import {RuleEffect, Scopable, UISchemaElement, VerticalLayout} from '@jsonforms/core'

import schema from './fellowApplicants.json'
import {jsonSchema2UISchemaElements, overrideScopes, showOnEnum, showOnTrue} from './utils'

const scope = (s: string) => `#/properties/${s}`

const overrides: (UISchemaElement & Scopable)[] = [{
  type: 'ListWithDetail',
  scope: '#/properties/fellowApplicantFamilyMembers',
  options: {
    elementLabelProp: ['firstName', 'lastName'],
    detail: {
      type: 'VerticalLayout',
      elements: overrideScopes([
        ...showOnTrue(
          scope('passportExisting'),
          [scope('passportNumber'), scope('passportDateOfIssue'), scope('passportDateOfExpiration'), scope('passportAttachment')]
        ),
        ...showOnTrue(
          scope('tazkiraExisting'),
          [scope('tazkiraNumber'), scope('tazkiraType'), scope('tazkiraAttachment')]
        ),
        ...showOnTrue(
          scope('visaOtherCountryExisting'),
          [scope('visaOtherCountryWhich'), scope('visaOtherAttachments')]
        ),
        ...showOnEnum(
          scope('relation'), ['daughter'], scope('maritalStatus')
        ),
        ...showOnEnum(
          scope('relation'), ['parent'], scope('fragile')
        ),
        // ...showOnEnum(
        //   scope('relation'), ['uncleAunt'], scope('requiresCare')
        // ),
        {
          type: 'Control',
          scope: scope('requiresCareExplanation'),
          options: {
            multi: true
          },
          rule: {
            effect: RuleEffect.SHOW,
            condition: {
              //@ts-ignore
              scope: scope('requiresCare'),
              schema: {const: true}
            }
          }
        }
      ], jsonSchema2UISchemaElements(schema.properties.fellowApplicantFamilyMembers.items))
    }
  }
}]

export const fellowApplicantsUISchema: VerticalLayout = {
  type: 'VerticalLayout',
  elements: overrideScopes(overrides,
    jsonSchema2UISchemaElements(schema))

}
