import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api/client';
import {
  type SuperadminWilayah,
  type SuperadminWilayahResponse,
  type CreateWilayahPayload,
  type UpdateWilayahPayload,
} from '@/types/superadmin';

export function useSuperadminWilayah() {
  return useQuery({
    queryKey: ['superadmin', 'wilayah'],
    queryFn: async () => {
      const response = await apiClient.get<SuperadminWilayahResponse>('/superadmin/wilayah');
      return response.data || [];
    },
  });
}

export function useCreateWilayah() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateWilayahPayload) => {
      const response = await apiClient.post<{
        status: string;
        message: string;
        data: SuperadminWilayah;
      }>('/superadmin/wilayah', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'wilayah'] });
    },
  });
}

export function useUpdateWilayah() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateWilayahPayload }) => {
      const response = await apiClient.put<{
        status: string;
        message: string;
        data: SuperadminWilayah;
      }>(`/superadmin/wilayah/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'wilayah'] });
    },
  });
}

export function useDeleteWilayah() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.delete<{
        status: string;
        message: string;
      }>(`/superadmin/wilayah/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'wilayah'] });
    },
  });
}
