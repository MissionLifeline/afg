import { v4 as uuid } from 'uuid'
import zustand from 'zustand'

/** See doc/src/architecture/user-session **/

// In future we may use the users keyId as userId.
// For now it is only used to bind the token to an device.
function loadOrGenerateUserId() {
  // TODO: check if userId is stored in localstore && use it. If not, store the new generated userId.
  return uuid()
}

// stub for server-side and clients w/o localStorage
const localStorage = (typeof window != 'undefined' && window.localStorage) || {
  getItem: _k => undefined,
  setItem: (_k, _v) => {},
}

type UserIdState = {
  userId: string|undefined
  getSetUserId: () => string|undefined
}

export const useUserIdStore = zustand<UserIdState>((set, get) => ({
  userId: localStorage.getItem('userId') || undefined,
  getSetUserId: () => {
    if (!get().userId) {
      // no current userId, revive from localStorage or generate a new one
      const userId = localStorage.getItem('userId') || loadOrGenerateUserId()
      localStorage.setItem('userId', userId)
      set({ userId })
    }
    return get().userId
  },
}))

