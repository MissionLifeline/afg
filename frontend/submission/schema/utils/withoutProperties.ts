import {UISchemaElement} from '@jsonforms/core'

export const withoutProperties  =  (schemaElements: UISchemaElement[], props: string[]) =>
  (schemaElements as any).filter(({ scope = null }) => typeof  scope === 'string' && !props.includes(scope)) as UISchemaElement[]
