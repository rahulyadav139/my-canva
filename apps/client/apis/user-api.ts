import { apiClient } from '@/lib/api-client';
import { UserResponse, ApiResponse } from '@repo/shared/api';

export const userApi = {
  getUser: async () => {
    const response =
      await apiClient.get<ApiResponse<UserResponse>>('/users/me');
    return response.user;
  },
};
