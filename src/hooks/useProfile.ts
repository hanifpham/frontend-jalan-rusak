import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api/client';
import { useAuth } from '@/features/auth/useAuth';
import {
  type BackendProfileResponse,
  type UserProfile,
  type UpdateProfilePayload,
  type ChangePasswordPayload,
} from '@/types/profile';

export const PROFILE_QUERY_KEY = 'user_profile';

/**
 * Hook to fetch current user's profile from GET /api/profile
 */
export function useProfile() {
  const { isAuthenticated } = useAuth();

  return useQuery<UserProfile, Error>({
    queryKey: [PROFILE_QUERY_KEY],
    queryFn: async () => {
      const response = await apiClient.get<BackendProfileResponse>('/profile');
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Mutation hook to update profile name & phone via PUT /api/profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const response = await apiClient.put<BackendProfileResponse>('/profile', payload);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData([PROFILE_QUERY_KEY], data);
      updateUser({
        nama: data.name,
        phone: data.phone,
      });
    },
  });
}

/**
 * Mutation hook to change user password via PUT /api/profile/password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      const response = await apiClient.put<{
        status: string;
        message: string;
      }>('/profile/password', payload);
      return response;
    },
  });
}

/**
 * Mutation hook to upload avatar via PUT /api/profile/avatar
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiClient.put<{
        status: string;
        message: string;
        data: {
          avatar_url: string;
        };
      }>('/profile/avatar', formData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
      updateUser({
        profilePhoto: data.avatar_url,
        avatar_url: data.avatar_url,
      });
    },
  });
}

/**
 * Mutation hook to delete avatar via DELETE /api/profile/avatar
 */
export function useDeleteAvatar() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete<{
        status: string;
        message: string;
      }>('/profile/avatar');
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
      updateUser({
        profilePhoto: undefined,
        avatar_url: undefined,
      });
    },
  });
}
