import {JsonSchema} from '@jsonforms/core'

import {camelCase2Words} from './splitCamelCase'
import {FormTranslation} from './types'

export const jsonSchema2Translation: (jsonschema: JsonSchema, withEmptyDescriptions?: boolean, separator?: string) => FormTranslation
  = (jsonschema, withEmptyDescriptions = false, separator) =>
  Object.fromEntries(
    Object.entries(jsonschema.properties || {})
      .map(([k, {description}]) =>
        [
          [k, {
            ...{ label: camelCase2Words(k, separator) },
          ...(  description
            ? { description }
            : withEmptyDescriptions
              ? { description: '' }
              : {})
          }],
        ]
      ).flat()
  )
