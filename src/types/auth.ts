export const UserRole = {
  SUPER_ADMIN: 'Super Admin',
  COMPANY_ADMIN: 'Company Admin',
  JOB_SEEKER: 'Jobseeker',
  EMPLOYEE: 'Employee',
  ADMIN: 'Company Admin',
  RECRUITER: 'Employee',
  EMPLOYER: 'Employee',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export type LoginType =
  | 'Super Admin'
  | 'Company Admin'
  | 'Jobseeker'
  | 'Employee';

export interface CompanyDetails {
  companyName: string;
  legalName: string;
  website: string;
  companySize: string;
  gstNumber: string;
  panNumber: string;
  registrationNumber: string;
  cinNumber: string;
  industry: string;
  companyEmail: string;
  companyPhone: string;
  registeredAddressLine1: string;
  registeredAddressLine2: string;
  registeredCity: string;
  registeredState: string;
  registeredCountry: string;
  registeredPostalCode: string;
  registeredIsPrimary: boolean;
  officeAddressLine1: string;
  officeAddressLine2: string;
  officeCity: string;
  officeState: string;
  officeCountry: string;
  officePostalCode: string;
  officeIsPrimary: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  isRegisterComplete?: boolean;
  companyDetails?: CompanyDetails;
  companyId?: string | null;
  isCompanyActive?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  type: LoginType;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}
