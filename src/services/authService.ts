import {
  LoginCredentials,
  AuthResponse,
  User,
  UserRole,
  LoginType,
} from '../types';
import { ApiError } from '@/lib/api-client';
import { BaseService } from './base.service';

interface LoginApiResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  companyId: string | null;
  role: LoginType;
  isCompanyActive: boolean;
}

export interface RefreshAccessTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

const roleMap: Record<LoginType, UserRole> = {
  'Super Admin': UserRole.SUPER_ADMIN,
  'Company Admin': UserRole.COMPANY_ADMIN,
  Jobseeker: UserRole.JOB_SEEKER,
  Employee: UserRole.EMPLOYEE,
};

const getNameFromEmail = (email: string) => {
  const firstName = email.split('@')[0].split(/[._-]/)[0] || 'User';
  return {
    firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
    lastName: '',
  };
};

const TEMP_EMPLOYEE_TOKEN = 'temporary-employee-login-token';
const TEMP_SUPER_ADMIN_TOKEN = 'temporary-super-admin-login-token';

const TEMP_LOCAL_TOKENS = [TEMP_EMPLOYEE_TOKEN, TEMP_SUPER_ADMIN_TOKEN];

class AuthService extends BaseService {
  constructor() {
    super('/auth');
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const normalizedEmail = credentials.email.trim().toLowerCase();

    // TODO: Remove this temporary local login when the Employee API is enabled.
    if (
      normalizedEmail === 'staff@kdpublicschool.edu' &&
      credentials.password === 'password123' &&
      credentials.type === 'Employee'
    ) {
      const user: User = {
        id: 'temporary-employee-user',
        email: normalizedEmail,
        firstName: 'Employee',
        lastName: '',
        role: UserRole.EMPLOYEE,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return {
        user,
        token: TEMP_EMPLOYEE_TOKEN,
        refreshToken: '',
        expiresIn: 3600,
      };
    }

    // TODO: Remove this temporary local login when the Super Admin API is enabled.
    if (
      normalizedEmail === 'superadmin@kdpublicschool.edu' &&
      credentials.password === 'SchoolSystem@12345' &&
      credentials.type === 'Super Admin'
    ) {
      const user: User = {
        id: 'temporary-super-admin-user',
        email: normalizedEmail,
        firstName: 'Super',
        lastName: 'Admin',
        role: UserRole.SUPER_ADMIN,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return {
        user,
        token: TEMP_SUPER_ADMIN_TOKEN,
        refreshToken: '',
        expiresIn: 3600,
      };
    }

    const response = await this.post<LoginApiResponse>(
      '/login',
      {
        email: normalizedEmail,
        password: credentials.password,
        type: credentials.type,
      },
      { showErrorToast: false }
    );

    if (!response?.accessToken || !response.userId || !response.role) {
      throw new ApiError(
        'Login failed. Invalid response from authentication service.'
      );
    }

    const name = getNameFromEmail(normalizedEmail);
    const user: User = {
      id: response.userId,
      email: normalizedEmail,
      ...name,
      role: roleMap[response.role],
      isActive: response.role !== 'Company Admin' || response.isCompanyActive,
      isRegisterComplete:
        response.role === 'Company Admin'
          ? response.isCompanyActive
          : undefined,
      companyId: response.companyId,
      isCompanyActive: response.isCompanyActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return {
      user,
      token: response.accessToken,
      refreshToken: response.refreshToken,
      expiresIn: 3600,
    };
  }

  async getCurrentUser(): Promise<User> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new ApiError('Not authenticated');
    }

    if (TEMP_LOCAL_TOKENS.includes(token)) {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) throw new ApiError('User not found');
      return JSON.parse(storedUser) as User;
    }

    try {
      return await this.get<User>('/me', undefined, {
        showErrorToast: false,
      });
    } catch (error) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          return JSON.parse(storedUser) as User;
        } catch {
          throw new ApiError('Failed to get user information');
        }
      }
      throw error;
    }
  }

  async refreshToken(refreshTokenValue: string): Promise<AuthResponse> {
    try {
      const response = await this.post<{
        accessToken: string;
        refreshToken?: string;
        user: User;
      }>(
        '/refresh',
        { refreshToken: refreshTokenValue },
        { showErrorToast: false }
      );

      if (!response?.accessToken || !response.user) {
        throw new ApiError('Token refresh failed. Invalid response.');
      }

      return {
        user: response.user,
        token: response.accessToken,
        refreshToken: response.refreshToken || refreshTokenValue,
        expiresIn: 3600,
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to refresh token');
    }
  }

  async refreshAccessToken(
    refreshTokenValue?: string | null
  ): Promise<RefreshAccessTokenResponse> {
    const response = await this.post<RefreshAccessTokenResponse>(
      '/refresh-token',
      refreshTokenValue ? { refreshToken: refreshTokenValue } : {},
      { showErrorToast: false }
    );

    if (!response?.accessToken) {
      throw new ApiError('Token refresh failed. Invalid response.');
    }

    return response;
  }

  async logout(): Promise<void> {
    try {
      if (
        localStorage.getItem('authToken') &&
        !TEMP_LOCAL_TOKENS.includes(localStorage.getItem('authToken') as string)
      ) {
        await this.post('/logout', {}, { showErrorToast: false });
      }
    } catch {
      // Local auth state is cleared in finally even if server logout fails.
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }
}

export const authService = new AuthService();
