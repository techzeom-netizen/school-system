import { useState } from 'react';
import CandidateProfileCard from '../components/CandidateProfileCard';
import JobFilter from '../components/JobFilter';
import AuthenticatedJobResults from '../components/job-search/AuthenticatedJobResults';
import AuthenticatedJobSearchHero from '../components/job-search/AuthenticatedJobSearchHero';
import JobMatchSummary from '../components/job-search/JobMatchSummary';
import ScrollLockPanel from '../components/job-search/ScrollLockPanel';
import useJobSearch from '../hooks/useJobSearch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const JobSeekerJobSearchPage = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
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
  } = useJobSearch(true);

  const activeFilterCount = workModes.length + experiences.length;

  const renderFilterPanel = (
    scrollAreaClassName?: string,
    scrollThumbClassName?: string
  ) => (
    <JobFilter
      workModes={workModes}
      experiences={experiences}
      onWorkModeChange={toggleWorkMode}
      onExperienceChange={toggleExperience}
      onClear={clearFilters}
      scrollAreaClassName={scrollAreaClassName}
      scrollThumbClassName={scrollThumbClassName}
    />
  );

  return (
    <>
      <div className="mx-auto grid w-full max-w-[1560px] items-start gap-4 px-4 py-5 lg:px-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-4">
          <AuthenticatedJobSearchHero
            query={query}
            location={location}
            onQueryChange={setQuery}
            onLocationChange={setLocation}
          />

          <div className="grid items-start gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
            <ScrollLockPanel
              className="hidden xl:block xl:self-start"
              minWidth={1280}
            >
              {renderFilterPanel()}
            </ScrollLockPanel>
            <section className="min-w-0 space-y-4">
              <JobMatchSummary
                count={filteredJobs.length}
                activeFilterCount={activeFilterCount}
                onOpenFilters={() => setMobileFiltersOpen(true)}
              />
              <AuthenticatedJobResults
                jobs={filteredJobs}
                activeFilterCount={activeFilterCount}
                onOpenFilters={() => setMobileFiltersOpen(true)}
              />
            </section>
          </div>
        </div>

        <ScrollLockPanel className="w-full xl:self-start" minWidth={1280}>
          <CandidateProfileCard />
        </ScrollLockPanel>
      </div>

      <Dialog open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <DialogContent className="left-auto right-0 top-0 flex h-screen max-h-screen w-full max-w-md translate-x-0 translate-y-0 flex-col overflow-hidden rounded-none border-l p-5 sm:max-w-md data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right">
          <DialogHeader className="shrink-0">
            <DialogTitle>Filter jobs</DialogTitle>
          </DialogHeader>
          {renderFilterPanel(
            'max-h-[calc(100vh-88px)] overflow-y-auto pr-4',
            'block'
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JobSeekerJobSearchPage;
