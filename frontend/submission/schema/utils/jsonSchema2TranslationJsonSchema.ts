import {JsonSchema} from '@jsonforms/core'

export const jsonSchema2TranslationJsonSchema: (jsonschema: JsonSchema) => JsonSchema
  = (jsonschema) => ({
  type: 'object',
  properties: Object.fromEntries(
    Object.keys(jsonschema.properties || {})
      .map(k =>
        [
          [`${k}.label`, {type: 'string'}],
          [`${k}.description`, {type: 'string'}]
        ]
      ).flat())})
