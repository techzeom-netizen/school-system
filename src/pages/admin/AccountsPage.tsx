import React from 'react';
import { ErrorBoundary, DataTable } from '@/components/common';
import DashboardLayout from '@/layouts/DashboardLayout';

const AccountsPage: React.FC = () => {
  // Mock data for accounts
  const accountsData = [
    {
      id: 1,
      name: 'Savings Account',
      number: '****1234',
      balance: 8234.56,
      type: 'Savings',
      apy: '2.5%',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Checking Account',
      number: '****5678',
      balance: 4111.11,
      type: 'Checking',
      apy: 'No fees',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Business Account',
      number: '****9012',
      balance: 15678.9,
      type: 'Business',
      apy: '1.8%',
      status: 'Active',
    },
  ];

  const columns = [
    {
      key: 'name',
      title: 'Account Name',
      render: (value: string, record: any) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {value}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {record.number}
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      title: 'Type',
      render: (value: string) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
          {value}
        </span>
      ),
    },
    {
      key: 'balance',
      title: 'Balance',
      align: 'right' as const,
      render: (value: number) => (
        <div className="text-right">
          <div className="font-semibold text-gray-900 dark:text-white">
            ${value.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Available
          </div>
        </div>
      ),
    },
    {
      key: 'apy',
      title: 'APY/Fees',
      align: 'center' as const,
      render: (value: string) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {value}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      align: 'center' as const,
      render: (value: string) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
          {value}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Accounts
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage and view all your bank accounts
          </p>
        </div>

        {/* Accounts Table */}
        <ErrorBoundary>
          <DataTable
            data={accountsData}
            columns={columns}
            loading={false}
            emptyMessage="No accounts found"
            className="shadow-sm"
          />
        </ErrorBoundary>
      </div>
    </DashboardLayout>
  );
};

export default AccountsPage;
