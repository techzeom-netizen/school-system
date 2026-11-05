import { BaseService } from './base.service';

/**
 * Company interface based on API response
 */
export interface Company {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCompanyRequest {
  // Basic Information
  companyName: string;
  companyType?: string;
  businessType?: string;
  industry?: string;
  registrationNumber?: string;
  panNumber?: string;
  gstNumber?: string;
  incorporationDate?: string;

  // Contact Information
  email?: string;
  phone?: string;
  website?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;

  // Branding
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  logo?: string;

  // System Configuration
  domain?: string;
  subdomain?: string;
  timezone?: string;
  currency?: string;
  language?: string;

  // Additional Information
  description?: string;
  notes?: string;
}

export interface CreateCompanyResponse {
  success: boolean;
  message: string;
}

export interface CompanyAddress {
  id: string;
  companyId: string;
  type: 'registered' | 'office' | string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyKyc {
  id: string;
  companyId: string;
  type: 'gst' | 'pan' | 'registration' | 'cin' | string;
  uniqueId: string;
  fileKey: string;
  status: string;
  submittedAt: string;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyDetail {
  id: string;
  name: string;
  legalName: string;
  website?: string | null;
  email?: string | null;
  contactNumber?: string | null;
  logo?: string | null;
  industry?: string | null;
  companySize?: string | null;
  status: string;
  rejectionReason?: string | null;
  onboardedBy: string;
  createdAt: string;
  updatedAt: string;
  addresses: CompanyAddress[];
  kycs: CompanyKyc[];
}

export interface UpdateCompanyRequest extends Partial<CreateCompanyRequest> {
  id: string;
}

/**
 * Company Service
 * Handles all company-related API calls
 */
class CompanyService extends BaseService {
  constructor() {
    super('');
  }

  /**
   * Get all companies
   * API Response: { data: Company[], success: boolean, message?: string }
   * API client automatically extracts the 'data' property
   */
  async getAllCompanies(): Promise<Company[]> {
    return this.get<Company[]>('/admin/company');
  }

  /**
   * Get company by ID
   */
  async getCompanyById(id: string): Promise<Company> {
    return this.get<Company>(`/admin/company/${id}`);
  }

  /**
   * Submit company registration using multipart/form-data.
   */
  async createCompany(data: FormData): Promise<CreateCompanyResponse> {
    return this.formPost<CreateCompanyResponse>('/company/create', data);
  }

  /** Fetch the authenticated user's submitted company details. */
  async getCompanyDetail(): Promise<CompanyDetail> {
    return this.get<CompanyDetail>('/company/details', undefined, {
      showErrorToast: false,
      loader: false,
    });
  }

  /** Resubmit rejected company details using the same multipart body. */
  async resubmitCompany(data: FormData): Promise<CreateCompanyResponse> {
    return this.formPatch<CreateCompanyResponse>('/company/resubmit', data);
  }

  /** Create a company from the super-admin company management screen. */
  async createAdminCompany(data: CreateCompanyRequest): Promise<Company> {
    return this.post<Company>('/admin/company', data);
  }

  /**
   * Update company
   */
  async updateCompany(data: UpdateCompanyRequest): Promise<Company> {
    const { id, ...updateData } = data;
    return this.put<Company>(`/admin/company/${id}`, updateData);
  }

  /**
   * Delete company
   */
  async deleteCompany(id: string): Promise<void> {
    return this.delete(`/admin/company/${id}`);
  }
}

export const companyService = new CompanyService();
