import type { ReactNode } from 'react';
import JobSeekerHeader from './JobSeekerHeader';
import LandingHeader from '@/websites/jobSeekers/components/LandingHeader';

type WebsiteShellProps = {
  children: ReactNode;
  authenticated?: boolean;
  hideHeaderForSectionId?: string;
};

const WebsiteShell = ({
  children,
  authenticated = false,
  hideHeaderForSectionId,
}: WebsiteShellProps) => (
  <div className="min-h-screen bg-gray-50 dark:bg-[#0b1220] text-gray-900 dark:text-slate-100">
    {authenticated ? (
      <JobSeekerHeader />
    ) : (
      <LandingHeader hideForSectionId={hideHeaderForSectionId} />
    )}
    <main>{children}</main>
  </div>
);

export default WebsiteShell;
