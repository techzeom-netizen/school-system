import React from 'react';
import {
  Briefcase,
  Building2,
  CalendarCheck,
  CreditCard,
  FileText,
  GraduationCap,
  Search,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import { getRoleDisplayName } from '@/utils/roleUtils';

const roleContent = {
  [UserRole.SUPER_ADMIN]: {
    title: 'Adminstration Command Center',
    subtitle:
      'Monitor KD Public School users, staff, parents, and school activity.',
    stats: [
      ['Active students', '1,248', Briefcase],
      ['branches', '32', Building2],
      ['staff and teachers', '24.6K', Users],
    ],
    actions: [
      'Review platform health',
      'Manage Branches',
      'Audit Students listings',
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
    title: 'Parent Dashboard',
    subtitle:
      'Stay connected with your children’s learning, attendance, fees, and school updates.',
    stats: [
      ['Children enrolled', '2', GraduationCap],
      ['Attendance this month', '96%', CalendarCheck],
      ['Pending fees', '₹12,500', CreditCard],
    ],
    actions: ['View attendance', 'Check fee details', 'Read school notices'],
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
          {user.role === UserRole.EMPLOYEE
            ? 'Parent Portal'
            : getRoleDisplayName(user.role)}
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
            <Button
              key={action}
              type="button"
              variant="outline"
              className="h-auto justify-start px-4 py-3 text-left text-sm font-medium"
            >
              {action}
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
