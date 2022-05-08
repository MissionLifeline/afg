import {VerticalLayout} from '@jsonforms/core'

import schema from './general.json'
import {UISchemaOverrides} from './types'
import {hideOnEnum, jsonSchema2UISchemaElements, overrideScopes, showOnEnum, showOnTrue} from './utils'

export const generalUIOverride: UISchemaOverrides = scopeFn => [
  ...showOnTrue(scopeFn('passportExisting'),
    [scopeFn('passportNumber'), scopeFn('passportDateOfIssue'), scopeFn('passportDateOfExpiration'), scopeFn('passportAttachment')]),
  ...showOnTrue(scopeFn('tazkiraExisting'),
    [scopeFn('tazkiraNumber'), scopeFn('tazkiraType'), scopeFn('tazkiraAttachment')]),
  ...showOnTrue(scopeFn('visaOtherCountryExisting'),
    [scopeFn('visaOtherCountryWhich'), scopeFn('visaOtherAttachments')]),
  ...showOnEnum(
      scopeFn('placeOfResidenceList'), ['other'], scopeFn('placeOfResidenceOther')
  ),
  ...hideOnEnum(
    scopeFn('placeOfResidenceList'), ['afgh'], scopeFn('reasonForResidenceNotInAfghanistan'), {
      options: {
        multi: true
      }
    }
  ),
]

const scope = (s: string) => `#/properties/${s}`

export const generalUISchema: VerticalLayout = {
  type: 'VerticalLayout',
  elements: overrideScopes(generalUIOverride(scope),
    jsonSchema2UISchemaElements(schema))
}
