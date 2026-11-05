import React from 'react';
import {
  DashboardSection,
  StatsGrid,
  QuickActions,
  RecentActivity,
} from '../common';

const ManagerDashboard: React.FC = () => {
  // Stats data
  const statsData = [
    {
      title: 'Total Customers',
      value: '2,847',
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
      iconBgColor: 'bg-blue-100 dark:bg-blue-900/20',
      iconColor: 'text-blue-600',
      change: { value: '+12%', type: 'increase' as const },
    },
    {
      title: 'Total Assets',
      value: '$45.2M',
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
      change: { value: '+8.2%', type: 'increase' as const },
    },
    {
      title: 'Active Loans',
      value: '1,234',
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
      iconBgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      iconColor: 'text-yellow-600',
      change: { value: '-2.1%', type: 'decrease' as const },
    },
    {
      title: 'Pending Approvals',
      value: '89',
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
      iconBgColor: 'bg-red-100 dark:bg-red-900/20',
      iconColor: 'text-red-600',
      change: { value: '+5', type: 'increase' as const },
    },
  ];

  // Quick actions data
  const quickActions = [
    {
      id: 'approve-loans',
      title: 'Approve Loans',
      description: 'Review and approve pending loan applications',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      onClick: () => console.log('Approve loans clicked'),
    },
    {
      id: 'view-reports',
      title: 'View Reports',
      description: 'Access detailed financial reports',
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
      onClick: () => console.log('View reports clicked'),
    },
    {
      id: 'manage-team',
      title: 'Manage Team',
      description: 'Manage team members and permissions',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      onClick: () => console.log('Manage team clicked'),
    },
  ];

  // Recent activities data
  const recentActivities = [
    {
      id: '1',
      title: 'Loan Application Approved',
      description: 'Approved loan application for John Smith - $25,000',
      time: '2 hours ago',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      status: 'success' as const,
    },
    {
      id: '2',
      title: 'New Customer Registration',
      description: 'Sarah Johnson opened a new savings account',
      time: '4 hours ago',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      status: 'info' as const,
    },
    {
      id: '3',
      title: 'High-Risk Transaction Alert',
      description: 'Large withdrawal detected from account #1234',
      time: '6 hours ago',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      ),
      status: 'warning' as const,
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardSection title="Key Metrics">
          <StatsGrid stats={statsData} />
        </DashboardSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <QuickActions
            title="Quick Actions"
            actions={quickActions}
            columns={2}
          />
          <RecentActivity
            title="Recent Activity"
            activities={recentActivities}
            maxItems={5}
          />
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
