import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import {Box, Button} from '@mui/material'
import React from 'react'
import {useTranslation} from 'react-i18next'

import {steps} from '../../schema'
import {useWizardState} from '../../state'
import SubmitFormButton from '../forms/SubmitFormButton'

type PageFooterProps = Record<string, never>

const PageFooter = ({}: PageFooterProps) => {
  const {t} = useTranslation()
  const {currentStep, nextStep, prevStep} = useWizardState()
  return <Box display='flex' flexDirection='row' justifyContent={'space-around'}>
    {currentStep > 0 &&
      <Button variant='contained' color='secondary'
              onClick={prevStep}
              title={t('prevStep_title')}
              startIcon={<NavigateBeforeIcon/>}
      >{t('prevStep')}</Button>}
    {currentStep < steps.length - 1
      ? <Button variant='contained' color='primary'
                onClick={nextStep}
                title={t('nextStep_title')}
                endIcon={<NavigateNextIcon/>}
      >{t('nextStep')}</Button>
      : <SubmitFormButton/>
    }
  </Box>
}


export default PageFooter
