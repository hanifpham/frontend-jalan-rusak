import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api/client';
import {
  type SuperadminUser,
  type SuperadminUsersResponse,
  type CreateUserPayload,
  type UpdateUserPayload,
} from '@/types/superadmin';

export interface SuperadminUsersFilter {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}

export function useSuperadminUsers(filters?: SuperadminUsersFilter) {
  return useQuery({
    queryKey: ['superadmin', 'users', filters],
    queryFn: async () => {
      const params: Record<string, string | number> = {};
      if (filters?.page) params.page = filters.page;
      if (filters?.limit) params.limit = filters.limit;
      if (filters?.role && filters.role !== 'all') params.role = filters.role;
      if (filters?.search && filters.search.trim()) params.search = filters.search.trim();

      const response = await apiClient.get<SuperadminUsersResponse>('/superadmin/users', { params });
      return response.data;
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateUserPayload) => {
      const response = await apiClient.post<{
        status: string;
        message: string;
        data: SuperadminUser;
      }>('/superadmin/users', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateUserPayload }) => {
      const response = await apiClient.put<{
        status: string;
        message: string;
        data: SuperadminUser;
      }>(`/superadmin/users/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'users'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.delete<{
        status: string;
        message: string;
      }>(`/superadmin/users/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'users'] });
    },
  });
}
