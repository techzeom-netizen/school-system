import type { ReactNode } from 'react';
import JobSeekerHeader from '../components/JobSeekerHeader';

type JobSeekerDashboardLayoutProps = {
  children: ReactNode;
};

const JobSeekerDashboardLayout = ({
  children,
}: JobSeekerDashboardLayoutProps) => (
  <div
    className="min-h-screen bg-gray-50 dark:bg-[#0c1320fb] text-gray-900 dark:text-slate-100"
    draggable={false}
  >
    <JobSeekerHeader />
    <main>{children}</main>
  </div>
);

export default JobSeekerDashboardLayout;
