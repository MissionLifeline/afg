import zustand from 'zustand'
import { v4 as uuid } from 'uuid'

/** See doc/src/architecture/user-session **/

// In future we may use the users keyId as userId.
// For now it is only used to bind the token to an device.
function loadOrGenerateUserId() {
  // TODO: check if userId is stored in localstore && use it. If not, store the new generated userId.
  return uuid()
}

type TokenState = {
  token: string|undefined
  setToken: (token: string) => void
  userId: string|undefined
  getSetUserId: () => string|undefined
}

export const useTokenStore = zustand<TokenState>((set, get) => ({
  token: undefined,
  setToken: token => set({token}),
  userId: undefined,
  getSetUserId: () => {if(!get().userId)
	                 set({userId: loadOrGenerateUserId()})
	               return get().userId}
}))

