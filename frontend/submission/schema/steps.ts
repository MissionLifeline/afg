import {WizardOverride, WizardStep} from './types.d'

import generalSchema from './general.json'
import {generalTranslation} from './generalTranslation'
import {generalUISchema} from './generalUISchema'

import risksSchema from './risks.json'
import {risksTranslation} from './risksTranslation'
import {risksUISchema} from './risksUISchema'

import applicationSchema from './application.json'
import {applicationUISchema} from './applicationUISchema'

import spouseSchema from './spouse.json'
import {spouseTranslation} from './spouseTranslation'
import {spouseUISchema} from './spouseUISchema'

import fellowApplicants from './fellowApplicants.json'
import {fellowApplicantsUISchema} from './fellowApplicantsUISchema'


export const steps: WizardStep[] = [
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

