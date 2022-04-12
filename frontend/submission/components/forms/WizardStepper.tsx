import Box from '@mui/material/Box'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import React, {useEffect} from 'react'
import {useTranslation} from 'react-i18next'

import {steps} from '../../schema'
import {useWizardQueryState} from '../../state'


export const WizardStepper =  () => {
  const { currentStep, gotoStep } = useWizardQueryState()
  const { t } = useTranslation()

  // Stepper is scrollable, scroll currentStep into view
  useEffect(() => {
    const step = typeof document != 'undefined' &&
      document.getElementById(`step-${currentStep}`)
    step && step.scrollIntoView({ behavior: 'smooth' })
  }, [currentStep])

  return (
    <Box sx={{maxWidth: '100%', overflowX: 'auto'}}>
      <Stepper activeStep={currentStep} alternativeLabel>
        {steps.map(({name, stepLabel: label}, index) => (
          <Step id={`step-${index}`} key={name} onClick={() => gotoStep(index)}>
            <StepLabel>{t(`steps.${name}`, label)}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}
