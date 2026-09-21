import { useSyncExternalStore } from 'react';
import { authStore, type AuthState } from './authStore';
import { type UserSummary } from '@/types/domain';

export function useAuth(): AuthState & {
  login: (token: string, user: UserSummary) => void;
  logout: () => void;
} {
  const state = useSyncExternalStore(
    authStore.subscribe,
    authStore.getState,
    authStore.getState
  );

  return {
    ...state,
    login: authStore.setSession,
    logout: authStore.logout,
  };
}
