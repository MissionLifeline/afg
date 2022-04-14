import {useToken} from './useToken'
import {useUserIdStore} from './useUserIdStore'

export const useTokenStore = () => {
  const token = useToken()
  const userIdState = useUserIdStore()
  return {
    ...userIdState,
    token
  }

}