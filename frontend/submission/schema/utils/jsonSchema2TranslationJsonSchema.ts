import {JsonSchema} from '@jsonforms/core'

export const jsonSchema2TranslationJsonSchema: (jsonschema: JsonSchema) => JsonSchema
  = (jsonschema) => ({
  type: 'object',
  properties: Object.fromEntries(
    Object.entries(jsonschema.properties || {})
      .map(([k ,v]) =>
        [
          [`${k}.label`, {type: 'string'}],
          [`${k}.description`, {type: 'string'}],
          ...(!v.items?.properties ? [] : [[k, jsonSchema2TranslationJsonSchema(v.items)]])
        ]
      ).flat())})
