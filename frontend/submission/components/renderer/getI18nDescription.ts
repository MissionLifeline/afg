import {getI18nKey, JsonSchema, Translator, UISchemaElement} from '@jsonforms/core'

export const getI18nDescription: (translator: Translator, element: UISchemaElement, path: string, resolvedSchema?: JsonSchema) => string | undefined =
  (translator, element, path, resolvedSchema) => {
    const description = resolvedSchema?.description
    const i18nKey = getI18nKey(resolvedSchema, element, path, 'description')
    // @ts-ignore
    return i18nKey ? translator(i18nKey, description) : undefined
  }
