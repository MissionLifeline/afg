import {JsonSchema, UISchemaElement} from '@jsonforms/core'

export const jsonSchema2TranslationJsonSchema: (jsonschema: JsonSchema) => JsonSchema
  = (jsonschema) => ({
  type: 'object',
  properties: Object.fromEntries(
    Object.entries(jsonschema.properties || {})
      .map(([k, v]) =>
        [
          [`${k}.label`, {type: 'string'}],
          [`${k}.description`, {type: 'string'}],
          ...(!v.items?.properties ? [] : [[k, jsonSchema2TranslationJsonSchema(v.items)]])
        ]
      ).flat())
})
export const jsonSchema2TranslationUISchema: (jsonschema: JsonSchema) => UISchemaElement
  = (jsonschema) => ({
  type: 'VerticalLayout',
  elements:
    Object.entries(jsonschema.properties || {})
      .map(([k, v]) =>
        [
          {
            type: 'Control',
            scope: `#/properties/${k}.label`
          },
          {
            type: 'Control',
            scope: `#/properties/${k}.description`,
            options: {
              multi: true
            }
          },
          ...(!v.items?.properties ? [] :  [jsonSchema2TranslationUISchema(v.items)])
        ]
      ).flat()
})
