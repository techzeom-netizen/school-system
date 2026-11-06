import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Section from '@/components/common/Section';
import { FormField, TanStackTable } from '@/components/common';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Settings,
  Save,
  X,
} from 'lucide-react';
import { showSuccessToast } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { INDIAN_STATES } from '@/constants/companyTypes';
// import { COMPANY_STATUS } from '@/constants/companyTypes';

// Types for companies
interface Company {
  id: string;
  companyName: string;
  companyType: string;
  businessType: string;
  industry: string;
  registrationNumber: string;
  panNumber: string;
  email: string;
  phone: string;
  website: string;
  city: string;
  state: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  incorporationDate: string;
  domain: string;
  primaryColor: string;
  createdAt: string;
  updatedAt: string;
}

const initialCompanies: Company[] = [
  {
    id: '1',
    companyName: 'Sangamam Financial Services',
    companyType: 'bank',
    businessType: 'private_limited',
    industry: 'banking',
    registrationNumber: 'U65999TN2024PTC123456',
    panNumber: 'ABCDE1234F',
    email: 'info@sangamam.bank',
    phone: '+91 44 1234 5678',
    website: 'https://sangamam.bank',
    city: 'Chennai',
    state: 'TN',
    status: 'active',
    incorporationDate: '2024-01-15',
    domain: 'sangamam.bank',
    primaryColor: '#aa394e',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-12-20T15:30:00Z',
  },
  {
    id: '2',
    companyName: 'Green Valley Credit Union',
    companyType: 'credit_union',
    businessType: 'cooperative',
    industry: 'credit_union',
    registrationNumber: 'U65999MH2024PTC234567',
    panNumber: 'FGHIJ5678K',
    email: 'contact@greenvalley.coop',
    phone: '+91 22 9876 5432',
    website: 'https://greenvalley.coop',
    city: 'Mumbai',
    state: 'MH',
    status: 'active',
    incorporationDate: '2024-02-10',
    domain: 'greenvalley.coop',
    primaryColor: '#10b981',
    createdAt: '2024-02-10T09:00:00Z',
    updatedAt: '2024-12-19T14:20:00Z',
  },
  {
    id: '3',
    companyName: 'Rural Development Bank',
    companyType: 'cooperative',
    businessType: 'cooperative',
    industry: 'agriculture',
    registrationNumber: 'U65999KA2024PTC345678',
    panNumber: 'KLMNO9012P',
    email: 'support@ruralbank.coop',
    phone: '+91 80 5555 1234',
    website: 'https://ruralbank.coop',
    city: 'Bangalore',
    state: 'KA',
    status: 'pending_verification',
    incorporationDate: '2024-03-20',
    domain: 'ruralbank.coop',
    primaryColor: '#f97316',
    createdAt: '2024-03-20T11:00:00Z',
    updatedAt: '2024-12-18T16:45:00Z',
  },
  {
    id: '4',
    companyName: 'TechFin Solutions',
    companyType: 'fintech',
    businessType: 'private_limited',
    industry: 'fintech',
    registrationNumber: 'U65999DL2024PTC456789',
    panNumber: 'PQRST3456U',
    email: 'hello@techfin.com',
    phone: '+91 11 7777 8888',
    website: 'https://techfin.com',
    city: 'New Delhi',
    state: 'DL',
    status: 'suspended',
    incorporationDate: '2024-04-12',
    domain: 'techfin.com',
    primaryColor: '#8b5cf6',
    createdAt: '2024-04-12T08:00:00Z',
    updatedAt: '2024-12-17T12:15:00Z',
  },
  {
    id: '5',
    companyName: 'Community Savings Bank',
    companyType: 'bank',
    businessType: 'cooperative',
    industry: 'cooperative',
    registrationNumber: 'U65999GJ2024PTC567890',
    panNumber: 'VWXYZ7890A',
    email: 'info@communitybank.coop',
    phone: '+91 79 3333 4444',
    website: 'https://communitybank.coop',
    city: 'Ahmedabad',
    state: 'GJ',
    status: 'inactive',
    incorporationDate: '2024-05-08',
    domain: 'communitybank.coop',
    primaryColor: '#ef4444',
    createdAt: '2024-05-08T13:00:00Z',
    updatedAt: '2024-12-16T10:30:00Z',
  },
];

// Search filter types
interface SearchFilters {
  searchType: 'companyName' | 'registrationNumber' | 'panNumber' | 'email';
  searchTerm: string;
  status: 'all' | 'active' | 'inactive' | 'suspended' | 'pending_verification';
  companyType: string;
  state: string;
  dateFrom: string;
  dateTo: string;
}

const CompanyListPage: React.FC = () => {
  const navigate = useNavigate();

  // Filter state
  const [filters, setFilters] = useState<SearchFilters>({
    searchType: 'companyName',
    searchTerm: '',
    status: 'all',
    companyType: 'all',
    state: 'all',
    dateFrom: '',
    dateTo: '',
  });

  const [companyData, setCompanyData] = useState<Company[]>(
    () => initialCompanies
  );
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Company | null>(null);

  const statusOptions = useMemo(
    () => [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'suspended', label: 'Suspended' },
      { value: 'pending_verification', label: 'Pending Verification' },
    ],
    []
  );

  // Filtered companies based on search criteria
  const filteredCompanies = useMemo(() => {
    let filtered = [...companyData];

    // Search by type and term
    if (filters.searchTerm) {
      filtered = filtered.filter(company => {
        let searchValue: string;
        switch (filters.searchType) {
          case 'companyName':
            searchValue = company.companyName;
            break;
          case 'registrationNumber':
            searchValue = company.registrationNumber;
            break;
          case 'panNumber':
            searchValue = company.panNumber;
            break;
          case 'email':
            searchValue = company.email;
            break;
          default:
            searchValue = '';
        }
        return searchValue
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());
      });
    }

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(company => company.status === filters.status);
    }

    // Filter by company type
    if (filters.companyType !== 'all') {
      filtered = filtered.filter(
        company => company.companyType === filters.companyType
      );
    }

    // Filter by state
    if (filters.state !== 'all') {
      filtered = filtered.filter(company => company.state === filters.state);
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter(
        company => company.incorporationDate >= filters.dateFrom
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(
        company => company.incorporationDate <= filters.dateTo
      );
    }

    return filtered;
  }, [filters, companyData]);

  const handleEditChange = useCallback(
    (field: keyof Company, value: Company[keyof Company]) => {
      setEditFormData(prev =>
        prev
          ? {
              ...prev,
              [field]: value,
            }
          : prev
      );
    },
    []
  );

  const handleEditClick = useCallback((company: Company) => {
    setEditingCompanyId(company.id);
    setEditFormData({ ...company });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingCompanyId(null);
    setEditFormData(null);
  }, []);

  const handleSaveEdit = useCallback(
    (companyId: string) => {
      if (!editFormData || companyId !== editingCompanyId) {
        return;
      }

      setCompanyData(prev =>
        prev.map(company =>
          company.id === companyId ? { ...company, ...editFormData } : company
        )
      );
      setEditingCompanyId(null);
      setEditFormData(null);
      showSuccessToast('Company details updated successfully');
    },
    [editFormData, editingCompanyId]
  );

  // Table columns definition
  const columns = useMemo<ColumnDef<Company>[]>(
    () => [
      {
        accessorKey: 'companyName',
        header: 'Company Name',
        cell: ({ row }) =>
          editingCompanyId === row.original.id && editFormData ? (
            <FormField
              label="Company Name"
              name="companyName"
              value={editFormData.companyName}
              onChange={value => handleEditChange('companyName', value)}
              placeholder="Company Name"
              className="!space-y-0 [&>label]:hidden"
            />
          ) : (
            <div className="flex items-center gap-2">
              <span className="">{row.original.companyName}</span>
            </div>
          ),
      },
      {
        accessorKey: 'registrationNumber',
        header: 'Registration Number',
        cell: ({ row }) =>
          editingCompanyId === row.original.id && editFormData ? (
            <FormField
              label="Registration Number"
              name="registrationNumber"
              value={editFormData.registrationNumber}
              onChange={value => handleEditChange('registrationNumber', value)}
              placeholder="Registration Number"
              className="!space-y-0 [&>label]:hidden"
            />
          ) : (
            <div className="">{row.original.registrationNumber}</div>
          ),
      },
      {
        accessorKey: 'panNumber',
        header: 'PAN Number',
        cell: ({ row }) =>
          editingCompanyId === row.original.id && editFormData ? (
            <FormField
              label="PAN Number"
              name="panNumber"
              value={editFormData.panNumber}
              onChange={value => handleEditChange('panNumber', value)}
              placeholder="PAN Number"
              className="!space-y-0 [&>label]:hidden"
            />
          ) : (
            <div className="">{row.original.panNumber}</div>
          ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) =>
          editingCompanyId === row.original.id && editFormData ? (
            <FormField
              label="Email"
              name="email"
              type="email"
              value={editFormData.email}
              onChange={value => handleEditChange('email', value)}
              placeholder="Email"
              className="!space-y-0 [&>label]:hidden"
            />
          ) : (
            <div className="flex items-center gap-1">
              <span className="">{row.original.email}</span>
            </div>
          ),
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ row }) =>
          editingCompanyId === row.original.id && editFormData ? (
            <FormField
              label="Phone"
              name="phone"
              value={editFormData.phone}
              onChange={value => handleEditChange('phone', value)}
              placeholder="Phone"
              className="!space-y-0 [&>label]:hidden"
            />
          ) : (
            <div className="flex items-center gap-1">
              <span className="">{row.original.phone}</span>
            </div>
          ),
      },
      {
        accessorKey: 'city',
        header: 'Location',
        cell: ({ row }) => {
          const company = row.original;
          if (editingCompanyId === company.id && editFormData) {
            return (
              <div className="grid grid-cols-1 gap-1">
                <FormField
                  label="City"
                  name="city"
                  value={editFormData.city}
                  onChange={value => handleEditChange('city', value)}
                  placeholder="City"
                  className="!space-y-0 [&>label]:hidden"
                />
                <FormField
                  label="State"
                  name="state"
                  value={editFormData.state}
                  onChange={value =>
                    handleEditChange('state', value.toUpperCase())
                  }
                  placeholder="State"
                  maxLength={2}
                  className="!space-y-0 [&>label]:hidden"
                />
              </div>
            );
          }

          return (
            <div className="flex items-center gap-1">
              <span className="">
                {company.city}, {company.state}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;
          const statusConfig = {
            active: {
              bg: 'bg-green-100 dark:bg-green-900',
              text: 'text-green-800 dark:text-green-200',
              label: 'Active',
            },
            inactive: {
              bg: 'bg-red-100 dark:bg-red-900',
              text: 'text-red-800 dark:text-red-200',
              label: 'Inactive',
            },
            suspended: {
              bg: 'bg-yellow-100 dark:bg-yellow-900',
              text: 'text-yellow-800 dark:text-yellow-200',
              label: 'Suspended',
            },
            pending_verification: {
              bg: 'bg-blue-100 dark:bg-blue-900',
              text: 'text-blue-800 dark:text-blue-200',
              label: 'Pending',
            },
          };
          const config =
            statusConfig[status as keyof typeof statusConfig] ||
            statusConfig.active;

          if (editingCompanyId === row.original.id && editFormData) {
            return (
              <FormField
                label="Status"
                name="status"
                type="select"
                value={editFormData.status}
                onChange={value =>
                  handleEditChange('status', value as Company['status'])
                }
                options={statusOptions}
                placeholder="Select Status"
                className="!space-y-0 [&>label]:hidden"
              />
            );
          }

          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${config.bg} ${config.text}`}
            >
              {config.label}
            </span>
          );
        },
      },
      {
        accessorKey: 'incorporationDate',
        header: 'Incorporation Date',
        cell: ({ row }) =>
          editingCompanyId === row.original.id && editFormData ? (
            <FormField
              label="Incorporation Date"
              name="incorporationDate"
              type="date"
              value={editFormData.incorporationDate}
              onChange={value => handleEditChange('incorporationDate', value)}
              className="!space-y-0 [&>label]:hidden"
            />
          ) : (
            <div className="flex items-center gap-1">
              <span className="">
                {new Date(row.original.incorporationDate).toLocaleDateString()}
              </span>
            </div>
          ),
      },
      {
        accessorKey: 'domain',
        header: 'Domain',
        cell: ({ row }) =>
          editingCompanyId === row.original.id && editFormData ? (
            <FormField
              label="Domain"
              name="domain"
              value={editFormData.domain}
              onChange={value => handleEditChange('domain', value)}
              placeholder="Domain"
              className="!space-y-0 [&>label]:hidden"
            />
          ) : (
            <div className="flex items-center gap-1">
              <span className="">{row.original.domain}</span>
            </div>
          ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const company = row.original;
          if (editingCompanyId === company.id) {
            return (
              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleSaveEdit(company.id)}
                >
                  <Save className="w-3 h-3" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={handleCancelEdit}
                >
                  <X className="w-3 h-3" />
                  Cancel
                </Button>
              </div>
            );
          }

          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  showSuccessToast(`Viewing company ${company.companyName}`);
                }}
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleEditClick(company);
                }}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  showSuccessToast(
                    `Managing settings for ${company.companyName}`
                  );
                }}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [
      editFormData,
      editingCompanyId,
      handleEditChange,
      handleEditClick,
      handleCancelEdit,
      handleSaveEdit,
      statusOptions,
    ]
  );

  // Handle filter changes
  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      searchType: 'companyName',
      searchTerm: '',
      status: 'all',
      companyType: 'all',
      state: 'all',
      dateFrom: '',
      dateTo: '',
    });
  };

  return (
    <>
      <Section
        title="Companies"
        menuId="view-companies"
        icon={Filter}
        showBreadcrumbs
        buttonText="Create Company"
        buttonIcon={Plus}
        onButtonClick={() =>
          navigate('/dashboard/super-admin/companies/create')
        }
        className="mb-6"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Search Type and Term */}
          <FormField
            label="Search Type"
            name="searchType"
            type="select"
            value={filters.searchType}
            onChange={(value: string) =>
              handleFilterChange('searchType', value)
            }
            options={[
              { value: 'companyName', label: 'Company Name' },
              { value: 'registrationNumber', label: 'Registration Number' },
              { value: 'panNumber', label: 'PAN Number' },
              { value: 'email', label: 'Email' },
            ]}
          />

          <FormField
            label="Enter Search"
            name="searchTerm"
            placeholder={`Search by ${filters.searchType.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
            value={filters.searchTerm}
            onChange={(value: string) =>
              handleFilterChange('searchTerm', value)
            }
          />

          {/* Status Filter */}
          <FormField
            label="Status"
            name="status"
            type="select"
            value={filters.status}
            onChange={(value: string) => handleFilterChange('status', value)}
            options={[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'suspended', label: 'Suspended' },
              {
                value: 'pending_verification',
                label: 'Pending Verification',
              },
            ]}
          />

          {/* Date Range Filters */}
          <FormField
            label="Date From"
            name="dateFrom"
            type="date"
            value={filters.dateFrom}
            onChange={(value: string) => handleFilterChange('dateFrom', value)}
          />

          <FormField
            label="Date To"
            name="dateTo"
            type="date"
            value={filters.dateTo}
            onChange={(value: string) => handleFilterChange('dateTo', value)}
          />

          {/* State Filter */}
          <FormField
            label="State"
            name="state"
            type="select"
            value={filters.state}
            onChange={(value: string) => handleFilterChange('state', value)}
            options={[...INDIAN_STATES]}
            required
          />
        </div>
        <div className="col-span-full mt-5 flex items-center justify-start gap-3">
          <Button
            variant="default"
            onClick={() => {
              showSuccessToast(
                `Found ${filteredCompanies.length} companies matching criteria`
              );
            }}
            className="flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </Button>
          <Button
            variant="outline"
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            Clear Filters
          </Button>
        </div>
      </Section>

      <Section title="Companies List">
        <TanStackTable
          data={filteredCompanies}
          columns={columns}
          enableServerSidePagination={false}
          enableColumnVisibility={true}
          enableColumnReordering={true}
          enableRowSelection={false}
          onSelectionChange={selection => {
            console.log('Selected companies:', selection);
          }}
        />
      </Section>
    </>
  );
};

export default CompanyListPage;
