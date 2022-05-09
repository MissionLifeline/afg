import {GroupLayout, JsonSchema, Layout, UISchemaElement, VerticalLayout} from '@jsonforms/core'

const enum2TranslationJsonSchema = (enums: any[]) => Object.fromEntries(enums.map(enum__ => {
  const enum_ = enum__ as string
  return [[`${enum_}.label`], {type: 'string'}]
}))

const enum2TranslationUISchema = (enums: any[], scopeBase?: string) => ({
  type: 'Group',
  label: 'enum',
  elements: enums.map(enum__ => {
    const enum_ = enum__ as string
    return {
      type: 'Control',
      scope: `${scopeBase}${enum_}.label`
    }
  })
})
export const jsonSchema2TranslationJsonSchema: (jsonschema: JsonSchema) => JsonSchema
    = (jsonschema) => ({
  type: 'object',
  properties: Object.fromEntries(
      Object.entries(jsonschema.properties || {})
          .map(([k, v]) =>
              [
                [`${k}.label`, {type: 'string'}],
                [`${k}.description`, {type: 'string', format: 'markdown'}],
                ...(!v.items?.properties ? [] : [[k, jsonSchema2TranslationJsonSchema(v.items)]]),
                ...(!(v.type === 'string' && Array.isArray(v.enum)) ? [] : [[`${k}.enum`, {
                  type: 'object',
                  properties: enum2TranslationJsonSchema(v.enum)
                }]]),
                ...(!(v.type === 'array' && v.items?.type === 'string' &&  Array.isArray(v.items?.enum)) ? [] : [[`${k}.items.enum`, {
                  type: 'object',
                  properties: enum2TranslationJsonSchema(v.items.enum)
                }]])
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
                  scope: `${scopeBase}${k}.description`
                },
                ...(!v.items?.properties ? [] : [jsonSchema2TranslationUISchema<GroupLayout>(v.items, `${scopeBase}${k}/properties/`, {
                  type: 'Group',
                  label: k
                })]),
                ...(!(v.type === 'string' && Array.isArray(v.enum)) ? [] : [enum2TranslationUISchema(v.enum, `${scopeBase}${k}.enum/properties/`)]),
                ...(!((v.type === 'array' && v.items?.type === 'string' &&  Array.isArray(v.items?.enum))) ? [] : [enum2TranslationUISchema(v.items.enum, `${scopeBase}${k}.items.enum/properties/`)])
              ]
          ).flat()
})
