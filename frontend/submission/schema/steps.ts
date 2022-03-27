import applicationSchema from './application.json'
import fellowApplicants from './fellowApplicants.json'
import generalSchema from './general.json'
import {generalTranslation} from './generalTranslation'
import {generalUISchema} from './generalUISchema'
import risksSchema from './risks.json'
import {risksTranslation} from './risksTranslation'
import {WizardStep} from './types'


export const steps: WizardStep[] = [
  {
    name: 'general',
    stepLabel: 'About you',
    jsonschema: generalSchema,
    uiSchema: generalUISchema,
    translation: generalTranslation,
  },
  {
    name: 'risks',
    stepLabel: 'risk factors',
    jsonschema: risksSchema,
    translation: risksTranslation,
  },
  {
    name: 'application',
    stepLabel: 'formal application',
    jsonschema: applicationSchema
  },
  {
    name: 'fellowApplicants',
    stepLabel: 'fellow applicants',
    jsonschema: fellowApplicants
  }

]
