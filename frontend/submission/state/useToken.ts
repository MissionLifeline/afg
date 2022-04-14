import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'

const parseQuery: (asPath: string) => URLSearchParams = (asPath: string) => new URLSearchParams(asPath.split(/\?/)[1])
export const useToken: () => string | undefined | null = () => {
  const {asPath} = useRouter()
  const [token, setToken] = useState<string | undefined | null>()
  useEffect(() => {
    const q = parseQuery(asPath)
    const t = q.get('token')
    setToken(t)
  }, [asPath, setToken])

  return token
}
