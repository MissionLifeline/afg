import {JsonSchema, UISchemaElement} from '@jsonforms/core'

import {LocalizedFormTranslation} from './utils/types'

export enum WizardOverride {
  WELCOME,
  FINAL,
}

export type WizardStep = {
  name: string
  stepLabel: string
  jsonschema: JsonSchema
  uiSchema?: UISchemaElement
  translation?: LocalizedFormTranslation
  override?: WizardOverride
}
