import {RuleEffect, Scopable, UISchemaElement} from '@jsonforms/core'

export const showOnTrue: (conditionalScopes: (string | string[]), hiddenScopes: (string | string[])) => (UISchemaElement & Scopable)[] =
  (conditionalScopes, hiddenScopes) =>
    (Array.isArray(hiddenScopes) ? hiddenScopes : [hiddenScopes]).map(hiddenScope => ({
      type: 'Control',
      scope: hiddenScope,
      rule: {
        effect: RuleEffect.SHOW,
        condition: {
          type: 'AND',
          conditions: (
            Array.isArray(conditionalScopes) ? conditionalScopes : [conditionalScopes]
          ).map(conditionalScope => ({
            //@ts-ignore
            scope: conditionalScope,
            schema: {const: true}
          })),
        }
      }
    } as (UISchemaElement & Scopable)))

export const showOnEnum: (conditionalScope: string, conditionalValues: string[], hiddenScopes: (string | string[])) => (UISchemaElement & Scopable)[] =
  (conditionalScope, conditionalValue, hiddenScopes) =>
    (Array.isArray(hiddenScopes) ? hiddenScopes : [hiddenScopes]).map(hiddenScope => ({
      type: 'Control',
      scope: hiddenScope,
      rule: {
        effect: RuleEffect.SHOW,
        condition: {
          //@ts-ignore
          scope: conditionalScope,
          schema: {enum: conditionalValue}
        }
      }
    } as (UISchemaElement & Scopable)))

export const hideOnEnum: <K extends (UISchemaElement & Scopable)>(conditionalScope: string, conditionalValues: string[], hiddenScopes: (string | string[]), other?: Partial<K>) => (UISchemaElement & Scopable)[] =
  (conditionalScope, conditionalValue, hiddenScopes, other) =>
    (Array.isArray(hiddenScopes) ? hiddenScopes : [hiddenScopes]).map(hiddenScope => ({
      type: 'Control',
      scope: hiddenScope,
      rule: {
        effect: RuleEffect.HIDE,
        condition: {
          //@ts-ignore
          scope: conditionalScope,
          schema: {enum: conditionalValue}
        }
      },
      ...other
    } as (UISchemaElement & Scopable)))
