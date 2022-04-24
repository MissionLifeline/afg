import applicationSchema from './application.json'
import {applicationTranslation} from './applicationlTranslation'
import {applicationUISchema} from './applicationUISchema'
import fellowApplicants from './fellowApplicants.json'
import {fellowApplicantsUISchema} from './fellowApplicantsUISchema'
import generalSchema from './general.json'
import {generalTranslation} from './generalTranslation'
import {generalUISchema} from './generalUISchema'
import risksSchema from './risks.json'
import {risksTranslation} from './risksTranslation'
import {risksUISchema} from './risksUISchema'
import spouseSchema from './spouse'
import {spouseTranslation} from './spouseTranslation'
import {spouseUISchema} from './spouseUISchema'
import {WizardOverride, WizardStep} from './types.d'


export const steps: WizardStep[] = [
  {
    name: 'welcome',
    stepLabel: 'welcome',
    jsonschema: {},
    override: WizardOverride.WELCOME,
  },
  {
    name: 'general',
    stepLabel: 'about you',
    jsonschema: generalSchema,
    uiSchema: generalUISchema,
    translation: generalTranslation,
  },
  {
    name: 'risks',
    stepLabel: 'risk factors',
    jsonschema: risksSchema,
    translation: risksTranslation,
    uiSchema: risksUISchema
  },
  {
    name: 'application',
    stepLabel: 'formal application',
    uiSchema: applicationUISchema,
    translation: applicationTranslation,
    jsonschema: applicationSchema
  },
  {
    name: 'spouse',
    stepLabel: 'spouse',
    jsonschema: spouseSchema,
    uiSchema: spouseUISchema,
    translation: spouseTranslation,
  },
  {
    name: 'fellowApplicants',
    stepLabel: 'fellow applicants',
    jsonschema: fellowApplicants,
    uiSchema: fellowApplicantsUISchema
  },
  {
    name: 'submit',
    stepLabel: 'submit the application',
    jsonschema: {},
    override: WizardOverride.FINAL,
  }

]

