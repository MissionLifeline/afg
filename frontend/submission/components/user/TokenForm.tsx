import {Send} from '@mui/icons-material'
import {Box, FormControl, IconButton, TextField} from '@mui/material'
import {useRouter} from 'next/router'
import React, {FunctionComponent, useCallback, useEffect, useState} from 'react'

import {useToken} from '../../state'
import {LoadingSpinner} from '../layout'


export const TokenForm: FunctionComponent = () => {
  const {replace} = useRouter()
  const queryToken = useToken()
  const [token, setToken] = useState(queryToken || '')
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!queryToken) return
    setToken(queryToken)
  }, [queryToken])

  const openWithToken = useCallback(
    (e) => {
      e.preventDefault()
      setLoading(true)
      replace({pathname: '/wizard', query: {token}})
    },
    [token, replace, setLoading])
  return (
    <Box textAlign='center' sx={{padding: '1em'}}>
      <form onSubmit={openWithToken}>
        <FormControl>
          <TextField label={'token'} value={token} onChange={e => setToken(e.target.value)}/>
        </FormControl>
        <IconButton type={'submit'}><Send/></IconButton>
      </form>
      {loading && <LoadingSpinner loading={loading}/>}
    </Box>
  )
}
