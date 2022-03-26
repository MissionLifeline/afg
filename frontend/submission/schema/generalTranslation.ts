import schema from './general.json'
import {jsonSchema2Translation} from './utils'
import {LocalizedFormsTranslation} from './utils/types'

export const generalTranslation: LocalizedFormsTranslation = {
  de: jsonSchema2Translation(schema, true),
  en: jsonSchema2Translation(schema, true)
}
