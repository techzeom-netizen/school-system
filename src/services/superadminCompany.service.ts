import { BaseService } from './base.service';

export interface SuperAdminCompany {
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
  onboardedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SuperAdminCompanyAddress {
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

export interface SuperAdminCompanyKyc {
  id: string;
  companyId: string;
  type: 'gst' | 'pan' | 'registration' | 'cin' | string;
  uniqueId: string;
  fileKey?: string | null;
  status: string;
  submittedAt?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SuperAdminCompanyDetail extends SuperAdminCompany {
  addresses: SuperAdminCompanyAddress[];
  kycs: SuperAdminCompanyKyc[];
}

export interface SuperAdminCompanyListParams {
  name?: string;
  industry?: string;
  status?: string;
  companySize?: string;
  page?: number;
  pageSize?: number;
}

export interface SuperAdminCompanyListResponse {
  companies: SuperAdminCompany[];
  pagination: {
    total: number;
    page: number;
    pageCount: number;
  };
}

class SuperAdminCompanyService extends BaseService {
  constructor() {
    super('/super-admin/company');
  }

  getCompanyList(
    params: SuperAdminCompanyListParams = {}
  ): Promise<SuperAdminCompanyListResponse> {
    const query = new URLSearchParams();

    if (params.name?.trim()) query.set('name', params.name.trim());
    if (params.industry?.trim()) query.set('industry', params.industry.trim());
    if (params.status?.trim()) query.set('status', params.status.trim());
    if (params.companySize?.trim())
      query.set('companySize', params.companySize.trim());
    if (params.page) query.set('page', String(params.page));
    if (params.pageSize) query.set('pageSize', String(params.pageSize));

    const queryString = query.toString();
    return this.get<SuperAdminCompanyListResponse>(
      `/list${queryString ? `?${queryString}` : ''}`
    );
  }

  getCompanyById(companyId: string): Promise<SuperAdminCompanyDetail> {
    return this.get<SuperAdminCompanyDetail>(`/${companyId}`);
  }
}

export const superAdminCompanyService = new SuperAdminCompanyService();
