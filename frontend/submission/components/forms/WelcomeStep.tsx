import { EmojiPeople} from '@mui/icons-material'
import {Box, Divider, useTheme} from '@mui/material'
import React, {useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import {PluggableList} from 'react-markdown/lib/react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeSanitize from 'rehype-sanitize'

import {useIs_TranslatorQuery} from '../../api/generates'
import {useTokenStore} from '../../state'
import AlertBox from '../layout/AlertBox'
import {MDEditorMarkdown} from '../renderer/MDEditor'
import CommonFormTranslationHelper from './CommonFormTranslationHelper'

const WelcomeStep = () => {
  const {t} = useTranslation()
  const {token, userId} = useTokenStore()
  const {data: data_is_translator} = useIs_TranslatorQuery({auth: {token, userId}},
    {
      enabled: Boolean(token && userId),
      staleTime: 60 * 60 * 1000
    })
  const enableTranslationHelper = data_is_translator?.is_translator

  const rehypePlugins = useMemo<PluggableList>(() => [[rehypeSanitize],[rehypeExternalLinks, { target: '_blank' }]], [])
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
        source={t('welcome_step_content_markdown')}
            rehypePlugins={rehypePlugins}/>
      </Box>
    </AlertBox>
    {enableTranslationHelper && <>
      <Divider style={{marginTop: '2em', marginBottom: '2em'}}/>
      <CommonFormTranslationHelper />
    </>}

  </Box>
}

export default WelcomeStep
