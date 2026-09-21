/**
 * Session State Store
 * 
 * NOTE ON SESSION ARCHITECTURE:
 * localStorage is utilized here for client-side session state persistence during development.
 * This client-side store does NOT claim to be the final production security boundary.
 * Authoritative session validation, token verification, and lifecycle enforcement
 * are strictly executed by the backend on every API request.
 * 
 * Refresh-token mechanisms remain UNKNOWN and are not implemented.
 */
import { type UserSummary, type Role } from '@/types/domain';
import { setAuthToken } from '@/services/api/client';

export interface AuthState {
  token: string | null;
  user: UserSummary | null;
  role: Role | null;
  isAuthenticated: boolean;
}

const TOKEN_KEY = 'roadis_auth_token';
const USER_KEY = 'roadis_auth_user';

function getInitialState(): AuthState {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_KEY);
    const user: UserSummary | null = userRaw ? JSON.parse(userRaw) : null;

    if (token) {
      setAuthToken(token);
      return {
        token,
        user,
        role: user ? user.role : null,
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.warn('Gagal membaca sesi lokal auth:', error);
  }

  setAuthToken(null);
  return {
    token: null,
    user: null,
    role: null,
    isAuthenticated: false,
  };
}

let currentState: AuthState = getInitialState();
const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

export const authStore = {
  getState(): AuthState {
    return currentState;
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  setSession(token: string, user: UserSummary): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Gagal menyimpan sesi auth ke localStorage:', e);
    }

    setAuthToken(token);
    currentState = {
      token,
      user,
      role: user.role,
      isAuthenticated: true,
    };
    notify();
  },

  logout(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.warn('Gagal membersihkan sesi auth di localStorage:', e);
    }

    setAuthToken(null);
    currentState = {
      token: null,
      user: null,
      role: null,
      isAuthenticated: false,
    };
    notify();
  },
};
