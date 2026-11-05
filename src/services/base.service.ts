import { api, apiClient, ApiError } from '@/lib/api-client';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types';

/**
 * Base Service Class
 * Provides common CRUD operations and utility methods for all services
 */
export abstract class BaseService {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * GET request
   */
  protected async get<T = unknown>(
    endpoint: string,
    config?: AxiosRequestConfig,
    options?: {
      showErrorToast?: boolean;
      customErrorMessage?: string;
      loader?: boolean;
    }
  ): Promise<T> {
    return api.get<T>(`${this.baseUrl}${endpoint}`, config, options);
  }

  /**
   * POST request
   * Properly extracts API error messages from response data
   */
  protected async post<T = unknown>(
    endpoint: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
    options?: {
      showErrorToast?: boolean;
      customErrorMessage?: string;
      loader?: boolean;
    },
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      return await api.post<T>(
        `${this.baseUrl}${endpoint}`,
        data,
        config,
        options
      );
    } catch (error: unknown) {
      // Extract API error message from error response if available
      if (
        error instanceof ApiError &&
        error.data?.message &&
        typeof error.data.message === 'string'
      ) {
        // Re-throw with actual API message
        throw new ApiError(
          error.data.message,
          error.statusCode,
          error.data,
          error.originalError
        );
      }
      throw error;
    }
  }

  /**
   * POST request (multipart/form-data)
   * Properly extracts API error messages from response data
   */
  protected async formPost<
    T = unknown,
    D extends FormData | Record<string, unknown> =
      | FormData
      | Record<string, unknown>,
  >(
    endpoint: string,
    data: D,
    options?: {
      showErrorToast?: boolean;
      customErrorMessage?: string;
      loader?: boolean;
    },
    config?: AxiosRequestConfig
  ): Promise<T> {
    const formConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...(config?.headers || {}),
        'Content-Type': 'multipart/form-data',
      },
    };

    try {
      return await api.post<T>(
        `${this.baseUrl}${endpoint}`,
        data,
        formConfig,
        options
      );
    } catch (error: unknown) {
      // Extract API error message from error response if available
      if (
        error instanceof ApiError &&
        error.data?.message &&
        typeof error.data.message === 'string'
      ) {
        // Re-throw with actual API message
        throw new ApiError(
          error.data.message,
          error.statusCode,
          error.data,
          error.originalError
        );
      }
      throw error;
    }
  }

  protected async formPut<
    T = unknown,
    D extends FormData | Record<string, unknown> =
      | FormData
      | Record<string, unknown>,
  >(
    endpoint: string,
    data: D,
    options?: {
      showErrorToast?: boolean;
      customErrorMessage?: string;
      loader?: boolean;
    },
    config?: AxiosRequestConfig
  ): Promise<T> {
    const formConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...(config?.headers || {}),
        'Content-Type': 'multipart/form-data',
      },
    };

    try {
      return await api.put<T>(
        `${this.baseUrl}${endpoint}`,
        data,
        formConfig,
        options
      );
    } catch (error: unknown) {
      // Extract API error message from error response if available
      if (
        error instanceof ApiError &&
        error.data?.message &&
        typeof error.data.message === 'string'
      ) {
        // Re-throw with actual API message
        throw new ApiError(
          error.data.message,
          error.statusCode,
          error.data,
          error.originalError
        );
      }
      throw error;
    }
  }

  protected async formPatch<
    T = unknown,
    D extends FormData | Record<string, unknown> =
      | FormData
      | Record<string, unknown>,
  >(
    endpoint: string,
    data: D,
    options?: {
      showErrorToast?: boolean;
      customErrorMessage?: string;
      loader?: boolean;
    },
    config?: AxiosRequestConfig
  ): Promise<T> {
    const formConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...(config?.headers || {}),
        'Content-Type': 'multipart/form-data',
      },
    };

    try {
      return await api.patch<T>(
        `${this.baseUrl}${endpoint}`,
        data,
        formConfig,
        options
      );
    } catch (error: unknown) {
      // Extract API error message from error response if available
      if (
        error instanceof ApiError &&
        error.data?.message &&
        typeof error.data.message === 'string'
      ) {
        // Re-throw with actual API message
        throw new ApiError(
          error.data.message,
          error.statusCode,
          error.data,
          error.originalError
        );
      }
      throw error;
    }
  }

  /**
   * Fetch POST request - returns full Axios response without data.data extraction
   * Properly handles API error messages from response.data
   */
  protected async fetchPost<T = unknown>(
    endpoint: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      return await apiClient.post<T>(
        `${this.baseUrl}${endpoint}`,
        data,
        config
      );
    } catch (error: unknown) {
      // Extract API error message from response.data if available
      if (error instanceof Error && 'response' in error && error.response) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = error.response as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const responseData = response?.data as any;

        if (responseData?.message && typeof responseData.message === 'string') {
          throw new ApiError(
            responseData.message,
            response?.status,
            responseData,
            error as any
          );
        }
      }
      // If no API message found, throw the original error
      throw error;
    }
  }

  /**
   * Fetch PUT request - returns full Axios response without data.data extraction
   * Properly handles API error messages from response.data
   */
  protected async fetchPut<T = unknown>(
    endpoint: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      return await apiClient.put<T>(`${this.baseUrl}${endpoint}`, data, config);
    } catch (error: unknown) {
      // Extract API error message from response.data if available
      if (error instanceof Error && 'response' in error && error.response) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = error.response as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const responseData = response?.data as any;

        if (responseData?.message && typeof responseData.message === 'string') {
          throw new ApiError(
            responseData.message,
            response?.status,
            responseData,
            error as any
          );
        }
      }
      throw error;
    }
  }

  /**
   * PUT request
   */
  protected async put<T = unknown>(
    endpoint: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
    options?: {
      showErrorToast?: boolean;
      customErrorMessage?: string;
      loader?: boolean;
    },
    config?: AxiosRequestConfig
  ): Promise<T> {
    return api.put<T>(`${this.baseUrl}${endpoint}`, data, config, options);
  }

  /**
   * PATCH request
   */
  protected async patch<T = unknown>(
    endpoint: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
    options?: {
      showErrorToast?: boolean;
      customErrorMessage?: string;
      loader?: boolean;
    },
    config?: AxiosRequestConfig
  ): Promise<T> {
    return api.patch<T>(`${this.baseUrl}${endpoint}`, data, config, options);
  }

  /**
   * DELETE request
   */
  protected async delete<T = unknown>(
    endpoint: string,
    config?: AxiosRequestConfig,
    options?: {
      showErrorToast?: boolean;
      customErrorMessage?: string;
      loader?: boolean; // Control whether to show loader (default: true)
    }
  ): Promise<T> {
    return api.delete<T>(`${this.baseUrl}${endpoint}`, config, options);
  }

  /**
   * Get paginated data
   */
  protected async getPaginated<T = unknown>(
    endpoint: string,
    params: PaginationParams,
    config?: AxiosRequestConfig
  ): Promise<PaginatedResponse<T>> {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
      ...(params.sortBy && { sortBy: params.sortBy }),
      ...(params.sortOrder && { sortOrder: params.sortOrder }),
      ...(params.search && { search: params.search }),
    });

    return this.get<PaginatedResponse<T>>(
      `${endpoint}?${queryParams.toString()}`,
      config
    );
  }

  /**
   * Upload file
   */
  protected async uploadFile(
    endpoint: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: progressEvent => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    };

    return this.post<{ url: string; filename: string }>(
      endpoint,
      formData,
      undefined, // options
      config
    );
  }

  /**
   * Download file
   */
  protected async downloadFile(
    endpoint: string,
    filename?: string
  ): Promise<void> {
    const response = await api.get(endpoint, {
      responseType: 'blob',
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const blob = new Blob([response as any]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Handle API response
   */
  protected handleResponse<T>(response: ApiResponse<T>): T {
    if (response.success) {
      return response.data;
    }
    throw new ApiError(response.error || response.message || 'Request failed');
  }
}
