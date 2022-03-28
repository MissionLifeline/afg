import {Scopable, UISchemaElement} from '@jsonforms/core'

export const withoutProperties  =  (schemaElements: UISchemaElement[], props: string[]) =>
  (schemaElements as any).filter(({ scope = null }) => typeof  scope === 'string' && !props.includes(scope)) as UISchemaElement[]

export const overrideScopes = (overrides: (UISchemaElement & Scopable)[], originals: UISchemaElement[]) =>
  originals.map(original => overrides.find(({scope}) => scope === (original as any).scope) || original)
