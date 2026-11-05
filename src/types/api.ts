import { AxiosRequestConfig } from 'axios';

/**
 * Standard API Response Structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  errors?: string[];
}

/**
 * Pagination Parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * API Request Options
 */
export interface ApiRequestOptions {
  showErrorToast?: boolean;
  customErrorMessage?: string;
  skipAuth?: boolean;
  timeout?: number;
}

/**
 * Extended Axios Request Config with custom options
 */
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  showErrorToast?: boolean;
  customErrorMessage?: string;
}

/**
 * File Upload Response
 */
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

/**
 * Bulk Operation Response
 */
export interface BulkOperationResponse {
  success: number;
  failed: number;
  errors?: Array<{ id: string; error: string }>;
}
