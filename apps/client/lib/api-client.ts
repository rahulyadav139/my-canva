import axios from 'axios';

import { AppError, ErrorCode } from '@repo/shared/errors';

import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

export interface ApiClientConfig extends AxiosRequestConfig {
  correlationId?: string;
  skipErrorHandling?: boolean;
}

console.log(process.env.NEXT_PUBLIC_API_URL, 'process.env.NEXT_PUBLIC_API_URL');

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || '') {
    console.log(baseURL, 'baseURL');
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Response interceptor - Handle errors globally
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        return this.handleAxiosError(error);
      }
    );
  }

  private handleAxiosError(error: AxiosError): Promise<never> {
    const url = error.config?.url || 'unknown';
    const method = error.config?.method?.toUpperCase() || 'UNKNOWN';

    let customError: AppError;

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      const errorData = data as {
        message?: string;
        error?: string;
        code?: ErrorCode;
      };
      const message = errorData?.message || errorData?.error || error.message;

      const context = {
        url,
        method,
        status,
        responseData: errorData,
        requestData: error.config?.data,
      };

      switch (status) {
        case 400:
          customError = AppError.validation(message || 'Bad request', context);
          break;

        case 401:
          customError = AppError.unauthorized(
            message || 'Authentication required',
            context
          );
          break;
        case 403:
          customError = AppError.forbidden(
            message || 'Insufficient permissions',
            context
          );
          break;
        case 404:
          customError = AppError.notFound(
            message || 'Resource not found',
            context
          );
          break;
        case 422:
          customError = AppError.validation(
            message || 'Validation failed',
            context
          );
          break;
        case 429:
          customError = new AppError(
            message || 'Too many requests',
            ErrorCode.TOO_MANY_REQUESTS,
            429,
            true,
            context
          );
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          customError = new AppError(
            message || 'Server error',
            ErrorCode.INTERNAL_ERROR,
            status,
            true,
            context
          );
          break;
        default:
          customError = new AppError(
            message || 'Request failed',
            status >= 500 ? ErrorCode.INTERNAL_ERROR : ErrorCode.CLIENT_ERROR,
            status,
            true,
            context
          );
      }
    } else if (error.request) {
      // Request was made but no response received
      const context = {
        url,
        method,
        code: error.code,
        timeout: error.config?.timeout,
      };

      if (error.code === 'ECONNABORTED') {
        customError = AppError.network('Request timeout', context);
      } else if (error.code === 'ERR_NETWORK') {
        customError = AppError.network(
          'Network error - unable to connect to server',
          context
        );
      } else {
        customError = AppError.network('Network error', context);
      }
    } else {
      // Something else happened
      customError = new AppError(
        'An unexpected error occurred',
        ErrorCode.UNKNOWN,
        500,
        false,
        {
          url,
          method,
          originalError: error.message,
        }
      );
    }

    console.log('test', customError);

    // Log error with correlation ID
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ [${method} ${url}:`, customError);
    }

    // Don't handle error if explicitly skipped
    if (!(error.config as ApiClientConfig)?.skipErrorHandling) {
      //   errorService.captureError(customError);
    }

    return Promise.reject(customError);
  }

  // Method to get correlation ID from last request (useful for debugging)
  getLastCorrelationId(): string | null {
    return (
      (this.axiosInstance.defaults.headers['x-correlation-id'] as string) ||
      null
    );
  }

  // Generic request method
  async request<T = unknown>(config: ApiClientConfig): Promise<T> {
    const response = await this.axiosInstance.request<T>(config);
    return response.data;
  }

  // HTTP methods
  async get<T = unknown>(url: string, config?: ApiClientConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: ApiClientConfig
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: ApiClientConfig
  ): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: ApiClientConfig
  ): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T = unknown>(url: string, config?: ApiClientConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  // Method to set auth token
  setAuthToken(token: string | null) {
    if (token) {
      this.axiosInstance.defaults.headers.common['Authorization'] =
        `Bearer ${token}`;
    } else {
      delete this.axiosInstance.defaults.headers.common['Authorization'];
    }
  }

  // Method to get the axios instance for advanced usage
  getInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();
