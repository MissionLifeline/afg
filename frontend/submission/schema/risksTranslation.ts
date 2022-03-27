import schema from './risks.json'
import {jsonSchema2Translation} from './utils'
import {LocalizedFormsTranslation} from './utils/types'

export const risksTranslation: LocalizedFormsTranslation = {
  de: jsonSchema2Translation(schema, true),
  en: jsonSchema2Translation(schema, true)
}
