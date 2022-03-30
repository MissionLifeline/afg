import zustand from 'zustand'

type TokenState = {
  token: string|undefined
  setToken: (token: string) => void
}

export const useTokenStore = zustand<TokenState>(set => ({
  token: undefined,
  setToken: token => set({token})
}))

