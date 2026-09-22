import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api/client';
import { type Report, type ReportStatus, type Severity } from '@/types/domain';

export interface BackendDashboardStatsResponse {
  status: string;
  message: string;
  data: {
    total_laporan: number;
    total_menunggu: number;
    total_proses: number;
    total_selesai: number;
    total_ditolak: number;
  };
}

export interface BackendLaporanItem {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  user_id: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  wilayah_id: number;
  wilayah?: {
    id: number;
    nama: string;
    tipe: string;
  };
  jenis_jalan: string;
  judul: string;
  deskripsi: string;
  latitude: number;
  longitude: number;
  image_url: string;
  tipe_kerusakan: string;
  status: string;
  ditugaskan_ke: string;
  foto_bukti: string;
  catatan_admin: string;
}

export interface BackendLaporanResponse {
  status: string;
  message: string;
  data: BackendLaporanItem[];
  total: number;
}

/**
 * Normalizes backend LaporanKerusakan model into the frontend domain Report model.
 */
export function normalizeBackendReport(item: BackendLaporanItem): Report {
  let severity: Severity = 'sedang';
  const tipeLower = (item.tipe_kerusakan || '').toLowerCase();
  const descLower = (item.deskripsi || '').toLowerCase();
  const titleLower = (item.judul || '').toLowerCase();

  // Infer reasonable severity for UI display based on damage description if available
  if (
    tipeLower.includes('parah') ||
    tipeLower.includes('amblas') ||
    descLower.includes('parah') ||
    descLower.includes('longsor') ||
    titleLower.includes('parah') ||
    titleLower.includes('amblas')
  ) {
    severity = 'berat';
  } else if (tipeLower.includes('ringan') || descLower.includes('ringan')) {
    severity = 'ringan';
  }

  const normalizedStatus = (item.status.toLowerCase() as ReportStatus) || 'menunggu';

  return {
    id: item.ID,
    userId: item.user_id,
    wilayahId: item.wilayah_id,
    title: item.judul,
    description: item.deskripsi,
    latitude: item.latitude,
    longitude: item.longitude,
    imageUrl: item.image_url,
    status: normalizedStatus,
    createdAt: item.CreatedAt,
    updatedAt: item.UpdatedAt,
    roadAuthority: item.jenis_jalan === 'desa' ? 'desa' : 'kabupaten',
    damageType: item.tipe_kerusakan,
    severity,
    roadName: item.wilayah?.nama ? `Desa ${item.wilayah.nama}` : undefined,
    handlingNote: item.catatan_admin,
    repairEvidenceUrl: item.foto_bukti,
  };
}

/**
 * Hook to fetch verified KPI stats from GET /api/admin/dashboard
 */
export function useAdminDashboardStats() {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get<BackendDashboardStatsResponse>('/admin/dashboard');
      return response.data;
    },
  });
}

/**
 * Hook to fetch verified reports from GET /api/admin/laporan
 */
export function useAdminLaporan(options?: {
  status?: string;
  search?: string;
  limit?: number;
  page?: number;
}) {
  return useQuery({
    queryKey: ['admin', 'laporan', options],
    queryFn: async () => {
      const params: Record<string, string | number> = {};
      if (options?.status) params['status'] = options.status;
      if (options?.search) params['search'] = options.search;
      if (options?.limit) params['limit'] = options.limit;
      if (options?.page) params['page'] = options.page;

      const response = await apiClient.get<BackendLaporanResponse>('/admin/laporan', { params });
      return {
        reports: (response.data || []).map(normalizeBackendReport),
        total: response.total || 0,
      };
    },
  });
}
