import create from 'zustand'

export interface AppConfigState {
  currentStep: number
  stepLength: number
  nextStep: () => void
  gotoStep: (step: number) => void
}

export const useWizardState = create<AppConfigState>(set => ({
  currentStep: 0,
  stepLength: 5,
  nextStep: () => set(({currentStep, stepLength}) => ({currentStep:  stepLength - 1 > currentStep ? currentStep + 1  : currentStep }) ),
  gotoStep: step => set( ({currentStep, stepLength}) => ({currentStep: stepLength > step ?  step  : currentStep } ))

}))
