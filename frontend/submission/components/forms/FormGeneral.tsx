import log from 'loglevel'

import {generalUISchema} from '../../schema'
import schema from '../../schema/general.json'
import LocalizedJsonForms from './LocalizedJsonForms'


log.debug({generalUISchema})



/** This is a first version of the `Part 1` of the questionnaire.
 *  See: `Online Tool Spezialfälle Vorschlag abzufragende Daten und Abfolge.docx`
 **/
const FormGeneral = () => {

  return (
    <LocalizedJsonForms schema={schema} uischema={generalUISchema} name='general'  data={{}}/>
  )
}

export default FormGeneral
