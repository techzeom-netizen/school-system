import { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import RecruiterHeader from '@/features/recruiters/components/RecruiterHeader';
import {
  AssuranceStrip,
  CandidateSearchShowcase,
  ComparisonSection,
  CtaBanner,
  EmployerFooter,
  EmployerHero,
  FaqSection,
  FeaturesSection,
  HrmsSection,
  HowItWorks,
  IndustriesSection,
  // PricingSection,
  PostJobSection,
  RecruiterRegisterView,
  ReviewsSection,
} from './Components';

const sectionByPath: Record<string, string> = {
  '/employer/post-job': 'post-job',
  '/employer/search-candidate': 'candidate-search',
  '/employer/works': 'how-it-works',
};

const EmployerPortalPage = () => {
  const { hash, pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view') === 'register' ? 'register' : 'login';

  const openRegister = () => {
    window.history.replaceState(null, '', '/employer');
    navigate('/employer?view=register');
  };
  const openLogin = () => navigate('/employer', { replace: true });

  useEffect(() => {
    if (view === 'register') {
      window.scrollTo({ top: 0 });
      return;
    }

    const hashTargetId = hash ? decodeURIComponent(hash.slice(1)) : '';
    const targetId = hashTargetId || sectionByPath[pathname];

    if (!targetId) {
      window.scrollTo({ top: 0 });
      return;
    }

    window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    });
  }, [hash, pathname, view]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <RecruiterHeader />
      {view === 'register' ? (
        <RecruiterRegisterView onLogin={openLogin} />
      ) : (
        <>
          <main className="-mt-12">
            <EmployerHero onRegister={openRegister} />
            <AssuranceStrip />
            <FeaturesSection />
            <HrmsSection onRegister={openRegister} />
            <PostJobSection onRegister={openRegister} />
            <CandidateSearchShowcase onRegister={openRegister} />
            <HowItWorks />
            <IndustriesSection />
            {/* <StatsBand /> */}
            <ComparisonSection />
            {/* <PricingSection onRegister={openRegister} /> */}
            <ReviewsSection />
            <FaqSection />
            <CtaBanner onRegister={openRegister} />
          </main>
          <EmployerFooter />
        </>
      )}
    </div>
  );
};

export default EmployerPortalPage;
