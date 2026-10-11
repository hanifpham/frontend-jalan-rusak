import { type Role } from './domain';

export type WilayahType = 'desa' | 'kabupaten' | 'provinsi' | 'nasional';

export interface SuperadminWilayah {
  id: number;
  ID?: number;
  nama: string;
  tipe: WilayahType | string;
  created_at?: string;
  updated_at?: string;
}

export interface SuperadminUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  wilayah_id?: number | null;
  wilayah?: SuperadminWilayah | null;
  profile_photo?: string | null;
  phone?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SuperadminUsersResponse {
  status: string;
  data: {
    users: SuperadminUser[];
    page: number;
    limit: number;
    total: number;
    total_data?: number;
  };
}

export interface SuperadminWilayahResponse {
  status: string;
  data: SuperadminWilayah[];
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
  wilayah_id?: number | null;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
  wilayah_id?: number | null;
}

export interface CreateWilayahPayload {
  nama: string;
  tipe: WilayahType;
}

export interface UpdateWilayahPayload {
  nama: string;
  tipe: WilayahType;
}
