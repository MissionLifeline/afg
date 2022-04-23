import applicationSchema from './application.json'
import generalSchema from './general.json'
import risksSchema from './risks.json'

const spouseSchema = {
  type: 'object',
  properties: {
    spouse: {
      type: 'array',
      items: {
        type: 'object',
        properties:{
          general: generalSchema,
          risks: risksSchema,
          application: applicationSchema
        }
      }
    }
  }
}

export default spouseSchema
