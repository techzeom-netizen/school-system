import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import TanStackTable from '@/components/common/TanStackTable';
import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';

// Customer type
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin: string;
}

// Mock data
const mockCustomers: Customer[] = Array.from({ length: 50 }, (_, i) => ({
  id: `CUST-${String(i + 1).padStart(4, '0')}`,
  name: `Customer ${i + 1}`,
  email: `customer${i + 1}@example.com`,
  phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
  status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)] as
    | 'active'
    | 'inactive'
    | 'pending',
  createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0],
  lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0],
}));

// Mock server-side data fetch
const fetchCustomers = async (
  page: number,
  pageSize: number,
  search?: string,
  sortBy?: string,
  sortDirection?: 'asc' | 'desc'
) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  let filteredData = [...mockCustomers];

  // Apply search filter
  if (search) {
    filteredData = filteredData.filter(
      customer =>
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone.includes(search) ||
        customer.id.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Apply sorting
  if (sortBy && sortDirection) {
    filteredData.sort((a, b) => {
      const aValue = a[sortBy as keyof Customer];
      const bValue = b[sortBy as keyof Customer];

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  // Apply pagination
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    totalCount: filteredData.length,
    totalPages: Math.ceil(filteredData.length / pageSize),
  };
};

export default function CustomersPageSimplified() {
  // Column definitions
  const columns: ColumnDef<Customer>[] = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Customer ID',
        size: 120,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        size: 200,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 250,
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        size: 150,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 120,
        cell: ({ getValue }) => {
          const status = getValue() as string;
          const statusColors = {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-red-100 text-red-800',
            pending: 'bg-yellow-100 text-yellow-800',
          };
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors]}`}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        size: 120,
        cell: ({ getValue }) => {
          const date = getValue() as string;
          return new Date(date).toLocaleDateString();
        },
      },
      {
        accessorKey: 'lastLogin',
        header: 'Last Login',
        size: 120,
        cell: ({ getValue }) => {
          const date = getValue() as string;
          return new Date(date).toLocaleDateString();
        },
      },
    ],
    []
  );

  const handleRowClick = (row: any) => {
    console.log('Customer clicked:', row.original);
    // Navigate to customer detail page
  };

  const handleSelectionChange = (selectedCustomers: Customer[]) => {
    console.log('Selected customers:', selectedCustomers);
  };

  const handleExport = () => {
    console.log('Export customers');
  };

  const handleAddCustomer = () => {
    console.log('Add new customer');
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
            <p className="text-muted-foreground">
              Manage your customer database
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleAddCustomer}>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </div>

        {/* TanStackTable with minimal configuration */}
        <TanStackTable
          data={[]} // Empty - server-side data fetching
          columns={columns}
          enableSearch={true}
          enableSorting={true}
          enableColumnVisibility={true}
          enableColumnReordering={true}
          enablePagination={true}
          enableServerSidePagination={true}
          enableRowSelection={true}
          pageSize={20}
          pageSizeOptions={[10, 20, 50, 100]}
          onDataFetch={fetchCustomers}
          onRowClick={handleRowClick}
          onSelectionChange={handleSelectionChange}
          searchPlaceholder="Search customers, emails, phones, or IDs..."
          emptyMessage="No customers found"
        />
      </div>
    </DashboardLayout>
  );
}
