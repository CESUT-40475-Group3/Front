// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginRequest, SignupRequest } from '@/types/api';
// import { setToken, removeToken, getToken, USE_MOCK_API, getUserIdFromToken } from '@/lib/api';
import { setToken, removeToken, getToken } from '@/lib/api';
import { mockApiClient } from '@/lib/mockApi';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
  setSession: (payload: { user: User; token: string }) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true });
        try {
          const response = await mockApiClient.login(
            credentials.email,
            credentials.password
          );

          setToken(response.token);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      signup: async (data: SignupRequest) => {
        set({ isLoading: true });
        try {
          const response = await mockApiClient.signup(
            data.name,
            data.email,
            data.password
          );

          setToken(response.token);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        removeToken();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setSession: ({ user, token }) => {
        setToken(token);
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      initializeAuth: () => {
        const token = getToken();
        if (token && get().user) {
          set({ isAuthenticated: true, token });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
