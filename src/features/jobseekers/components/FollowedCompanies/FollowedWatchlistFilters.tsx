import { Filter, X } from 'lucide-react';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import type { FollowedQuickFilter } from '../../data/followedCompanies';

type FollowedWatchlistFiltersProps = {
  searchValue: string;
  totalCount: number;
  visibleCount: number;
  activeFilterCount: number;
  quickFilter: FollowedQuickFilter;
  quickCounts: Record<FollowedQuickFilter, number>;
  onSearchValueChange: (value: string) => void;
  onSearch: () => void;
  onOpenFilters: () => void;
  onClear: () => void;
  onQuickFilterChange: (value: FollowedQuickFilter) => void;
};

const quickFilters: { value: FollowedQuickFilter; label: string }[] = [
  { value: 'all', label: 'All followed' },
  { value: 'hiring', label: 'Actively hiring' },
  { value: 'new', label: 'New jobs' },
];

const FollowedWatchlistFilters = ({
  searchValue,
  totalCount,
  visibleCount,
  activeFilterCount,
  quickFilter,
  quickCounts,
  onSearchValueChange,
  onSearch,
  onOpenFilters,
  onClear,
  onQuickFilterChange,
}: FollowedWatchlistFiltersProps) => {
  const countText =
    visibleCount === totalCount
      ? `${totalCount} ${totalCount === 1 ? 'company' : 'companies'}`
      : `${visibleCount} of ${totalCount}`;

  return (
    <section className="rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
            My company watchlist
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Explore opportunities from your favorite employers
          </p>
        </div>
        <p
          role="status"
          aria-live="polite"
          className="text-sm font-semibold text-blue-700 dark:text-blue-400"
        >
          {countText}
        </p>
      </div>

      <div className="mt-4 rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <FormField
              label=""
              name="followed-company-search"
              type="buttonText"
              value={searchValue}
              onChange={onSearchValueChange}
              onKeyDown={event => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  onSearch();
                }
              }}
              placeholder="Search followed companies..."
              buttonText="Search"
              buttonVariant="default"
              onButtonClick={onSearch}
              buttonDisabled={!searchValue.trim()}
              className="h-14"
            />
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 -mt-4 w-full  rounded-none shrink-0 gap-2 border-blue-600 px-4 text-blue-700 dark:text-blue-400 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-700 dark:hover:text-blue-400 sm:w-auto"
            onClick={onOpenFilters}
          >
            <Filter className="h-4 w-4" aria-hidden="true" />
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
            onClick={onClear}
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        </div>

        <div className="-mt-4 flex flex-wrap gap-3">
          {quickFilters.map(option => {
            const active = quickFilter === option.value;

            return (
              <Button
                key={option.value}
                type="button"
                variant="outline"
                size="xs"
                aria-pressed={active}
                onClick={() => onQuickFilterChange(option.value)}
                className={`group h-6 overflow-hidden rounded-full border p-0 text-xs font-semibold transition focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                  active
                    ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:text-white dark:hover:text-white'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-700 dark:hover:text-blue-400'
                }`}
              >
                <span className="pl-4">{option.label}</span>
                <span className=" pr-2  opacity-75">
                  {quickCounts[option.value]}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FollowedWatchlistFilters;
