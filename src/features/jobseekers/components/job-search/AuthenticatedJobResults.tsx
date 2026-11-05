import { useState } from 'react';
import { Filter, Search } from 'lucide-react';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import type { Job } from '../../data/jobs';
import JobCard from '../JobCard';

type AuthenticatedJobResultsProps = {
  jobs: Job[];
  activeFilterCount: number;
  onOpenFilters: () => void;
};

const AuthenticatedJobResults = ({
  jobs,
  activeFilterCount,
  onOpenFilters,
}: AuthenticatedJobResultsProps) => {
  const [activeTab, setActiveTab] = useState('Recommended');
  const [sortBy, setSortBy] = useState('Relevance');
  const tabs = [
    ['Recommended', jobs.length],
    ['Recent', 12],
    ['Saved', 4],
    ['Applied', 6],
  ] as const;

  return (
    <section className="rounded-t-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800/50 p-3 shadow-sm sm:p-4">
      <div className="flex flex-col gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 sm:min-w-0">
          {tabs.map(([tab, count]) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative flex h-10 shrink-0 items-center rounded-md px-2 text-sm font-semibold sm:px-3 ${
                activeTab === tab
                  ? 'text-blue-700 dark:text-blue-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {tab} ({count})
              {activeTab === tab && (
                <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-blue-700" />
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:shrink-0">
          <div className="min-w-0 sm:w-44">
            <FormField
              label="Sort by"
              name="job-results-sort"
              type="select"
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: 'Relevance', label: 'Relevance' },
                { value: 'Latest', label: 'Latest' },
                { value: 'Salary high to low', label: 'Salary high to low' },
                { value: 'Experience match', label: 'Experience match' },
              ]}
              className="[&_button]:h-9 [&_button]:border-blue-400 [&_button]:text-sm [&_button]:font-medium [&_label]:sr-only"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 sm:hidden"
            onClick={onOpenFilters}
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {jobs.length === 0 ? (
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center">
            <Search className="mx-auto h-8 w-8 text-slate-400" />
            <h3 className="mt-3 font-semibold text-slate-950 dark:text-slate-100">
              No matching jobs
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Try changing your keywords, location, or filters.
            </p>
          </div>
        ) : (
          jobs.map(job => <JobCard key={job.id} job={job} />)
        )}
      </div>
    </section>
  );
};

export default AuthenticatedJobResults;
