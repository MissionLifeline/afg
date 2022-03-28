
export type SingleFormEntryTranslation = string | any

export type FormTranslation =  { [k: string]: SingleFormEntryTranslation }

export type LocalizedFormTranslation = {
  [k in LanguageKeys]: FormTranslation
}

export type LocalizedFormsTranslation = {
  [k in LanguageKeys]: FormTranslation
}


