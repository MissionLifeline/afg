import {RuleEffect, Scopable, UISchemaElement} from '@jsonforms/core'

export const showOnTrue: (conditionalScope: string, hiddenScopes: (string | string[])) => (UISchemaElement & Scopable)[] =
  (conditionalScope, hiddenScopes) =>
    (Array.isArray(hiddenScopes) ? hiddenScopes : [hiddenScopes]).map(hiddenScope => ({
      type: 'Control',
      scope: hiddenScope,
      rule: {
        effect: RuleEffect.SHOW,
        condition: {
          //@ts-ignore
          scope: conditionalScope,
          schema: {const: true}
        }
      }
    } as (UISchemaElement & Scopable)))
