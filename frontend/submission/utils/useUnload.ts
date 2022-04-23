import * as React from 'react'

export const useUnload = (onUnload: (e: Event) => any) => {

  React.useEffect(() => {
    console.log('addEventListener', onUnload)
    window.addEventListener('beforeunload', onUnload)
    return () => {
      console.log('removeEventListener', onUnload)
      window.removeEventListener('beforeunload', onUnload)
    }
  }, [onUnload])
}
