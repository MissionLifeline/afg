import {JsonSchema, UISchemaElement} from '@jsonforms/core'

export const jsonSchema2UISchemaElements: (jsonschema: JsonSchema) => UISchemaElement[] = (jsonschema: JsonSchema) => {
  const uiSchemaElements: UISchemaElement[] = Object.keys(jsonschema.properties || {})
    .map(k => ({ type: 'Control', scope: `#/properties/${k}`}))
  return uiSchemaElements
}
