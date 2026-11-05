import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { toast } from 'sonner';

/**
 * API Configuration
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;
const IS_DEV = import.meta.env.VITE_DEV_MODE === 'true';

/**
 * Custom API Error Class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public data?: any,
    public originalError?: AxiosError
  ) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Request Retry Configuration
 */
interface RetryConfig {
  retries: number;
  retryDelay: number;
  retryCondition?: (error: AxiosError) => boolean;
}

const defaultRetryConfig: RetryConfig = {
  retries: 1,
  retryDelay: 1000,
  retryCondition: (error: AxiosError) => {
    // Retry on network errors or 5xx server errors
    return (
      !error.response ||
      (error.response.status >= 500 && error.response.status < 600)
    );
  },
};

type ToastAwareRequestConfig = InternalAxiosRequestConfig & {
  _showLoader?: boolean;
  _showErrorToast?: boolean;
  _customErrorMessage?: string;
};

/**
 * Get authentication token from storage
 */
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

/**
 * Store tokens in localStorage
 * Note: Refresh token functionality temporarily disabled
 */
// const setTokens = (token: string, refreshToken?: string): void => {
//   if (typeof window === 'undefined') return;
//   localStorage.setItem('authToken', token);
//   if (refreshToken) {
//     localStorage.setItem('refreshToken', refreshToken);
//   }
// };

/**
 * Clear tokens from storage
 */
const clearTokens = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

/**
 * Refresh token function - TEMPORARILY DISABLED
 */
// let refreshTokenPromise: Promise<string> | null = null;

// export const setRefreshTokenHandler = (
//   handler: () => Promise<{ token: string; refreshToken?: string }>
// ): void => {
//   refreshTokenHandler = handler;
// };

// let refreshTokenHandler:
//   | (() => Promise<{ token: string; refreshToken?: string }>)
//   | null = null;

/**
 * Global loading state handling
 */
interface LoadingState {
  isLoading: boolean;
  activeRequests: number;
}

type LoadingStateHandler = (state: LoadingState) => void;

let loadingStateHandler: LoadingStateHandler | null = null;
const loadingStateSubscribers = new Set<LoadingStateHandler>();
let activeRequestCount = 0;

const notifyLoadingState = (): void => {
  const state: LoadingState = {
    isLoading: activeRequestCount > 0,
    activeRequests: activeRequestCount,
  };

  if (loadingStateHandler) {
    loadingStateHandler(state);
  }

  loadingStateSubscribers.forEach(subscriber => {
    subscriber(state);
  });
};

const getCurrentLoadingState = (): LoadingState => {
  return {
    isLoading: activeRequestCount > 0,
    activeRequests: activeRequestCount,
  };
};

export const subscribeLoadingState = (
  handler: LoadingStateHandler
): (() => void) => {
  loadingStateSubscribers.add(handler);
  handler(getCurrentLoadingState());

  return () => {
    loadingStateSubscribers.delete(handler);
  };
};

export const getLoadingState = (): LoadingState => {
  return getCurrentLoadingState();
};

export const setLoadingStateHandler = (
  handler: LoadingStateHandler | null
): void => {
  loadingStateHandler = handler;

  if (handler) {
    handler(getCurrentLoadingState());
  }
};

const incrementActiveRequests = (): void => {
  activeRequestCount += 1;
  notifyLoadingState();
};

const decrementActiveRequests = (): void => {
  activeRequestCount = Math.max(0, activeRequestCount - 1);
  notifyLoadingState();
};

/**
 * Handle token refresh - TEMPORARILY DISABLED
 */
// const handleTokenRefresh = async (): Promise<string | null> => {
//   // Refresh token functionality temporarily disabled
//   // Return null to prevent automatic refresh
//   return null;
// };

/**
 * Create axios instance with default configuration
 */
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
   * Request Interceptor
   * - Add authentication token to headers
   * - Add request ID for tracking
   * - Log requests in development
   * - Track loading state (unless loader is disabled)
   */
  instance.interceptors.request.use(
    (config: ToastAwareRequestConfig) => {
      // Only increment if loader is not explicitly disabled
      // Default to true (show loader) if not specified
      if (config._showLoader !== false) {
        incrementActiveRequests();
      }
      const token = getAuthToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      config.headers['X-Request-ID'] = `${Date.now()}-${Math.random()}`;

      // Log request in development
      if (IS_DEV) {
        // eslint-disable-next-line no-console
        console.log(
          `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
          {
            params: config.params,
            data: config.data,
            showLoader: config._showLoader !== false,
          }
        );
      }

      return config;
    },
    (error: AxiosError) => {
      const config = error.config as ToastAwareRequestConfig;
      // Only decrement if loader was enabled
      if (config && config._showLoader !== false) {
        decrementActiveRequests();
      }
      if (IS_DEV) {
        // eslint-disable-next-line no-console
        console.error('[API Request Error]', error);
      }
      return Promise.reject(error);
    }
  );

  /**
   * Response Interceptor
   * - Handle token refresh on 401
   * - Transform response data
   * - Handle errors globally
   * - Track loading state (unless loader is disabled)
   */
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const config = response.config as ToastAwareRequestConfig;
      // Only decrement if loader was enabled
      if (config._showLoader !== false) {
        decrementActiveRequests();
      }
      // Log response in development
      if (IS_DEV) {
        // eslint-disable-next-line no-console
        console.log(
          `[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`,
          response.data
        );
      }

      // Only show as success when response does not indicate business failure.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const responseData = response.data as any;
      const message = extractApiMessage(responseData);
      const hasBusinessFailure =
        (typeof responseData?.success === 'boolean' &&
          responseData.success === false) ||
        (typeof responseData?.status === 'boolean' &&
          responseData.status === false);

      if (message && hasBusinessFailure && config._showErrorToast !== false) {
        toast.error(message, { duration: 5000 });
      }

      // Return data directly if it's already in the expected format
      return response;
    },
    async (error: AxiosError) => {
      const config = error.config as ToastAwareRequestConfig & {
        _retry?: boolean;
        _retryCount?: number;
      };
      // Only decrement if loader was enabled
      if (config && config._showLoader !== false) {
        decrementActiveRequests();
      }
      const originalRequest = config;

      // Handle 401 Unauthorized - Token expired or invalid
      // Refresh token functionality temporarily disabled
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const requestUrl = originalRequest?.url || '';
        const isLoginRequest = requestUrl.includes('/auth/login');
        const isTwoFactorVerifyRequest =
          requestUrl.includes('/auth/verify-2fa-code') ||
          requestUrl.endsWith('/verify-2fa-code');

        // Keep user on login page for invalid credentials; only redirect
        // when a protected request gets a 401.
        if (!isLoginRequest && !isTwoFactorVerifyRequest) {
          clearTokens();
          if (
            typeof window !== 'undefined' &&
            window.location.pathname !== '/login'
          ) {
            window.location.href = '/login';
          }
        }

        // try {
        //   const newToken = await handleTokenRefresh();
        //   if (newToken && originalRequest.headers) {
        //     originalRequest.headers.Authorization = `Bearer ${newToken}`;
        //     return instance(originalRequest);
        //   }
        // } catch (refreshError) {
        //   // Refresh failed, user will be redirected to login
        //   return Promise.reject(refreshError);
        // }
      }

      // Handle other errors
      if (config?._showErrorToast !== false) {
        const apiError = handleApiError(error);
        showApiError(apiError, config?._customErrorMessage);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

/**
 * Main API client instance
 */
export const apiClient = createAxiosInstance();

/**
 * Retry request with exponential backoff
 */
const retryRequest = async <T>(
  requestFn: () => Promise<AxiosResponse<T>>,
  retryConfig: RetryConfig = defaultRetryConfig
): Promise<AxiosResponse<T>> => {
  let lastError: AxiosError;

  for (let attempt = 0; attempt <= retryConfig.retries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as AxiosError;

      // Don't retry if condition is not met
      if (
        retryConfig.retryCondition &&
        !retryConfig.retryCondition(lastError)
      ) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === retryConfig.retries) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay =
        retryConfig.retryDelay * Math.pow(2, attempt) + Math.random() * 1000; // Add jitter

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
};

/**
 * Handle API errors and show user-friendly messages
 */
export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const response = axiosError.response;

    // Network error
    if (!response) {
      const networkError = new ApiError(
        'Network error. Please check your internet connection.',
        0,
        null,
        axiosError
      );
      if (IS_DEV) {
        // eslint-disable-next-line no-console
        console.error('[Network Error]', axiosError);
      }
      return networkError;
    }

    // Server error with response
    const statusCode = response.status;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = response.data as any;
    let message = '';
    let hasApiMessage = false;

    if (IS_DEV) {
      // eslint-disable-next-line no-console
      console.log(
        `[API Error Debug] Status: ${statusCode}, Response Data:`,
        data
      );
    }

    // Extract error message from response - PRIORITIZE ACTUAL API MESSAGE
    if (
      data?.message &&
      typeof data.message === 'string' &&
      data.message.trim()
    ) {
      message = data.message;
      hasApiMessage = true;
    } else if (data?.error) {
      if (typeof data.error === 'string' && data.error.trim()) {
        message = data.error;
        hasApiMessage = true;
      } else if (
        data.error?.message &&
        typeof data.error.message === 'string' &&
        data.error.message.trim()
      ) {
        message = data.error.message;
        hasApiMessage = true;
      }
    } else if (
      data?.errors &&
      Array.isArray(data.errors) &&
      data.errors.length > 0
    ) {
      const errorMessages = data.errors.filter(
        (e: unknown) => typeof e === 'string' && e.trim()
      );
      if (errorMessages.length > 0) {
        message = errorMessages.join(', ');
        hasApiMessage = true;
      }
    }

    // If no API message found, use status code specific fallback
    if (!hasApiMessage) {
      switch (statusCode) {
        case 400:
          message = 'Invalid request. Please check your input.';
          break;
        case 401:
          message = 'Unauthorized. Please login again.';
          break;
        case 403:
          message = 'You do not have permission to perform this action.';
          break;
        case 404:
          message = 'Resource not found.';
          break;
        case 422:
          message = 'Validation error. Please check your input.';
          break;
        case 429:
          message = 'Too many requests. Please try again later.';
          break;
        case 500:
          message = 'Internal server error. Please try again later.';
          break;
        case 502:
        case 503:
        case 504:
          message = 'Service temporarily unavailable. Please try again later.';
          break;
        default:
          message = 'An error occurred. Please try again.';
      }
    }

    const apiError = new ApiError(message, statusCode, data, axiosError);

    if (IS_DEV) {
      // eslint-disable-next-line no-console
      console.error(`[API Error ${statusCode}] Final Message:`, {
        message,
        finalMessage: apiError.message,
        hasApiMessage,
        data,
        url: axiosError.config?.url,
      });
    }

    return apiError;
  }

  // Unknown error
  if (IS_DEV) {
    // eslint-disable-next-line no-console
    console.error('[Unknown Error]', error);
  }

  return new ApiError(
    error instanceof Error ? error.message : 'An unexpected error occurred'
  );
};

/**
 * Show error toast notification
 */
const showApiError = (error: ApiError, customMessage?: string): void => {
  const message = customMessage || error.message || 'An error occurred';

  if (IS_DEV) {
    // eslint-disable-next-line no-console
    console.log(`[Toast Error] Message: "${message}"`);
  }

  toast.error(message, {
    duration: 5000,
  });
};

const extractApiMessage = (data: unknown): string | null => {
  if (!data || typeof data !== 'object') {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload = data as any;

  if (typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message;
  }

  if (typeof payload.error === 'string' && payload.error.trim()) {
    return payload.error;
  }

  return null;
};

/**
 * API Request wrapper with retry logic
 */
export const apiRequest = async <T = unknown>(
  config: AxiosRequestConfig,
  options?: {
    retry?: RetryConfig;
    showErrorToast?: boolean;
    customErrorMessage?: string;
    loader?: boolean; // Control whether to show loader (default: true)
  }
): Promise<T> => {
  try {
    // Add loader flag to config metadata
    const configWithLoader = {
      ...config,
      _showLoader: options?.loader !== false, // Default to true if not specified
      _showErrorToast: options?.showErrorToast !== false,
      _customErrorMessage: options?.customErrorMessage,
    } as AxiosRequestConfig & {
      _showLoader?: boolean;
      _showErrorToast?: boolean;
      _customErrorMessage?: string;
    };

    const response = await retryRequest(
      () => apiClient.request<T>(configWithLoader),
      options?.retry || defaultRetryConfig
    );

    // Handle different response structures
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = response.data as any;

    // Check for business logic errors (success/status flags in response)
    // Some APIs return HTTP 200 with success: false to indicate business errors
    if (data && typeof data === 'object') {
      // Check for success flag (common pattern: { data: ..., success: boolean })
      if ('success' in data && data.success === false) {
        const errorMessage = data.message || data.error || 'Request failed';
        throw new ApiError(errorMessage, response.status, data);
      }

      // Check for status flag (alternative pattern: { data: ..., status: boolean })
      if ('status' in data && data.status === false) {
        const errorMessage = data.message || data.error || 'Request failed';
        throw new ApiError(errorMessage, response.status, data);
      }

      // If response has a data property, return it (common API pattern)
      if ('data' in data) {
        return data.data as T;
      }
    }

    return data as T;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * HTTP Method helpers
 */
export const api = {
  get: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
    options?: {
      retry?: RetryConfig;
      showErrorToast?: boolean;
      customErrorMessage?: string;
      loader?: boolean; // Control whether to show loader (default: true)
    }
  ) => apiRequest<T>({ ...config, method: 'GET', url }, options),

  post: <T = unknown>(
    url: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
    config?: AxiosRequestConfig,
    options?: {
      retry?: RetryConfig;
      showErrorToast?: boolean;
      customErrorMessage?: string;
      loader?: boolean; // Control whether to show loader (default: true)
    }
  ) => apiRequest<T>({ ...config, method: 'POST', url, data }, options),

  put: <T = unknown>(
    url: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
    config?: AxiosRequestConfig,
    options?: {
      retry?: RetryConfig;
      showErrorToast?: boolean;
      customErrorMessage?: string;
      loader?: boolean; // Control whether to show loader (default: true)
    }
  ) => apiRequest<T>({ ...config, method: 'PUT', url, data }, options),

  patch: <T = unknown>(
    url: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
    config?: AxiosRequestConfig,
    options?: {
      retry?: RetryConfig;
      showErrorToast?: boolean;
      customErrorMessage?: string;
      loader?: boolean; // Control whether to show loader (default: true)
    }
  ) => apiRequest<T>({ ...config, method: 'PATCH', url, data }, options),

  delete: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
    options?: {
      retry?: RetryConfig;
      showErrorToast?: boolean;
      customErrorMessage?: string;
      loader?: boolean; // Control whether to show loader (default: true)
    }
  ) => apiRequest<T>({ ...config, method: 'DELETE', url }, options),
};

/**
 * Export types
 */
export type { AxiosRequestConfig, AxiosResponse, AxiosError };
