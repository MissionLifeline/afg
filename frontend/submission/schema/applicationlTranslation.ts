import schema from './application.json'
import {jsonSchema2Translation} from './utils'
import {LocalizedFormsTranslation} from './utils/types'

export const applicationTranslation: LocalizedFormsTranslation = {
  de: jsonSchema2Translation(schema, true),
  en: jsonSchema2Translation(schema, true)
}
