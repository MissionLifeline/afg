import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'

const parseQuery: (asPath: string) => URLSearchParams =  (asPath:string) =>  new URLSearchParams(asPath.split(/\?/)[1])
export const useToken: () => string | null = () => {
    const {asPath } = useRouter()
    const [token, setToken] = useState<string| undefined>()
    useEffect(() => {
        const q = parseQuery(asPath)
       const t = q.get('token')
        if(t) setToken(t)
    }, [asPath, setToken])

    return token || null
}