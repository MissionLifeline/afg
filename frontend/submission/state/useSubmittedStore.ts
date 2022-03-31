import zustand from 'zustand'

type SubmittedState = {
  submitted: boolean
  setSubmitted: (submitted: boolean) => void
}

export const useSubmittedStore = zustand<SubmittedState>((set) => ({
  submitted: false,
  setSubmitted: submitted => set({submitted}),
}))
