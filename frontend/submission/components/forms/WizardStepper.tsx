import Box from '@mui/material/Box'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import React from 'react'

import {steps} from '../../schema'
import {useWizardState} from '../../state'


export const WizardStepper =  () => {

  const { currentStep,gotoStep } = useWizardState()

  return (
    <Box sx={{width: '100%'}}>
      <Stepper activeStep={currentStep} alternativeLabel>
        {steps.map(({name, stepLabel: label}, index) => (
          <Step key={name} onClick={() => gotoStep(index)}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}
