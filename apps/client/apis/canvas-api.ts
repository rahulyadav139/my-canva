import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@repo/shared/api';
import { CanvasResponse } from '@repo/shared/api';

export const canvasApi = {
  createCanvas: async () => {
    const response = await apiClient.post<ApiResponse<CanvasResponse>>('/canvas');
    return response.canvas;
  },
};
