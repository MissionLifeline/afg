
const FORM_PREFIX = 'form_'

export const formNamespace = (name: string) => `${FORM_PREFIX}${name}`

export const isFormNamespace = (ns: string) => ns.startsWith(FORM_PREFIX)

export const stripFormPrefix = (t: string) => t.length > FORM_PREFIX.length ? t.substring(FORM_PREFIX.length)  : t
