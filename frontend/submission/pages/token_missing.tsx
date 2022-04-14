import { Key } from '@mui/icons-material'
import {useTheme} from '@mui/material'
import type {NextPage} from 'next'
import React from 'react'
import {useTranslation} from 'react-i18next'

import AlertBox from '../components/layout/AlertBox'
import AppLayout from '../components/layout/AppLayout'
import {TokenForm} from '../components/user'


const TokenMissing: NextPage = () => {
  const { t } = useTranslation()
  const theme  = useTheme()


  return <AppLayout>

    <AlertBox
        color={theme.palette.warning.main }
        title={t('missing_token')}
        description={t('enter_valid_token')}
        icon={Key}>
      <TokenForm />
    </AlertBox>

  </AppLayout>


}

export default TokenMissing
