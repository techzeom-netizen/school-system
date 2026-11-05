import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DashboardSection,
  StatsGrid,
  QuickActions,
  RecentActivity,
} from '../common';

const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Enhanced stats data for Super Admin - focused on platform management
  const statsData = [
    {
      title: 'Total Companies',
      value: '1,247',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      iconBgColor: 'bg-blue-100 dark:bg-blue-900/20',
      iconColor: 'text-blue-600',
      change: { value: '+25', type: 'increase' as const },
    },
    {
      title: 'Active Users',
      value: '3,456',
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
      iconBgColor: 'bg-green-100 dark:bg-green-900/20',
      iconColor: 'text-green-600',
      change: { value: '+156', type: 'increase' as const },
    },
    {
      title: 'System Health',
      value: '99.99%',
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
      change: { value: '+0.01%', type: 'increase' as const },
    },
    {
      title: 'Security Alerts',
      value: '2',
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
    {
      title: 'Database Size',
      value: '2.4 TB',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
          />
        </svg>
      ),
      iconBgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
      iconColor: 'text-indigo-600',
      change: { value: '+120 GB', type: 'increase' as const },
    },
    {
      title: 'API Requests',
      value: '1.2M',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      iconBgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      iconColor: 'text-yellow-600',
      change: { value: '+15%', type: 'increase' as const },
    },
  ];

  // Quick actions aligned with the 3 main Super Admin categories
  const quickActions = [
    {
      id: 'create-company',
      title: 'Create Company',
      description: 'Add a new company to the platform',
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
      onClick: () => navigate('/super-admin/company/create'),
    },
    {
      id: 'manage-companies',
      title: 'Manage Companies',
      description: 'View and manage all companies & their websites',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      onClick: () => navigate('/super-admin/company/manage'),
    },
    {
      id: 'create-admin',
      title: 'Create Admin',
      description: 'Create a new company administrator',
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
      onClick: () => navigate('/super-admin/admin/create'),
    },
    {
      id: 'manage-admins',
      title: 'Manage Admins',
      description: 'View and manage all company admins',
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
      onClick: () => navigate('/super-admin/admin/manage'),
    },
    {
      id: 'global-settings',
      title: 'Global Settings',
      description: 'Configure platform-wide settings',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      onClick: () => navigate('/super-admin/system/global'),
    },
    {
      id: 'security-settings',
      title: 'Security Settings',
      description: 'Configure platform security policies',
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
      onClick: () => navigate('/super-admin/system/security'),
    },
  ];

  // Recent activities focused on platform management
  const recentActivities = [
    {
      id: '1',
      title: 'New Company Created',
      description: 'Sangamam Financial Services added to the platform',
      time: '30 minutes ago',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      status: 'success' as const,
    },
    {
      id: '2',
      title: 'Admin Account Created',
      description: 'New admin created for TechCorp Banking Solutions',
      time: '2 hours ago',
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
      title: 'Security Settings Updated',
      description: 'Global security policies updated across all companies',
      time: '4 hours ago',
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
      status: 'success' as const,
    },
    {
      id: '4',
      title: 'System Backup Completed',
      description: 'Daily platform backup completed successfully',
      time: '6 hours ago',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
      ),
      status: 'success' as const,
    },
    {
      id: '5',
      title: 'Audit Log Generated',
      description: 'Monthly audit report generated for compliance',
      time: '8 hours ago',
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
      status: 'success' as const,
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardSection title="Platform Overview">
          <StatsGrid stats={statsData} />
        </DashboardSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <QuickActions
            title="Platform Management"
            actions={quickActions}
            columns={2}
          />
          <RecentActivity
            title="Platform Activity"
            activities={recentActivities}
            maxItems={5}
          />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
