import create from 'zustand'

import {steps} from '../schema'

export interface AppConfigState {
  currentStep: number
  stepLength: number
  prevStep: () => void
  nextStep: () => void
  gotoStep: (step: number) => void
}

export const useWizardState = create<AppConfigState>(set => ({
  currentStep: 0,
  stepLength: steps.length,
  prevStep: () => set(({currentStep }) => ({currentStep:  0 < currentStep ? currentStep - 1  : currentStep }) ),
  nextStep: () => set(({currentStep, stepLength}) => ({currentStep:  stepLength - 1 > currentStep ? currentStep + 1  : currentStep }) ),
  gotoStep: step => set( ({currentStep, stepLength}) => ({currentStep: stepLength > step ?  step  : currentStep } ))

}))
