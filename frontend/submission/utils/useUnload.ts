import * as React from 'react'

export const useUnload = (onUnload: (e: Event) => any) => {

  React.useEffect(() => {
    window.addEventListener('beforeunload', onUnload)
    return () => {
      window.removeEventListener('beforeunload', onUnload)
    }
  }, [onUnload])
}
