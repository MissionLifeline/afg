import {Lock} from '@mui/icons-material'
import {useTheme} from '@mui/material'
import type {NextPage} from 'next'
import {useRouter} from 'next/router'
import React, {useEffect} from 'react'
import {useTranslation} from 'react-i18next'

import {LoadingSpinner} from '../components/layout'
import AlertBox from '../components/layout/AlertBox'
import AppLayout from '../components/layout/AppLayout'
import {TokenForm} from '../components/user'
import {useLanguageService, useTokenStore} from '../state'

const Home: NextPage = () => {
    const {t} = useTranslation()
    const theme = useTheme()
    const {replace, isReady} = useRouter()
    const {userId, token} = useTokenStore()

    useLanguageService()

    useEffect(() => {
        if (!(userId && token)) return
        replace({pathname: '/wizard', query: {token}})
    }, [userId, token, replace])


    return (<AppLayout>
        <>
            <LoadingSpinner loading={!isReady}/>
            <AlertBox
                color={theme.palette.success.main}
                title={t('first_visit_title')}
                description={t('want_to_use_token_question')}
                icon={Lock}>
                <TokenForm/>
            </AlertBox>
        </>
    </AppLayout>)
}

export default Home
