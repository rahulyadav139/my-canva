import { apiClient } from '@/lib/api-client';
import { LoginUserBody, RegisterUserBody } from '@repo/shared/dist/api';

export const authApi = {
  register: async (data: RegisterUserBody) => {
    return apiClient.post('/auth/register', data);
  },

  login: async (data: LoginUserBody) => {
    return await apiClient.post('/auth/login', data);
  },

  logout: async () => {
    return await apiClient.delete('/auth/logout');
  },
};
