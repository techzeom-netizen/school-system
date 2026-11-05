import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Section from '@/components/common/Section';
import { FormField, TanStackTable } from '@/components/common';
import { Plus, Search, Filter, Eye, Edit, Shield, Save, X } from 'lucide-react';
import { showSuccessToast } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';

// Types for admins
interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId: string;
  department: string;
  designation: string;
  role: 'admin' | 'super_admin' | 'manager' | 'operator';
  status: 'active' | 'inactive' | 'suspended' | 'pending_activation';
  joiningDate: string;
  companyId: string;
  companyName: string;
  city: string;
  state: string;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}

const initialAdmins: Admin[] = [
  {
    id: '1',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh.kumar@sangamam.bank',
    phone: '+91 98765 43210',
    employeeId: 'EMP001',
    department: 'Operations',
    designation: 'Branch Manager',
    role: 'admin',
    status: 'active',
    joiningDate: '2024-01-15',
    companyId: '1',
    companyName: 'Sangamam Financial Services',
    city: 'Chennai',
    state: 'TN',
    lastLoginAt: '2024-12-20T10:30:00Z',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-12-20T10:30:00Z',
  },
  {
    id: '2',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@greenvalley.coop',
    phone: '+91 87654 32109',
    employeeId: 'EMP002',
    department: 'Finance',
    designation: 'Finance Manager',
    role: 'manager',
    status: 'active',
    joiningDate: '2024-02-10',
    companyId: '2',
    companyName: 'Green Valley Credit Union',
    city: 'Mumbai',
    state: 'MH',
    lastLoginAt: '2024-12-19T14:20:00Z',
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-12-19T14:20:00Z',
  },
  {
    id: '3',
    firstName: 'Arjun',
    lastName: 'Singh',
    email: 'arjun.singh@ruralbank.coop',
    phone: '+91 76543 21098',
    employeeId: 'EMP003',
    department: 'Customer Service',
    designation: 'Customer Service Manager',
    role: 'manager',
    status: 'pending_activation',
    joiningDate: '2024-03-20',
    companyId: '3',
    companyName: 'Rural Development Bank',
    city: 'Bangalore',
    state: 'KA',
    lastLoginAt: '',
    createdAt: '2024-03-20T11:00:00Z',
    updatedAt: '2024-12-18T16:45:00Z',
  },
  {
    id: '4',
    firstName: 'Sneha',
    lastName: 'Patel',
    email: 'sneha.patel@techfin.com',
    phone: '+91 65432 10987',
    employeeId: 'EMP004',
    department: 'IT',
    designation: 'IT Administrator',
    role: 'operator',
    status: 'suspended',
    joiningDate: '2024-04-12',
    companyId: '4',
    companyName: 'TechFin Solutions',
    city: 'New Delhi',
    state: 'DL',
    lastLoginAt: '2024-12-15T08:15:00Z',
    createdAt: '2024-04-12T08:00:00Z',
    updatedAt: '2024-12-17T12:15:00Z',
  },
  {
    id: '5',
    firstName: 'Vikram',
    lastName: 'Joshi',
    email: 'vikram.joshi@communitybank.coop',
    phone: '+91 54321 09876',
    employeeId: 'EMP005',
    department: 'Operations',
    designation: 'Operations Executive',
    role: 'operator',
    status: 'inactive',
    joiningDate: '2024-05-08',
    companyId: '5',
    companyName: 'Community Savings Bank',
    city: 'Ahmedabad',
    state: 'GJ',
    lastLoginAt: '2024-12-10T16:30:00Z',
    createdAt: '2024-05-08T13:00:00Z',
    updatedAt: '2024-12-16T10:30:00Z',
  },
  {
    id: '6',
    firstName: 'Anita',
    lastName: 'Reddy',
    email: 'anita.reddy@sangamam.bank',
    phone: '+91 43210 98765',
    employeeId: 'EMP006',
    department: 'Risk Management',
    designation: 'Risk Analyst',
    role: 'admin',
    status: 'active',
    joiningDate: '2024-06-25',
    companyId: '1',
    companyName: 'Sangamam Financial Services',
    city: 'Chennai',
    state: 'TN',
    lastLoginAt: '2024-12-20T09:45:00Z',
    createdAt: '2024-06-25T12:00:00Z',
    updatedAt: '2024-12-20T09:45:00Z',
  },
];

// Search filter types
interface SearchFilters {
  searchType: 'name' | 'email' | 'employeeId' | 'phone';
  searchTerm: string;
  status: 'all' | 'active' | 'inactive' | 'suspended' | 'pending_activation';
  role: string;
  companyId: string;
  dateFrom: string;
  dateTo: string;
}

const AdminListPage: React.FC = () => {
  const navigate = useNavigate();

  // Filter state
  const [filters, setFilters] = useState<SearchFilters>({
    searchType: 'name',
    searchTerm: '',
    status: 'all',
    role: 'all',
    companyId: 'all',
    dateFrom: '',
    dateTo: '',
  });

  const [adminData, setAdminData] = useState<Admin[]>(() => initialAdmins);
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Admin | null>(null);

  const roleOptions = useMemo(
    () => [
      { value: 'admin', label: 'Admin' },
      { value: 'super_admin', label: 'Super Admin' },
      { value: 'manager', label: 'Manager' },
      { value: 'operator', label: 'Operator' },
    ],
    []
  );

  const statusOptions = useMemo(
    () => [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'suspended', label: 'Suspended' },
      { value: 'pending_activation', label: 'Pending Activation' },
    ],
    []
  );

  // Mock companies data
  const mockCompanies = [
    { id: '1', name: 'Sangamam Financial Services' },
    { id: '2', name: 'Green Valley Credit Union' },
    { id: '3', name: 'Rural Development Bank' },
    { id: '4', name: 'TechFin Solutions' },
    { id: '5', name: 'Community Savings Bank' },
  ];

  const handleEditChange = useCallback(
    (field: keyof Admin, value: Admin[keyof Admin]) => {
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

  const handleEditClick = useCallback((admin: Admin) => {
    setEditingAdminId(admin.id);
    setEditFormData({ ...admin });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingAdminId(null);
    setEditFormData(null);
  }, []);

  const handleSaveEdit = useCallback(
    (adminId: string) => {
      if (!editFormData || adminId !== editingAdminId) {
        return;
      }

      setAdminData(prev =>
        prev.map(admin =>
          admin.id === adminId ? { ...admin, ...editFormData } : admin
        )
      );
      setEditingAdminId(null);
      setEditFormData(null);
      showSuccessToast('Admin record updated successfully');
    },
    [editFormData, editingAdminId]
  );

  // Filtered admins based on search criteria
  const filteredAdmins = useMemo(() => {
    let filtered = [...adminData];

    // Search by type and term
    if (filters.searchTerm) {
      filtered = filtered.filter(admin => {
        let searchValue: string;
        switch (filters.searchType) {
          case 'name':
            searchValue = `${admin.firstName} ${admin.lastName}`;
            break;
          case 'email':
            searchValue = admin.email;
            break;
          case 'employeeId':
            searchValue = admin.employeeId;
            break;
          case 'phone':
            searchValue = admin.phone;
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
      filtered = filtered.filter(admin => admin.status === filters.status);
    }

    // Filter by role
    if (filters.role !== 'all') {
      filtered = filtered.filter(admin => admin.role === filters.role);
    }

    // Filter by company
    if (filters.companyId !== 'all') {
      filtered = filtered.filter(
        admin => admin.companyId === filters.companyId
      );
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter(
        admin => admin.joiningDate >= filters.dateFrom
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(admin => admin.joiningDate <= filters.dateTo);
    }

    return filtered;
  }, [filters, adminData]);

  // Table columns definition
  const columns = useMemo<ColumnDef<Admin>[]>(
    () => [
      {
        accessorKey: 'firstName',
        header: 'Name',
        cell: ({ row }) => {
          const admin = row.original;
          const isEditing = editingAdminId === admin.id && editFormData;

          if (isEditing && editFormData) {
            return (
              <div className="grid gap-1">
                <div className="grid grid-cols-1 gap-1">
                  <FormField
                    label="First Name"
                    name="firstName"
                    value={editFormData.firstName}
                    onChange={value => handleEditChange('firstName', value)}
                    placeholder="First Name"
                    className="!space-y-0 [&>label]:hidden"
                  />
                  <FormField
                    label="Last Name"
                    name="lastName"
                    value={editFormData.lastName}
                    onChange={value => handleEditChange('lastName', value)}
                    placeholder="Last Name"
                    className="!space-y-0 [&>label]:hidden"
                  />
                </div>
                <FormField
                  label="Employee ID"
                  name="employeeId"
                  value={editFormData.employeeId}
                  onChange={value => handleEditChange('employeeId', value)}
                  placeholder="Employee ID"
                  className="!space-y-0 [&>label]:hidden"
                />
              </div>
            );
          }

          return (
            <div className="flex items-center gap-2">
              <div>
                {admin.firstName} {admin.lastName}
                <div className="text-gray-500">{admin.employeeId}</div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ getValue, row }) => (
          <div className="flex items-center gap-1">
            {editingAdminId === row.original.id && editFormData ? (
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
              <span className="">{getValue() as string}</span>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ getValue, row }) => (
          <div className="flex items-center gap-1">
            {editingAdminId === row.original.id && editFormData ? (
              <FormField
                label="Phone"
                name="phone"
                value={editFormData.phone}
                onChange={value => handleEditChange('phone', value)}
                placeholder="Phone"
                className="!space-y-0 [&>label]:hidden"
              />
            ) : (
              <span className="">{getValue() as string}</span>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'department',
        header: 'Department',
        cell: ({ getValue, row }) =>
          editingAdminId === row.original.id && editFormData ? (
            <FormField
              label="Department"
              name="department"
              value={editFormData.department}
              onChange={value => handleEditChange('department', value)}
              placeholder="Department"
              className="!space-y-0 [&>label]:hidden"
            />
          ) : (
            <span className="">{getValue() as string}</span>
          ),
      },
      {
        accessorKey: 'designation',
        header: 'Designation',
        cell: ({ getValue, row }) =>
          editingAdminId === row.original.id && editFormData ? (
            <FormField
              label="Designation"
              name="designation"
              value={editFormData.designation}
              onChange={value => handleEditChange('designation', value)}
              placeholder="Designation"
              className="!space-y-0 [&>label]:hidden"
            />
          ) : (
            <span className="">{getValue() as string}</span>
          ),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ getValue, row }) => {
          const role = getValue() as string;
          const roleConfig = {
            admin: {
              bg: 'bg-blue-100 dark:bg-blue-900',
              text: 'text-blue-800 dark:text-blue-200',
              label: 'Admin',
            },
            super_admin: {
              bg: 'bg-purple-100 dark:bg-purple-900',
              text: 'text-purple-800 dark:text-purple-200',
              label: 'Super Admin',
            },
            manager: {
              bg: 'bg-green-100 dark:bg-green-900',
              text: 'text-green-800 dark:text-green-200',
              label: 'Manager',
            },
            operator: {
              bg: 'bg-gray-100 dark:bg-gray-900',
              text: 'text-gray-800 dark:text-gray-200',
              label: 'Operator',
            },
          };
          const config =
            roleConfig[role as keyof typeof roleConfig] || roleConfig.operator;

          if (editingAdminId === row.original.id && editFormData) {
            return (
              <FormField
                label="Role"
                name="role"
                type="select"
                value={editFormData.role}
                onChange={value =>
                  handleEditChange('role', value as Admin['role'])
                }
                options={roleOptions}
                placeholder="Select Role"
                className="!space-y-0 [&>label]:hidden"
              />
            );
          }

          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
            >
              {config.label}
            </span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue, row }) => {
          const status = getValue() as string;
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
            pending_activation: {
              bg: 'bg-blue-100 dark:bg-blue-900',
              text: 'text-blue-800 dark:text-blue-200',
              label: 'Pending',
            },
          };
          const config =
            statusConfig[status as keyof typeof statusConfig] ||
            statusConfig.active;

          if (editingAdminId === row.original.id && editFormData) {
            return (
              <FormField
                label="Status"
                name="status"
                type="select"
                value={editFormData.status}
                onChange={value =>
                  handleEditChange('status', value as Admin['status'])
                }
                options={statusOptions}
                placeholder="Select Status"
                className="!space-y-0 [&>label]:hidden"
              />
            );
          }

          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
            >
              {config.label}
            </span>
          );
        },
      },
      {
        accessorKey: 'companyName',
        header: 'Company',
        cell: ({ getValue, row }) => (
          <div className="flex items-center gap-1">
            {editingAdminId === row.original.id && editFormData ? (
              <FormField
                label="Company"
                name="companyName"
                value={editFormData.companyName}
                onChange={value => handleEditChange('companyName', value)}
                placeholder="Company"
                className="!space-y-0 [&>label]:hidden"
              />
            ) : (
              <span className="">{getValue() as string}</span>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'city',
        header: 'Location',
        cell: ({ row }) => {
          const admin = row.original;

          if (editingAdminId === admin.id && editFormData) {
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
                {admin.city}, {admin.state}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: 'joiningDate',
        header: 'Joining Date',
        cell: ({ getValue, row }) =>
          editingAdminId === row.original.id && editFormData ? (
            <FormField
              label="Joining Date"
              name="joiningDate"
              type="date"
              value={editFormData.joiningDate}
              onChange={value => handleEditChange('joiningDate', value)}
              className="!space-y-0 [&>label]:hidden"
            />
          ) : (
            <div className="flex items-center gap-1">
              <span className="">
                {new Date(getValue() as string).toLocaleDateString()}
              </span>
            </div>
          ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const admin = row.original;

          if (editingAdminId === admin.id) {
            return (
              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleSaveEdit(admin.id)}
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
                  showSuccessToast(
                    `Viewing admin ${admin.firstName} ${admin.lastName}`
                  );
                }}
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleEditClick(admin);
                }}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  showSuccessToast(
                    `Managing permissions for ${admin.firstName} ${admin.lastName}`
                  );
                }}
              >
                <Shield className="w-4 h-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [
      editFormData,
      editingAdminId,
      handleEditChange,
      handleEditClick,
      handleCancelEdit,
      handleSaveEdit,
      roleOptions,
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
      searchType: 'name',
      searchTerm: '',
      status: 'all',
      role: 'all',
      companyId: 'all',
      dateFrom: '',
      dateTo: '',
    });
  };

  return (
    <>
      <Section
        title="Admins"
        menuId="view-admins"
        icon={Filter}
        className="mb-6"
        showBreadcrumbs
        buttonText="Create Admin"
        buttonIcon={Plus}
        onButtonClick={() => navigate('/dashboard/super-admin/admins/create')}
        contentClassName="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* Search Type and Term */}
        <FormField
          label="Search Type"
          name="searchType"
          type="select"
          value={filters.searchType}
          onChange={(value: string) =>
            handleFilterChange('searchType', value as any)
          }
          options={[
            { value: 'name', label: 'Name' },
            { value: 'email', label: 'Email' },
            { value: 'employeeId', label: 'Employee ID' },
            { value: 'phone', label: 'Phone' },
          ]}
        />

        <FormField
          label="Enter Search"
          name="searchTerm"
          placeholder={`Search by ${filters.searchType}`}
          value={filters.searchTerm}
          onChange={(value: string) => handleFilterChange('searchTerm', value)}
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
            { value: 'pending_activation', label: 'Pending Activation' },
          ]}
        />

        {/* Role Filter */}
        <FormField
          label="Role"
          name="role"
          type="select"
          value={filters.role}
          onChange={(value: string) => handleFilterChange('role', value)}
          options={[
            { value: 'all', label: 'All' },
            { value: 'admin', label: 'Admin' },
            { value: 'super_admin', label: 'Super Admin' },
            { value: 'manager', label: 'Manager' },
            { value: 'operator', label: 'Operator' },
          ]}
        />

        {/* Company Filter */}
        <FormField
          label="Company"
          name="companyId"
          type="select"
          value={filters.companyId}
          onChange={(value: string) => handleFilterChange('companyId', value)}
          options={[
            { value: 'all', label: 'All Companies' },
            ...mockCompanies.map(company => ({
              value: company.id,
              label: company.name,
            })),
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

        <div className="col-span-full mt-5 flex items-center justify-start gap-3">
          <Button
            variant="default"
            onClick={() => {
              showSuccessToast(
                `Found ${filteredAdmins.length} admins matching criteria`
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

      {/* Admins Table */}
      <Section title="Admins List">
        <TanStackTable
          data={filteredAdmins}
          columns={columns}
          enableServerSidePagination={false}
          enableColumnVisibility={true}
          enableColumnReordering={true}
          enableRowSelection={false}
          onSelectionChange={selection => {
            console.log('Selected admins:', selection);
          }}
        />
      </Section>
    </>
  );
};

export default AdminListPage;
