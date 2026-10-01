export interface SettingsWilayah {
  id: number;
  nama: string;
  tipe: string;
}

export interface SettingsAccount {
  id: number;
  name: string;
  email: string;
  role: string;
  wilayah_id?: number | null;
  wilayah?: SettingsWilayah | null;
  status: string;
}

export type ThemePreference = 'light' | 'system' | 'dark';
export type DisplayDensityPreference = 'comfortable' | 'compact';
export type MapDefaultViewPreference = 'standard' | 'satellite';
export type ReportDisplayPreference = 'comfortable' | 'compact';

export interface SettingsPreferences {
  notification_sound_enabled: boolean;
  notification_report_enabled: boolean;
  notification_status_enabled: boolean;
  notification_chat_enabled: boolean;
  theme: ThemePreference;
  display_density: DisplayDensityPreference;
  map_default_view: MapDefaultViewPreference;
  map_show_labels: boolean;
  report_display_preference: ReportDisplayPreference;
}

export interface SettingsSecurity {
  last_login_at?: string | null;
  has_active_session: boolean;
}

export interface SettingsData {
  account: SettingsAccount;
  preferences: SettingsPreferences;
  security: SettingsSecurity;
}

export interface BackendSettingsResponse {
  status: string;
  message: string;
  data: SettingsData;
}

export interface UpdateSettingsPayload {
  notification_sound_enabled?: boolean;
  notification_report_enabled?: boolean;
  notification_status_enabled?: boolean;
  notification_chat_enabled?: boolean;
  theme?: ThemePreference;
  display_density?: DisplayDensityPreference;
  map_default_view?: MapDefaultViewPreference;
  map_show_labels?: boolean;
  report_display_preference?: ReportDisplayPreference;
}

export interface LogoutAllResponse {
  status: string;
  message: string;
}

export interface SystemHealthData {
  status: string;
  service: string;
  version: string;
  database: string;
}

export interface BackendSystemInfoResponse {
  status: string;
  data: {
    application: string;
    version: string;
    environment: string;
    description: string;
  };
}
