import { useState } from 'react'
import { JsonForms } from '@jsonforms/react'
import schema from '../../schema/fellowApplicants.json'
//import uischema from '../uischema/todo'
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers'
//import {useTranslation} from "react-i18next"

const initialData = {
};

const renderers = [
  ...materialRenderers,
  //register custom renderers
];

/** This is a first version of the `Part 4` of the questionnaire.
 *  See: `Online Tool Spezialfälle Vorschlag abzufragende Daten und Abfolge.docx`
 *  TODO: We should probably reuse the Form for each fellowApplicantFamilyMember from `schema/general.json`
 **/
const FormFellowApplicants = () => {
  const [data, setData] = useState<any>(initialData);
  //const { t } = useTranslation()

  return (
    <JsonForms
      schema={schema}
      data={data}
      renderers={renderers}
      cells={materialCells}
      onChange={({errors, data}) => setData(data)}
    />
  )
}

export default FormFellowApplicants
