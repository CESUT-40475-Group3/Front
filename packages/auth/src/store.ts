import { createStore } from 'zustand'
import Cookies from 'js-cookie'
import { isBrowser } from '@nobitex/utils/helpers/general.js'
import { TOKEN_KEY } from '@nobitex/utils/constants.js'

import { IAuthStore } from './types'

const authStore = createStore<IAuthStore>(set => ({
  isAuthenticated: isBrowser() ? !!(localStorage.getItem(TOKEN_KEY) || Cookies.get(TOKEN_KEY)) : false,
  token: isBrowser() ? ((localStorage.getItem(TOKEN_KEY) || Cookies.get(TOKEN_KEY)) ?? null) : null,
  setToken: token => {
    Cookies.set(TOKEN_KEY, token)
    set(state => ({ ...state, token, isAuthenticated: true }))
  },
  removeToken: () => {
    Cookies.remove(TOKEN_KEY)
    set(state => ({ ...state, token: null, isAuthenticated: false }))
  },
}))

export { authStore }
