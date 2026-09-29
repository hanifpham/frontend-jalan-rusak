/**
 * Self Profile Types & DTOs
 * Strictly derived from backend controllers: `controllers/profile_controller.go`
 * Endpoints:
 * - GET /api/profile
 * - PUT /api/profile
 * - PUT /api/profile/password
 * - PUT /api/profile/avatar
 * - DELETE /api/profile/avatar
 */

export interface ProfileWilayah {
  ID?: number;
  id?: number;
  nama: string;
  tipe?: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  wilayah_id?: number | null;
  wilayah?: ProfileWilayah | null;
  avatar_url?: string | null;
  last_login_at?: string | null;
}

export interface BackendProfileResponse {
  status: string;
  message: string;
  data: UserProfile;
}

export interface UpdateProfilePayload {
  name: string;
  phone?: string | null;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}
