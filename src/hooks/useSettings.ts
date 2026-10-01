import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api/client';
import { useAuth } from '@/features/auth/useAuth';
import {
  type BackendSettingsResponse,
  type SettingsData,
  type SettingsPreferences,
  type SettingsSecurity,
  type UpdateSettingsPayload,
  type LogoutAllResponse,
  type ThemePreference,
  type DisplayDensityPreference,
  type SystemHealthData,
  type BackendSystemInfoResponse,
} from '@/types/settings';

export const SETTINGS_QUERY_KEY = 'admin_settings';
export const HEALTH_QUERY_KEY = 'system_health';
export const SYSTEM_INFO_QUERY_KEY = 'system_info';

let systemThemeMediaQuery: MediaQueryList | null = null;
let systemThemeListener: ((e: MediaQueryListEvent) => void) | null = null;

/**
 * Apply theme to document element with reactive system theme listener
 */
export function applyThemeToDOM(theme: ThemePreference): void {
  if (typeof document === 'undefined') return;

  // Clean up any existing system media query listener
  if (systemThemeMediaQuery && systemThemeListener) {
    systemThemeMediaQuery.removeEventListener('change', systemThemeListener);
    systemThemeMediaQuery = null;
    systemThemeListener = null;
  }

  if (theme === 'system') {
    if (typeof window !== 'undefined' && window.matchMedia) {
      systemThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const isSystemDark = systemThemeMediaQuery.matches;

      if (isSystemDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }

      // Dynamic reactive listener when OS appearance changes
      systemThemeListener = (e: MediaQueryListEvent) => {
        if (e.matches) {
          document.documentElement.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.setAttribute('data-theme', 'light');
        }
      };

      systemThemeMediaQuery.addEventListener('change', systemThemeListener);
    }
  } else if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    // Explicit 'light'
    document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

/**
 * Apply display density to document element
 */
export function applyDensityToDOM(density: DisplayDensityPreference): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-density', density);
}

/**
 * Audio Synthesizer for ROADIS notification chime using HTML5 Web Audio API.
 * Uses a crystal two-tone chime (D5 -> A5) without requiring external audio files.
 */
export function playNotificationSound(): void {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Note 1: 587.33 Hz (D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.2, now + 0.03);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Note 2: 880 Hz (A5) slightly overlapping
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0, now + 0.12);
    gain2.gain.linearRampToValueAtTime(0.25, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.6);
  } catch {
    // Autoplay restrictions or unsupported audio engine gracefully ignored
  }
}

export const DEFAULT_SETTINGS_PREFERENCES: SettingsPreferences = {
  notification_sound_enabled: true,
  notification_report_enabled: true,
  notification_status_enabled: true,
  notification_chat_enabled: true,
  theme: 'system',
  display_density: 'comfortable',
  map_default_view: 'standard',
  map_show_labels: true,
  report_display_preference: 'comfortable',
};

export const DEFAULT_SETTINGS_SECURITY: SettingsSecurity = {
  last_login_at: null,
  has_active_session: true,
};

export function normalizeSettingsData(data?: Partial<SettingsData> | null): SettingsData {
  return {
    account: {
      id: data?.account?.id ?? 0,
      name: data?.account?.name ?? '',
      email: data?.account?.email ?? '',
      role: data?.account?.role ?? 'admin_pemdes',
      status: data?.account?.status ?? 'active',
      wilayah_id: data?.account?.wilayah_id ?? null,
      wilayah: data?.account?.wilayah
        ? {
            id: data.account.wilayah.id,
            nama: data.account.wilayah.nama || '',
            tipe: data.account.wilayah.tipe || 'DESA',
          }
        : null,
    },
    preferences: {
      ...DEFAULT_SETTINGS_PREFERENCES,
      ...(data?.preferences || {}),
    },
    security: {
      ...DEFAULT_SETTINGS_SECURITY,
      ...(data?.security || {}),
    },
  };
}

/**
 * Hook to fetch current user's settings and preferences via GET /api/settings
 */
export function useSettings() {
  const { isAuthenticated } = useAuth();

  const query = useQuery<SettingsData, Error>({
    queryKey: [SETTINGS_QUERY_KEY],
    queryFn: async () => {
      const response = await apiClient.get<BackendSettingsResponse>('/settings');
      return normalizeSettingsData(response.data);
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  // Automatically apply theme & density when settings are loaded
  useEffect(() => {
    if (query.data?.preferences) {
      applyThemeToDOM(query.data.preferences.theme);
      applyDensityToDOM(query.data.preferences.display_density);
    }
  }, [query.data?.preferences?.theme, query.data?.preferences?.display_density]);

  return query;
}

/**
 * Mutation hook to update user preferences via PUT /api/settings
 * Supports optimistic UI with automatic rollback on error.
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation<
    SettingsData,
    Error,
    UpdateSettingsPayload,
    { previousSettings?: SettingsData }
  >({
    mutationFn: async (payload: UpdateSettingsPayload) => {
      const response = await apiClient.put<BackendSettingsResponse>('/settings', payload);
      return normalizeSettingsData(response.data);
    },
    onMutate: async (newPayload) => {
      await queryClient.cancelQueries({ queryKey: [SETTINGS_QUERY_KEY] });
      const previousSettings = queryClient.getQueryData<SettingsData>([SETTINGS_QUERY_KEY]);

      if (previousSettings) {
        queryClient.setQueryData<SettingsData>([SETTINGS_QUERY_KEY], {
          ...previousSettings,
          preferences: {
            ...previousSettings.preferences,
            ...newPayload,
          },
        });
      }

      if (newPayload.theme) {
        applyThemeToDOM(newPayload.theme);
      }
      if (newPayload.display_density) {
        applyDensityToDOM(newPayload.display_density);
      }

      return { previousSettings };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData([SETTINGS_QUERY_KEY], context.previousSettings);
        applyThemeToDOM(context.previousSettings.preferences.theme);
        applyDensityToDOM(context.previousSettings.preferences.display_density);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [SETTINGS_QUERY_KEY] });
    },
  });
}

/**
 * Mutation hook to log out of all active user sessions via POST /api/settings/logout-all
 */
export function useLogoutAllSessions() {
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  return useMutation<LogoutAllResponse, Error, void>({
    mutationFn: async () => {
      const response = await apiClient.post<LogoutAllResponse>('/settings/logout-all');
      return response;
    },
    onSuccess: () => {
      queryClient.clear();
      logout();
    },
  });
}

/**
 * Hook to check live system connectivity status via GET /api/health
 */
export function useSystemHealth() {
  return useQuery<SystemHealthData, Error>({
    queryKey: [HEALTH_QUERY_KEY],
    queryFn: async () => {
      return await apiClient.get<SystemHealthData>('/health');
    },
    retry: 1,
    refetchInterval: 30000,
  });
}

/**
 * Hook to retrieve system information via GET /api/system/info
 */
export function useSystemInfo() {
  const { isAuthenticated } = useAuth();

  return useQuery<BackendSystemInfoResponse['data'], Error>({
    queryKey: [SYSTEM_INFO_QUERY_KEY],
    queryFn: async () => {
      const res = await apiClient.get<BackendSystemInfoResponse>('/system/info');
      return res.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 30,
  });
}
