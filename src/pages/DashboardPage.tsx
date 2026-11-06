import React from 'react';
import {
  Briefcase,
  Building2,
  CalendarCheck,
  FileText,
  Search,
  Users,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import { getRoleDisplayName } from '@/utils/roleUtils';

const roleContent = {
  [UserRole.SUPER_ADMIN]: {
    title: 'Platform Command Center',
    subtitle:
      'Monitor KD Public School users, staff, parents, and school activity.',
    stats: [
      ['Active jobs', '1,248', Briefcase],
      ['Companies', '312', Building2],
      ['Users', '24.6K', Users],
    ],
    actions: [
      'Review platform health',
      'Manage companies',
      'Audit job listings',
    ],
  },
  [UserRole.ADMIN]: {
    title: 'Admin Dashboard',
    subtitle: 'Manage platform operations, companies, jobs, and users.',
    stats: [
      ['Active jobs', '842', Briefcase],
      ['Companies', '186', Building2],
      ['Users', '12.4K', Users],
    ],
    actions: ['Manage users', 'Review companies', 'Monitor job activity'],
  },
  [UserRole.JOB_SEEKER]: {
    title: 'Job Seeker Dashboard',
    subtitle: 'Find roles, track applications, and keep your profile ready.',
    stats: [
      ['Recommended jobs', '38', Search],
      ['Applications', '12', FileText],
      ['Interviews', '3', CalendarCheck],
    ],
    actions: ['Browse matched jobs', 'Update resume', 'Track applications'],
  },
  [UserRole.EMPLOYEE]: {
    title: 'Employer Dashboard',
    subtitle: 'Post jobs, review applicants, and manage hiring pipelines.',
    stats: [
      ['Open jobs', '16', Briefcase],
      ['Applicants', '428', Users],
      ['Hiring teams', '9', Building2],
    ],
    actions: ['Post a new job', 'Review applicants', 'Manage company profile'],
  },
};

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const content = roleContent[user.role];

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
          {getRoleDisplayName(user.role)}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          {content.title}
        </h1>
        <p className="mt-2 max-w-3xl text-gray-600 dark:text-gray-300">
          {content.subtitle}
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {content.stats.map(([label, value, Icon]) => (
          <div
            key={label as string}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {label as string}
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
                  {value as string}
                </p>
              </div>
              <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Quick Actions
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {content.actions.map(action => (
            <button
              key={action}
              type="button"
              className="rounded-md border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:text-gray-200 dark:hover:border-blue-600 dark:hover:bg-blue-900/20"
            >
              {action}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
