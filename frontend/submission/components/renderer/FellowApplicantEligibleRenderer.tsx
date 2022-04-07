import {JsonSchema} from '@jsonforms/core'
import {withJsonFormsControlProps} from '@jsonforms/react'
import React, { useEffect, useState } from 'react'
import {useTranslation} from 'react-i18next'

import {useArmoredDatastore} from '../../state'

type FellowApplicantEligibleRendererProps = {
  data: any
  handleChange(path: string, value: any): void
  path: string
  label: string
  schema: JsonSchema
  visible?: boolean
}

const FellowApplicantEligibleRenderer = React.memo(
  ({data, handleChange, path}: FellowApplicantEligibleRendererProps) => {
    const {t} = useTranslation()

    const [eligible, setEligible] = useState(data)
    useEffect(() => {
      handleChange(path, eligible)
    }, [handleChange, path, eligible])

    const m = path.match(/^fellowApplicantFamilyMembers.(\d+).eligible$/)
    if (m && m[1]) {
      const index = Number(m[1])
      const {formData} = useArmoredDatastore()
      const applicant = formData?.fellowApplicants?.fellowApplicantFamilyMembers?.[index]
      if (applicant && applicant.relation) {
        const eligible_ =
          // sons no older than 17.5 years
          (applicant.relation === 'son' && applicant.dateOfBirth && new Date(applicant.dateOfBirth) > new Date(Date.now() - 17.5 * 365 * 24 * 60 * 60 * 1000))
          // unmarried daughters
          || (applicant.relation == 'daughter' && applicant.maritalStatus == 'single')
          // elderly parents
          || (applicant.relation == 'parent' && applicant.fragile)
          // care-requiring uncle/aunt
          || (applicant.relation == 'uncleAunt' && applicant.requiresCare)
        if (eligible !== eligible_) {
          setEligible(eligible_)
        }
      }
    } else {
      throw new Error('unable to retrieve index from path')
    }

    return eligible !== false ?
      <> </> :
      <p>{t('fellow_applicants.not_eligible')}</p>
  }
)

export default withJsonFormsControlProps(FellowApplicantEligibleRenderer)
