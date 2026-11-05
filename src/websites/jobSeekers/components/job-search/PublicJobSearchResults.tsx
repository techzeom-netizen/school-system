import { cloneElement, isValidElement, type ReactNode } from 'react';
import { Search } from 'lucide-react';
import type { Job } from '@/features/jobseekers/data/jobs';
import JobCard from '@/features/jobseekers/components/JobCard';
import ScrollLockPanel from '@/features/jobseekers/components/job-search/ScrollLockPanel';

type PublicJobSearchResultsProps = {
  jobs: Job[];
  filterPanel: ReactNode;
  headerDescription?: ReactNode;
  onApply?: (job: Job) => void;
  id?: string;
};

const PublicJobSearchResults = ({
  jobs,
  filterPanel,
  headerDescription,
  onApply,
  id,
}: PublicJobSearchResultsProps) => {
  const scrollableFilterPanel = isValidElement(filterPanel)
    ? cloneElement(filterPanel, {
        scrollAreaClassName:
          'lg:h-[calc(100vh-6px)] lg:overflow-y-auto lg:pr-4',
        scrollThumbClassName: 'hidden lg:block',
      })
    : filterPanel;

  return (
    <section
      id={id}
      className={`mx-auto grid w-full items-start gap-5 px-5 pb-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8${id ? ' scroll-mt-0' : ' pt-6'}`}
    >
      <ScrollLockPanel
        className="lg:self-start"
        minWidth={1024}
        boundaryId={id}
      >
        {scrollableFilterPanel}
      </ScrollLockPanel>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-950 dark:text-slate-100">
              {jobs.length} jobs found
            </h2>
            {headerDescription || (
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Showing recommended openings
              </p>
            )}
          </div>
          <select className="h-10 rounded-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-gray-700 dark:text-slate-200 outline-none focus:border-blue-500">
            <option>Sort by relevance</option>
            <option>Newest first</option>
            <option>Salary high to low</option>
          </select>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center shadow-sm">
            <Search className="mx-auto h-8 w-8 text-gray-400" />
            <h3 className="mt-3 font-semibold text-gray-950 dark:text-slate-100">
              No matching jobs
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              Try changing your keywords, location, or filters.
            </p>
          </div>
        ) : (
          jobs.map(job => <JobCard key={job.id} job={job} onApply={onApply} />)
        )}
      </div>
    </section>
  );
};

export default PublicJobSearchResults;
