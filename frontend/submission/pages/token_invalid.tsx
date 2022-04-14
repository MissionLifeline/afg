import { Lock} from '@mui/icons-material'
import {useTheme} from '@mui/material'
import type {NextPage} from 'next'
import React from 'react'
import {useTranslation} from 'react-i18next'

import AlertBox from '../components/layout/AlertBox'
import AppLayout from '../components/layout/AppLayout'
import {TokenForm} from '../components/user'


const TokenInvalid: NextPage = () => {
  const { t } = useTranslation()
  const theme  = useTheme()


  return <AppLayout>

    <AlertBox
        color={theme.palette.warning.main }
        title={t('invalid_token')}
        description={t('enter_valid_token')}
        icon={Lock}>
      <TokenForm />
    </AlertBox>

  </AppLayout>


}

export default TokenInvalid
