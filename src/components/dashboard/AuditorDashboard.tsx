import React from 'react';
import {
  DashboardSection,
  StatsGrid,
  QuickActions,
  RecentActivity,
} from '../common';

const AuditorDashboard: React.FC = () => {
  // Stats data
  const statsData = [
    {
      title: 'Audits Completed',
      value: '47',
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
      iconBgColor: 'bg-green-100 dark:bg-green-900/20',
      iconColor: 'text-green-600',
      change: { value: '+5', type: 'increase' as const },
    },
    {
      title: 'Pending Reviews',
      value: '12',
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
      change: { value: '-2', type: 'decrease' as const },
    },
    {
      title: 'Compliance Score',
      value: '98.5%',
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
      change: { value: '+1.2%', type: 'increase' as const },
    },
    {
      title: 'Risk Alerts',
      value: '3',
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
      iconBgColor: 'bg-red-100 dark:bg-red-900/20',
      iconColor: 'text-red-600',
      change: { value: '-1', type: 'decrease' as const },
    },
  ];

  // Quick actions data
  const quickActions = [
    {
      id: 'start-audit',
      title: 'Start New Audit',
      description: 'Begin a new compliance audit',
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
      onClick: () => console.log('Start audit clicked'),
    },
    {
      id: 'review-reports',
      title: 'Review Reports',
      description: 'Review audit reports and findings',
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
      onClick: () => console.log('Review reports clicked'),
    },
    {
      id: 'compliance-check',
      title: 'Compliance Check',
      description: 'Run compliance verification checks',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      onClick: () => console.log('Compliance check clicked'),
    },
    {
      id: 'risk-assessment',
      title: 'Risk Assessment',
      description: 'Conduct risk assessment analysis',
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
      onClick: () => console.log('Risk assessment clicked'),
    },
  ];

  // Recent activities data
  const recentActivities = [
    {
      id: '1',
      title: 'Audit Completed',
      description: 'Completed Q3 compliance audit for branch #001',
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
      title: 'Risk Alert Generated',
      description: 'High-risk transaction pattern detected in account #7890',
      time: '4 hours ago',
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
    {
      id: '3',
      title: 'Compliance Report Generated',
      description: 'Monthly compliance report generated and sent to management',
      time: '1 day ago',
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
    <div className="min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardSection title="Audit Overview">
          <StatsGrid stats={statsData} />
        </DashboardSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <QuickActions
            title="Audit Operations"
            actions={quickActions}
            columns={2}
          />
          <RecentActivity
            title="Recent Audit Activity"
            activities={recentActivities}
            maxItems={5}
          />
        </div>
      </div>
    </div>
  );
};

export default AuditorDashboard;
