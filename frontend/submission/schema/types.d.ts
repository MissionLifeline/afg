import {JsonSchema, Scopable, UISchemaElement} from '@jsonforms/core'

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

export type ScopeFn = (s: string) => string

export type UISchemaOverrides = (scopeFn: ScopeFn) => (UISchemaElement & Scopable)[]

