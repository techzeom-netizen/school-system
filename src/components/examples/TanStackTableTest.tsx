import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import TanStackTable from '../common/TanStackTable';

// Sample data type
interface TestData {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Sample data
const sampleData: TestData[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'inactive',
    createdAt: '2024-01-02',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    status: 'active',
    createdAt: '2024-01-03',
  },
];

// Mock server-side data fetch function
const mockDataFetch = async (
  page: number,
  pageSize: number,
  search?: string,
  sortBy?: string,
  sortDirection?: 'asc' | 'desc'
) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  let filteredData = [...sampleData];

  // Apply search filter
  if (search) {
    filteredData = filteredData.filter(
      item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Apply sorting
  if (sortBy && sortDirection) {
    filteredData.sort((a, b) => {
      const aValue = a[sortBy as keyof TestData];
      const bValue = b[sortBy as keyof TestData];

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

export default function TanStackTableTest() {
  // Column definitions
  const columns: ColumnDef<TestData>[] = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 80,
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
        accessorKey: 'status',
        header: 'Status',
        size: 100,
        cell: ({ getValue }) => {
          const status = getValue() as string;
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Created At',
        size: 150,
      },
    ],
    []
  );

  const handleRowClick = (row: any) => {
    // eslint-disable-next-line no-console
    console.log('Row clicked:', row.original);
  };

  const handleSelectionChange = (selectedRows: TestData[]) => {
    // eslint-disable-next-line no-console
    console.log('Selected rows:', selectedRows);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">TanStackTable Test</h2>
        <p className="text-gray-600 mb-6">
          Testing all functionality: search, sorting, pagination, column
          visibility, row selection, and server-side data fetching.
        </p>
      </div>

      {/* Client-side Table */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Client-side Table</h3>
        <TanStackTable
          data={sampleData}
          columns={columns}
          enableSearch={true}
          enableSorting={true}
          enableColumnVisibility={true}
          enableColumnReordering={true}
          enablePagination={true}
          enableRowSelection={true}
          pageSize={10}
          onRowClick={handleRowClick}
          onSelectionChange={handleSelectionChange}
        />
      </div>

      {/* Server-side Table */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Server-side Table</h3>
        <TanStackTable
          data={[]} // Empty initial data - will be populated by onDataFetch
          columns={columns}
          enableSearch={true}
          enableSorting={true}
          enableColumnVisibility={true}
          enableColumnReordering={true}
          enablePagination={true}
          enableServerSidePagination={true}
          enableRowSelection={true}
          pageSize={2}
          pageSizeOptions={[2, 5, 10]}
          onDataFetch={mockDataFetch}
          onRowClick={handleRowClick}
          onSelectionChange={handleSelectionChange}
          searchPlaceholder="Search by name or email..."
        />
      </div>
    </div>
  );
}
