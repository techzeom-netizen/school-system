import { ApiError } from '@/lib/api-client';
import { BaseService } from './base.service';

export type UserRegistrationType = 'Company Admin' | 'Jobseeker';

export interface UserRegisterPayload {
  name: string;
  email: string;
  password: string;
  type: UserRegistrationType;
}

export interface UserRegisterData {
  requestId: string;
}

export interface VerifyUserRegisterPayload {
  requestId: string;
  otp: string;
}

export interface VerifyUserRegisterData {
  email: string;
  isVerified: boolean;
  status: string;
}

interface RegistrationApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

class UserRegistrationService extends BaseService {
  constructor() {
    super('');
  }

  async registerUser(
    payload: UserRegisterPayload
  ): Promise<RegistrationApiResponse<UserRegisterData>> {
    const response = await this.fetchPost<
      RegistrationApiResponse<UserRegisterData>
    >('/auth/user/register', payload);

    if (!response.data.success || !response.data.data?.requestId) {
      throw new ApiError(response.data.message || 'Unable to register user.');
    }

    return response.data;
  }

  async verifyUserRegistration(
    payload: VerifyUserRegisterPayload
  ): Promise<RegistrationApiResponse<VerifyUserRegisterData>> {
    const response = await this.fetchPost<
      RegistrationApiResponse<VerifyUserRegisterData>
    >('/auth/user/verify-user', payload);

    if (!response.data.success || !response.data.data?.isVerified) {
      throw new ApiError(
        response.data.message || 'Unable to verify the registration OTP.'
      );
    }

    return response.data;
  }
}

export const userRegistrationService = new UserRegistrationService();
