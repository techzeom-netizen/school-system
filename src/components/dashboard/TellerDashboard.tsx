import React from 'react';
import {
  DashboardSection,
  StatsGrid,
  QuickActions,
  RecentActivity,
} from '../common';

const TellerDashboard: React.FC = () => {
  // Stats data
  const statsData = [
    {
      title: 'Transactions Today',
      value: '127',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      iconBgColor: 'bg-blue-100 dark:bg-blue-900/20',
      iconColor: 'text-blue-600',
      change: { value: '+8%', type: 'increase' as const },
    },
    {
      title: 'Cash on Hand',
      value: '$12,450',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
      iconBgColor: 'bg-green-100 dark:bg-green-900/20',
      iconColor: 'text-green-600',
      change: { value: '-$200', type: 'decrease' as const },
    },
    {
      title: 'Customers Served',
      value: '89',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      iconBgColor: 'bg-purple-100 dark:bg-purple-900/20',
      iconColor: 'text-purple-600',
      change: { value: '+12', type: 'increase' as const },
    },
    {
      title: 'Pending Deposits',
      value: '23',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      iconBgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      iconColor: 'text-yellow-600',
      change: { value: '+3', type: 'increase' as const },
    },
  ];

  // Quick actions data
  const quickActions = [
    {
      id: 'process-deposit',
      title: 'Process Deposit',
      description: 'Process customer deposits and cash',
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
      onClick: () => console.log('Process deposit clicked'),
    },
    {
      id: 'process-withdrawal',
      title: 'Process Withdrawal',
      description: 'Process customer withdrawals',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 12H4"
          />
        </svg>
      ),
      onClick: () => console.log('Process withdrawal clicked'),
    },
    {
      id: 'balance-inquiry',
      title: 'Balance Inquiry',
      description: 'Check customer account balances',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      onClick: () => console.log('Balance inquiry clicked'),
    },
    {
      id: 'transfer-funds',
      title: 'Transfer Funds',
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
      onClick: () => console.log('Transfer funds clicked'),
    },
  ];

  // Recent activities data
  const recentActivities = [
    {
      id: '1',
      title: 'Deposit Processed',
      description: 'Processed $2,500 deposit for account #1234',
      time: '15 minutes ago',
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
      status: 'success' as const,
    },
    {
      id: '2',
      title: 'Withdrawal Completed',
      description: 'Processed $500 withdrawal for account #5678',
      time: '32 minutes ago',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 12H4"
          />
        </svg>
      ),
      status: 'success' as const,
    },
    {
      id: '3',
      title: 'Balance Inquiry',
      description: 'Checked balance for account #9012',
      time: '45 minutes ago',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      status: 'info' as const,
    },
  ];

  return (
    <div className="min-h-scree">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardSection title="Daily Overview">
          <StatsGrid stats={statsData} />
        </DashboardSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <QuickActions
            title="Teller Operations"
            actions={quickActions}
            columns={2}
          />
          <RecentActivity
            title="Recent Transactions"
            activities={recentActivities}
            maxItems={5}
          />
        </div>
      </div>
    </div>
  );
};

export default TellerDashboard;
