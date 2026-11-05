import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import FindCompanies from '@/features/jobseekers/components/FindCompanies/FindCompanies';
import JobSeekerLoginDialog from '@/features/jobseekers/components/JobSeekerLoginDialog';
import WebsiteShell from '@/features/jobseekers/components/WebsiteShell';
import { PublicFooter } from './components/PublicLanding';

const SearchCompaniesPage = () => {
  const { isAuthenticated } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginCompanyId, setLoginCompanyId] = useState<string>();

  return (
    <WebsiteShell hideHeaderForSectionId="company-results">
      <FindCompanies
        embedded
        basePath="/companies"
        onFollowRequest={
          isAuthenticated
            ? undefined
            : id => {
                setLoginCompanyId(id);
                setLoginOpen(true);
              }
        }
      />
      <PublicFooter />
      <JobSeekerLoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        redirectTo={
          loginCompanyId ? `/jobseekers/companies/${loginCompanyId}` : undefined
        }
      />
    </WebsiteShell>
  );
};

export default SearchCompaniesPage;
