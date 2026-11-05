import React, { useState, useEffect } from 'react';
import { Card } from '../ui';
import {
  ErrorBoundary,
  DataCard,
  DataTable,
  SkeletonStats,
  DashboardSection,
  QuickActions,
} from '../common';
import { useAuth } from '../../hooks/useAuth';

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Mock data
  const accountsData = [
    {
      id: 1,
      name: 'Savings Account',
      number: '****1234',
      balance: 8234.56,
      type: 'Savings',
      apy: '2.5%',
    },
    {
      id: 2,
      name: 'Checking Account',
      number: '****5678',
      balance: 4111.11,
      type: 'Checking',
      apy: 'No fees',
    },
  ];

  const transactionsData = [
    {
      id: 1,
      description: 'Salary Deposit',
      date: 'Today, 9:00 AM',
      amount: 3500.0,
      type: 'credit',
      category: 'Income',
    },
    {
      id: 2,
      description: 'Grocery Store',
      date: 'Yesterday, 2:30 PM',
      amount: -87.45,
      type: 'debit',
      category: 'Shopping',
    },
    {
      id: 3,
      description: 'Transfer to Savings',
      date: '2 days ago',
      amount: -500.0,
      type: 'transfer',
      category: 'Transfer',
    },
  ];

  // Stats data for customer dashboard (currently unused but available for future use)
  /*
  const statsData = [
    {
      title: 'Total Balance',
      value: '$12,345.67',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      iconBgColor: 'bg-green-100 dark:bg-green-900/20',
      iconColor: 'text-green-600',
      change: { value: '+$234.56', type: 'increase' as const }
    },
    {
      title: 'Monthly Income',
      value: '$4,500.00',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      iconBgColor: 'bg-blue-100 dark:bg-blue-900/20',
      iconColor: 'text-blue-600',
      change: { value: '+$200.00', type: 'increase' as const }
    },
    {
      title: 'Monthly Expenses',
      value: '$2,800.00',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      ),
      iconBgColor: 'bg-red-100 dark:bg-red-900/20',
      iconColor: 'text-red-600',
      change: { value: '-$150.00', type: 'decrease' as const }
    },
    {
      title: 'Savings Rate',
      value: '37.8%',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      iconBgColor: 'bg-purple-100 dark:bg-purple-900/20',
      iconColor: 'text-purple-600',
      change: { value: '+2.1%', type: 'increase' as const }
    }
  ];
  */

  // Quick actions data
  const quickActions = [
    {
      id: 'transfer-money',
      title: 'Transfer Money',
      description: 'Transfer funds between accounts',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
      ),
      onClick: () => console.log('Transfer money clicked'),
    },
    {
      id: 'pay-bills',
      title: 'Pay Bills',
      description: 'Pay your bills and utilities',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      onClick: () => console.log('Pay bills clicked'),
    },
    {
      id: 'deposit-check',
      title: 'Deposit Check',
      description: 'Deposit a check using mobile banking',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      ),
      onClick: () => console.log('Deposit check clicked'),
    },
    {
      id: 'view-statements',
      title: 'View Statements',
      description: 'Download your account statements',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      onClick: () => console.log('View statements clicked'),
    },
  ];

  const accountsColumns = [
    {
      key: 'name',
      title: 'Account',
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
      key: 'balance',
      title: 'Balance',
      align: 'right' as const,
      render: (value: number, record: any) => (
        <div className="text-right">
          <div className="font-semibold text-gray-900 dark:text-white">
            ${value.toLocaleString()}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">
            {record.apy}
          </div>
        </div>
      ),
    },
  ];

  const transactionsColumns = [
    {
      key: 'description',
      title: 'Transaction',
      render: (value: string, record: any) => (
        <div className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              record.type === 'credit'
                ? 'bg-green-100'
                : record.type === 'debit'
                  ? 'bg-red-100'
                  : 'bg-blue-100'
            }`}
          >
            <svg
              className={`w-5 h-5 ${
                record.type === 'credit'
                  ? 'text-green-600'
                  : record.type === 'debit'
                    ? 'text-red-600'
                    : 'text-blue-600'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {record.type === 'credit' ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              ) : record.type === 'debit' ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              )}
            </svg>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {value}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {record.date}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'amount',
      title: 'Amount',
      align: 'right' as const,
      render: (value: number) => (
        <div
          className={`text-sm font-semibold ${
            value > 0
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        >
          {value > 0 ? '+' : ''}${Math.abs(value).toFixed(2)}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Custom Header with gradient */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p className="text-xl text-blue-100">
                Manage your accounts and transactions with ease
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <ErrorBoundary>
          {loading ? (
            <SkeletonStats className="mb-8" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <DataCard
                title="Total Balance"
                subtitle="All accounts combined"
                icon={
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                }
                value="$12,345.67"
                change={{ value: '+2.5% from last month', type: 'positive' }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-xl transition-all duration-300"
              />

              <DataCard
                title="Active Accounts"
                subtitle="Total number of accounts"
                icon={
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                }
                value="3"
                change={{ value: 'All accounts active', type: 'neutral' }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-xl transition-all duration-300"
              />

              <DataCard
                title="This Month"
                subtitle="Net income"
                icon={
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                }
                value="+$2,450"
                change={{ value: 'Net income', type: 'positive' }}
                className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 hover:shadow-xl transition-all duration-300"
              />
            </div>
          )}
        </ErrorBoundary>

        {/* Quick Actions */}
        <DashboardSection title="Quick Actions">
          <QuickActions actions={quickActions} columns={4} />
        </DashboardSection>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Accounts */}
          <ErrorBoundary>
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  My Accounts
                </h2>
                <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                  View All
                </button>
              </div>
              <DataTable
                data={accountsData}
                columns={accountsColumns}
                loading={loading}
                error={error || undefined}
                emptyMessage="No accounts found"
                className="border-0 shadow-none"
              />
            </Card>
          </ErrorBoundary>

          {/* Recent Transactions */}
          <ErrorBoundary>
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Transactions
                </h2>
                <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                  View All
                </button>
              </div>
              <DataTable
                data={transactionsData}
                columns={transactionsColumns}
                loading={loading}
                error={error || undefined}
                emptyMessage="No transactions found"
                className="border-0 shadow-none"
              />
            </Card>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
