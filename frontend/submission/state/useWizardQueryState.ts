import {useRouter} from 'next/router'
import {useCallback, useEffect, useState} from 'react'

import {steps} from '../schema'
import {AppConfigState} from './useWizardState'

const stepLength = steps.length

const parseQuery: (asPath: string) => URLSearchParams =  (asPath:string) =>  new URLSearchParams(asPath.split(/\?/)[1])

export const useWizardQueryState: () => AppConfigState = () => {
  const { asPath, push, pathname } = useRouter()
  const [currentStep, setCurrentStep] = useState(0)


  useEffect(() => {
    const query = parseQuery(asPath)
    const step = query.get('step')
    console.log({query})
      const s = parseInt(step || '0')
      if(isNaN(s)) return
      setCurrentStep(s)
  }, [asPath])

  const gotoStep = useCallback(
    (newStep: number) => {
      if(newStep >= 0 && newStep < stepLength ) {
        const query = parseQuery(asPath)
        query.set('step', newStep.toString())
        console.log('new query', query)
        push(pathname, {query: Object.fromEntries( query.entries())})
      }
    },
    [ asPath, push, pathname],
  )



  return {
    currentStep,
    stepLength,
    prevStep: () => gotoStep(currentStep - 1),
    nextStep: () => gotoStep(currentStep + 1),
    gotoStep

  }
}
