import {filterUndefOrNull} from '../utils'
import applicationSchema from './application.json'
import {applicationUISchema} from './applicationUISchema'
import fellowApplicants from './fellowApplicants.json'
import {fellowApplicantsUISchema} from './fellowApplicantsUISchema'
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
    uiSchema: applicationUISchema,
    jsonschema: applicationSchema
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
    finalStep: true
  }

]

export const buildInitialTranslation = () => Object.fromEntries(filterUndefOrNull(steps.map(({name, translation}) => translation && [name, translation] )))
