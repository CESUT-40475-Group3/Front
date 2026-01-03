export interface IAuthStore {
  token: string | null
  isAuthenticated: boolean
  setToken: (token: string) => void
  removeToken: () => void
}
