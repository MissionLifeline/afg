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
          scope('eligible'),
          [scope('passportExisting'),
           scope('tazkiraExisting'),
           scope('visaOtherCountryExisting'),
           scope('placeOfResidenceList'), scope('placeOfResidenceOther'),
          ]
        ),
        // @ts-ignore
        ...showOnTrue(
          [scope('passportExisting'), scope('eligible')],
          [scope('passportNumber'), scope('passportDateOfIssue'), scope('passportDateOfExpiration'), scope('passportAttachment')]
        ),
        // @ts-ignore
        ...showOnTrue(
          [scope('tazkiraExisting'), scope('eligible')],
          [scope('tazkiraNumber'), scope('tazkiraType'), scope('tazkiraAttachment')]
        ),
        // @ts-ignore
        ...showOnTrue(
          [scope('visaOtherCountryExisting'), scope('eligible')],
          [scope('visaOtherCountryWhich'), scope('visaOtherAttachments')]
        ),
        // @ts-ignore
        ...showOnEnum(
          scope('relation'), ['daughter'], scope('maritalStatus')
        ),
        // @ts-ignore
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
