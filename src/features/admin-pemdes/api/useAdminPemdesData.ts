import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
    reporterName: item.user?.name,
    reporterEmail: item.user?.email,
    villageName: item.wilayah?.nama,
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

export interface BackendLaporanDetailResponse {
  status: string;
  message: string;
  data: BackendLaporanItem;
}

/**
 * Hook to fetch single report detail directly from verified GET /api/admin/laporan/:id
 */
export function useAdminReportDetail(id: number | string | undefined) {
  return useQuery({
    queryKey: ['admin', 'laporan', 'detail', String(id)],
    queryFn: async () => {
      if (!id) throw new Error('ID laporan tidak valid');
      const numId = Number(id);
      if (isNaN(numId) || numId <= 0) throw new Error('ID laporan tidak valid');

      // Request directly from verified endpoint: GET /api/admin/laporan/:id
      const response = await apiClient.get<BackendLaporanDetailResponse>(`/admin/laporan/${numId}`);
      if (!response.data) {
        throw new Error('Data laporan tidak ditemukan');
      }

      return {
        report: normalizeBackendReport(response.data),
        rawItem: response.data,
      };
    },
    enabled: Boolean(id),
  });
}


export interface UpdateReportStatusPayload {
  id: number | string;
  status: ReportStatus;
  catatanAdmin?: string;
  ditugaskanKe?: string;
  fotoBukti?: File | null;
}

/**
 * Hook to update report status via PUT /api/admin/laporan/:id/status
 * Supports multipart/form-data for file upload of foto_bukti to Cloudinary.
 */
export function useUpdateReportStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateReportStatusPayload) => {
      const formData = new FormData();
      formData.append('status', payload.status);
      if (payload.catatanAdmin !== undefined) {
        formData.append('catatan_admin', payload.catatanAdmin);
      }
      if (payload.ditugaskanKe !== undefined) {
        formData.append('ditugaskan_ke', payload.ditugaskanKe);
      }
      if (payload.fotoBukti) {
        formData.append('foto_bukti', payload.fotoBukti);
      }

      const response = await apiClient.put<{
        status: string;
        message: string;
        data: BackendLaporanItem;
      }>(`/admin/laporan/${payload.id}/status`, formData);

      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'laporan'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      queryClient.invalidateQueries({
        queryKey: ['admin', 'laporan', 'detail', String(variables.id)],
      });
    },
  });
}

export interface BackendChatItem {
  id: number;
  laporan_kerusakan_id: number;
  user_id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  pesan: string;
  waktu_kirim: string;
  admin_id?: number | null;
  admin?: {
    id: number;
    name: string;
    email: string;
  } | null;
  balasan?: string | null;
  waktu_balas?: string;
}

export interface BackendChatResponse {
  status: string;
  message: string;
  data: BackendChatItem[];
}

/**
 * Hook to fetch report chat history from GET /api/admin/laporan/:id/chat
 */
export function useReportChat(reportId: number | string | undefined) {
  return useQuery({
    queryKey: ['admin', 'chat', String(reportId)],
    queryFn: async () => {
      if (!reportId) return [];
      const response = await apiClient.get<BackendChatResponse>(
        `/admin/laporan/${reportId}/chat`
      );
      return response.data || [];
    },
    enabled: Boolean(reportId),
  });
}

/**
 * Hook to reply to citizen chat message via PUT /api/admin/chat/:chat_id
 */
export function useReplyChat(reportId: number | string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chatId, balasan }: { chatId: number; balasan: string }) => {
      const response = await apiClient.put<{
        status: string;
        message: string;
        data: BackendChatItem;
      }>(`/admin/chat/${chatId}`, { balasan });
      return response;
    },
    onSuccess: () => {
      if (reportId) {
        queryClient.invalidateQueries({ queryKey: ['admin', 'chat', String(reportId)] });
      }
    },
  });
}

