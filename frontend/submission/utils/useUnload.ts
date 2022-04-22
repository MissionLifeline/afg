import * as React from 'react'

export const useUnload = (fn: (e: Event) => any, deps: any[] = []) => {
  const cb = React.useRef(fn)

  React.useEffect(() => {
    const onUnload = cb.current
    console.log('addEventListener', onUnload)
    window.addEventListener('beforeunload', onUnload)
    return () => {
      console.log('removeEventListener', onUnload)
      window.removeEventListener('beforeunload', onUnload)
    }
  }, deps.concat(cb))
}
