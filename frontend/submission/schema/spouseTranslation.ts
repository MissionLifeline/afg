import schema from './spouse'
import {jsonSchema2Translation} from './utils'
import {LocalizedFormsTranslation} from './utils/types'

export const spouseTranslation: LocalizedFormsTranslation = {
  de: jsonSchema2Translation(schema, true),
  en: jsonSchema2Translation(schema, true)
}
