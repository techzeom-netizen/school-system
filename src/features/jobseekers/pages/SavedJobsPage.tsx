import { useMemo, useState, type KeyboardEvent } from 'react';
import { Bookmark, Filter, X } from 'lucide-react';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import JobFilter from '../components/JobFilter';
import SavedJobCard from '../components/SavedJobCard';
import { jobs } from '../data/jobs';

const initialSavedJobIds = ['J-1024', 'J-1026', 'J-1028', 'J-1029'];

const SavedJobsPage = () => {
  const [query, setQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [workModes, setWorkModes] = useState<string[]>([]);
  const [experiences, setExperiences] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState(initialSavedJobIds);

  const savedJobs = useMemo(
    () => jobs.filter(job => savedJobIds.includes(job.id)),
    [savedJobIds]
  );

  const filteredJobs = savedJobs.filter(job => {
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery =
      !normalizedQuery ||
      [job.title, job.company, job.description, job.location, ...job.skills]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);
    const matchesMode =
      workModes.length === 0 || workModes.includes(job.workMode);
    const matchesExperience =
      experiences.length === 0 ||
      experiences.some(range => {
        if (range === '10+ years') {
          return Number(job.experience.split('-')[0]) >= 10;
        }

        const [min, max] = range.split('-').map(value => Number(value));
        const jobMin = Number(job.experience.split('-')[0]);

        return Number.isFinite(max) ? jobMin >= min && jobMin <= max : false;
      });

    return matchesQuery && matchesMode && matchesExperience;
  });

  const activeFilterCount = workModes.length + experiences.length;

  const handleSearch = () => setQuery(searchInput.trim());

  const hasAnythingToClear = !!query || !!searchInput || activeFilterCount > 0;

  const handleSearchKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  const clearFilters = () => {
    setQuery('');
    setSearchInput('');
    setWorkModes([]);
    setExperiences([]);
  };

  const toggleWorkMode = (value: string, checked: boolean) => {
    setWorkModes(current =>
      checked
        ? [...current, value]
        : current.filter(workMode => workMode !== value)
    );
  };

  const toggleExperience = (value: string, checked: boolean) => {
    setExperiences(current =>
      checked
        ? [...current, value]
        : current.filter(experience => experience !== value)
    );
  };

  const handleUnsave = (jobId: string) => {
    setSavedJobIds(current => current.filter(id => id !== jobId));
  };

  const filterPanel = (
    <JobFilter
      workModes={workModes}
      experiences={experiences}
      onWorkModeChange={toggleWorkMode}
      onExperienceChange={toggleExperience}
      onClear={clearFilters}
      scrollAreaClassName="max-h-[calc(100vh-88px)] overflow-y-auto pr-4"
      scrollThumbClassName="block"
    />
  );

  return (
    <>
      <section className="bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto w-full max-w-[1560px] px-4 py-6 lg:px-8">
          <div className="rounded-t-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
            {/* Stacks on mobile, single row from sm and up */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <FormField
                  label=""
                  className="h-14"
                  name="savedJobSearch"
                  type="buttonText"
                  value={searchInput}
                  onChange={setSearchInput}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search by role, company, skill, or location"
                  buttonText="Search"
                  buttonVariant="default"
                  onButtonClick={handleSearch}
                  buttonDisabled={!searchInput.trim()}
                />
              </div>

              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 -mt-4 w-full  rounded-none shrink-0 gap-2 border-blue-600 px-4 text-blue-700 dark:text-blue-400 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-700 dark:hover:text-blue-400 sm:w-auto"
                onClick={() => setFiltersOpen(true)}
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 -mt-4 w-full rounded-none shrink-0 gap-2 border-red-200 dark:border-red-800 px-4 text-red-600 dark:text-red-400 hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-700 dark:hover:text-red-400 sm:w-auto"
                onClick={clearFilters}
                disabled={!hasAnythingToClear}
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>

          <section className="mt-4 rounded-t-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
            <div className="flex flex-col gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
                  {filteredJobs.length} saved jobs found
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Review jobs you bookmarked and apply when you are ready.
                </p>
              </div>
              <select className="h-10 rounded-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 px-3 text-sm font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500">
                <option>Sort by latest saved</option>
                <option>Newest jobs first</option>
                <option>Salary high to low</option>
                <option>Best match</option>
              </select>
            </div>

            <div className="mt-4">
              {filteredJobs.length === 0 ? (
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center">
                  <Bookmark className="mx-auto h-9 w-9 text-slate-300" />
                  <h3 className="mt-3 font-semibold text-slate-950 dark:text-slate-100">
                    No saved jobs match
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Try changing your search or clearing the selected filters.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                  {filteredJobs.map(job => (
                    <SavedJobCard
                      key={job.id}
                      job={job}
                      onUnsave={handleUnsave}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </section>

      <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DialogContent className="left-auto right-0 top-0 flex h-screen max-h-screen w-full max-w-md translate-x-0 translate-y-0 flex-col overflow-hidden rounded-none border-l p-5 sm:max-w-md data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right">
          <DialogHeader className="shrink-0">
            <DialogTitle>Filter saved jobs</DialogTitle>
          </DialogHeader>
          {filterPanel}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SavedJobsPage;
