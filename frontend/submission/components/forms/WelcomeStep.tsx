import { EmojiPeople, Info} from '@mui/icons-material'
import {Box, Divider, Paper, useTheme} from '@mui/material'
import {blue, green, grey} from '@mui/material/colors'
import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeSanitize from 'rehype-sanitize'

import {useIs_TranslatorQuery} from '../../api/generates'
import {resources} from '../../i18n'
import {useTokenStore} from '../../state'
import AlertBox from '../layout/AlertBox'
import {MDEditorMarkdown} from '../renderer/MDEditor'
import FormTranslationHelper from './FormTranslationHelper'

const WelcomeStep = () => {
  const {t, i18n: {language}} = useTranslation()
  const {token, userId} = useTokenStore()
  const {data: data_is_translator} = useIs_TranslatorQuery({auth: {token, userId}},
    {
      enabled: Boolean(token && userId),
      staleTime: 60 * 60 * 1000
    })
  const enableTranslationHelper = data_is_translator?.is_translator

  const [commonTranslation, setCommonTranslation] = useState((resources as any)[language]?.common || resources.en.common)

  const theme = useTheme()
  return <Box
      style={{minHeight: '50vh'}}
      display='flex'
      flexDirection='column'
      alignContent={'space-around'}
      justifyContent={'center'}
    >

    <AlertBox title={t('welcome_step_title')}
              description={t('welcome_step_description')}
              color={theme.palette.info.light}
              icon={EmojiPeople}>
      <Box display={'flex'} flexDirection={'row'} justifyContent='center'>
        <MDEditorMarkdown
        source={t('welcome_step_content')}
            rehypePlugins={[[rehypeSanitize,rehypeExternalLinks({ target: '_blank' })]]}/>
      </Box>
    </AlertBox>
    {enableTranslationHelper && <>
      <Divider style={{marginTop: '2em', marginBottom: '2em'}}/>
      <FormTranslationHelper
        injectToCurrentLang
        name='common'
        language={language}
        translationData={commonTranslation}
        onTranslationChange={({data}) => setCommonTranslation( data)}
      />
    </>}

  </Box>
}

export default WelcomeStep
