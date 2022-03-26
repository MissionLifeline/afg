import {ListItemIcon, ListItemText, MenuItem, Select} from '@mui/material'
import { countryCodeEmoji  } from 'country-code-emoji'
import i18next from 'i18next'
import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'

import {resources} from '../../i18n'

const flagMapping = {
  en: 'GB',
  eng: 'GB',
  ger: 'DE'
}

const Flag = ({langCode}: {langCode: string}) => {
  const [emoji, setEmoji] = useState('')

  useEffect(() => {
    try {
      // @ts-ignore
      const countryCode = (flagMapping[langCode] || langCode).toUpperCase()
      const emoji = countryCodeEmoji(countryCode)
      if(emoji) setEmoji(emoji)
    } catch (e) {}
  }, [langCode])

  return <>{emoji}</>
}


export const LanguageSelection = () => {
  const { t, i18n: {language }} = useTranslation()
  const languages = Object.keys(resources)

  const selectedLang = languages.includes(language) ? language : 'en'

  return  (
    <Select value={selectedLang} renderValue={v => <Flag langCode={v} />}>
     { languages.map( lang => (
         <MenuItem dense value={lang}  key={lang} onClick={() => i18next.changeLanguage(lang)} >
           <ListItemIcon><Flag langCode={lang}/></ListItemIcon>
           <ListItemText>{t(lang)}</ListItemText>
         </MenuItem>
       ))
     }
    </Select>
  )
}
