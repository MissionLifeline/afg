import {useLanguageService} from '../state'

export const TranslationLoader = ({ children }: {children: React.ReactChild | React.ReactChildren}) => {
    const { isReady } = useLanguageService()

    return isReady ? children : null
}