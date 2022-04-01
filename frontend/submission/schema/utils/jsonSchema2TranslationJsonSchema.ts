import {GroupLayout, JsonSchema, Layout, UISchemaElement, VerticalLayout} from '@jsonforms/core'

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
export const jsonSchema2TranslationUISchema: <K extends Layout = VerticalLayout>(jsonschema: JsonSchema, scopeBase?: string, options?: Partial<K>) => UISchemaElement
  = (jsonschema, scopeBase = '#/properties/', options) => ({
  type: 'VerticalLayout',
  ...(options || {}),
  elements:
    Object.entries(jsonschema.properties || {})
      .map(([k, v]) =>
        [
          {
            type: 'Control',
            scope: `${scopeBase}${k}.label`
          },
          {
            type: 'Control',
            scope: `${scopeBase}${k}.description`,
            options: {
              multi: true
            }
          },
          ...(!v.items?.properties ? [] :  [jsonSchema2TranslationUISchema<GroupLayout>(v.items, `${scopeBase}${k}/properties/`,{type: 'Group', label: k})])
        ]
      ).flat()
})
