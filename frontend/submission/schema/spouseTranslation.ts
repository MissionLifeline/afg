import {applicationTranslation} from './applicationlTranslation'
import {generalTranslation} from './generalTranslation'
import {risksTranslation} from './risksTranslation'
import schema from './spouse'
import {jsonSchema2Translation} from './utils'
import {LocalizedFormsTranslation} from './utils/types'

export const buildSpouseTranslation: (generalTranslation_: LocalizedFormsTranslation, risksTranslation_: LocalizedFormsTranslation, applicationTranslation_: LocalizedFormsTranslation) => LocalizedFormsTranslation =
    (generalTranslation_, risksTranslation_, applicationTranslation_) => Object.fromEntries(['de', 'en'].map(lang =>  ([lang,
  {
    ...jsonSchema2Translation(schema, true),
    spouse: {
      general: generalTranslation_[lang],
      risks: risksTranslation_[lang],
      application: applicationTranslation_[lang]
    }
  }
])))

export const spouseTranslation = buildSpouseTranslation(generalTranslation, risksTranslation, applicationTranslation)
