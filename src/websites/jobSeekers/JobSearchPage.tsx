import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import JobSeekerLoginDialog from '@/features/jobseekers/components/JobSeekerLoginDialog';
import {
  QuickJobTiles,
  BrowseByField,
  TopCompaniesSection,
  HowItWorksSection,
  CareerToolsSection,
  SignUpCtaSection,
  PublicFooter,
} from './components/PublicLanding';
import {
  categories,
  type LandingFilter,
} from './components/PublicLanding/data/landingContent';

import JobFilter from '@/features/jobseekers/components/JobFilter';
import PublicJobSearchHero from './components/job-search/PublicJobSearchHero';
import SearchJobsHero from './components/job-search/SearchJobsHero';
import PublicJobSearchResults from './components/job-search/PublicJobSearchResults';
import WebsiteShell from '@/features/jobseekers/components/WebsiteShell';
import useJobSearch from '@/features/jobseekers/hooks/useJobSearch';

type JobSearchPageProps = {
  showLandingSections?: boolean;
};

const JobSearchPage = ({ showLandingSections = true }: JobSearchPageProps) => {
  const SearchHero = showLandingSections ? PublicJobSearchHero : SearchJobsHero;
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loginOpen, setLoginOpen] = useState(
    () => searchParams.get('login') === 'true'
  );
  const [loginRedirect, setLoginRedirect] = useState<string>();
  const [skipLoginAnimation, setSkipLoginAnimation] = useState(
    () => searchParams.get('login') === 'true'
  );

  useEffect(() => {
    if (searchParams.get('login') !== 'true') return;

    setLoginRedirect(undefined);
    setSkipLoginAnimation(true);
    setLoginOpen(true);
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete('login');
    setSearchParams(nextSearchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const {
    query,
    setQuery,
    location,
    setLocation,
    workModes,
    experiences,
    filteredJobs,
    clearFilters,
    toggleWorkMode,
    toggleExperience,
  } = useJobSearch();

  const [category, setCategory] = useState('');
  const [extraFilters, setExtraFilters] = useState<LandingFilter>({});
  const [filterVersion, setFilterVersion] = useState(0);
  const resetFilters = () => {
    clearFilters();
    setCategory('');
    setExtraFilters({});
    setFilterVersion(current => current + 1);
  };
  const scrollToResults = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document
          .getElementById('results')
          ?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      });
    });
  };
  const applyFilters = (filter: LandingFilter) => {
    resetFilters();
    if (filter.query) setQuery(filter.query);
    if (filter.location) setLocation(filter.location);
    if (filter.workMode) toggleWorkMode(filter.workMode, true);
    if (filter.experience) toggleExperience(filter.experience, true);
    setExtraFilters({
      jobType: filter.jobType,
      minSalary: filter.minSalary,
      company: filter.company,
    });
    scrollToResults();
  };
  const selectedCategory = categories.find(item => item.name === category);
  const landingJobs = filteredJobs.filter(
    job =>
      (!selectedCategory ||
        selectedCategory.pattern.test([job.title, ...job.skills].join(' '))) &&
      (!extraFilters.company || job.company === extraFilters.company) &&
      (!extraFilters.jobType || job.type === extraFilters.jobType) &&
      (!extraFilters.minSalary ||
        Number.parseFloat(job.salary) >= extraFilters.minSalary)
  );

  const filterPanel = (
    <JobFilter
      key={filterVersion}
      workModes={workModes}
      experiences={experiences}
      onWorkModeChange={toggleWorkMode}
      onExperienceChange={toggleExperience}
      onClear={resetFilters}
    />
  );

  return (
    <WebsiteShell hideHeaderForSectionId="results">
      <SearchHero
        query={query}
        location={location}
        onQueryChange={setQuery}
        onLocationChange={setLocation}
        onPopularSearchSelect={applyFilters}
      />
      {showLandingSections && (
        <>
          <div className="mx-auto w-full max-w-[1560px] px-5 py-10 lg:px-8">
            <QuickJobTiles onSelect={applyFilters} />
            <BrowseByField
              selected={category}
              onSelect={value => {
                setCategory(value);
                scrollToResults();
              }}
            />
          </div>
        </>
      )}
      <div className="mx-auto max-w-[1560px]">
        <PublicJobSearchResults
          id="results"
          jobs={landingJobs}
          onApply={
            isAuthenticated
              ? undefined
              : job => {
                  setLoginRedirect(`/jobseekers/jobs/${job.id}`);
                  setLoginOpen(true);
                }
          }
          headerDescription={
            (category ||
              extraFilters.company ||
              extraFilters.jobType ||
              extraFilters.minSalary) && (
              <div
                className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-slate-300"
                aria-live="polite"
              >
                <span>
                  Filtered by:{' '}
                  {[
                    category,
                    extraFilters.company,
                    extraFilters.jobType,
                    extraFilters.minSalary
                      ? `${extraFilters.minSalary}+ LPA`
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="bg-red-50 dark:bg-red-950/40 border border-red-700 hover:bg-red-700 hover:text-white dark:hover:text-white text-red-700 dark:text-red-400"
                >
                  Clear filters
                </Button>
              </div>
            )
          }
          filterPanel={filterPanel}
        />
      </div>
      {showLandingSections && (
        <>
          <TopCompaniesSection
            onSelect={company => applyFilters({ company })}
          />
          <HowItWorksSection />
          <CareerToolsSection />
          <SignUpCtaSection
            onSignIn={
              isAuthenticated
                ? undefined
                : () => {
                    setLoginRedirect(undefined);
                    setLoginOpen(true);
                  }
            }
          />
        </>
      )}
      <PublicFooter />
      <JobSeekerLoginDialog
        open={loginOpen}
        onOpenChange={open => {
          setLoginOpen(open);
          if (!open) setSkipLoginAnimation(false);
        }}
        disableOpenAnimation={skipLoginAnimation}
        redirectTo={loginRedirect}
      />
    </WebsiteShell>
  );
};

export default JobSearchPage;
