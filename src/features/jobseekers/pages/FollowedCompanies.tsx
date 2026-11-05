import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CompanyFilters from '../components/FindCompanies/CompanyFilters';
import DiscoverBanner from '../components/FollowedCompanies/DiscoverBanner';
import FollowedCompanyCard from '../components/FollowedCompanies/FollowedCompanyCard';
import FollowedEmptyState from '../components/FollowedCompanies/FollowedEmptyState';
import FollowedHero from '../components/FollowedCompanies/FollowedHero';
import FollowedWatchlistFilters from '../components/FollowedCompanies/FollowedWatchlistFilters';
import {
  filterFollowed,
  newJobsOf,
  resolveFollowed,
  type FollowedQuickFilter,
} from '../data/followedCompanies';
import {
  activeFilterCount,
  defaultFilters,
  type CompanyFilters as Filters,
} from '../data/companies';
import { useFollowedList } from '../data/useFollowedList';

const FollowedCompanies = () => {
  const { entries, unfollow } = useFollowedList();
  const [query, setQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [quickFilter, setQuickFilter] = useState<FollowedQuickFilter>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const followed = useMemo(() => resolveFollowed(entries), [entries]);
  const industries = useMemo(
    () =>
      Array.from(new Set(followed.map(item => item.company.industry))).sort(),
    [followed]
  );

  useEffect(() => {
    const availableIndustries = new Set(industries);
    const nextIndustries = filters.industries.filter(item =>
      availableIndustries.has(item)
    );

    if (nextIndustries.length !== filters.industries.length) {
      setFilters(current => ({ ...current, industries: nextIndustries }));
    }
  }, [filters.industries, industries]);

  const visibleCompanies = useMemo(
    () => filterFollowed(followed, query, filters, quickFilter),
    [filters, followed, query, quickFilter]
  );

  const openJobsCount = useMemo(
    () => followed.reduce((total, item) => total + item.company.jobs.length, 0),
    [followed]
  );

  const activeCount = activeFilterCount(filters);

  const quickCounts = useMemo(
    () => ({
      all: followed.length,
      hiring: followed.filter(item => item.company.jobs.length > 0).length,
      new: followed.filter(item => newJobsOf(item.company).length > 0).length,
    }),
    [followed]
  );

  const handleSearch = () => setQuery(searchInput.trim());

  const clearFilters = () => {
    setQuery('');
    setSearchInput('');
    setFilters(defaultFilters);
    setQuickFilter('all');
    setFiltersOpen(false);
  };

  const renderFilters = () => (
    <CompanyFilters
      filters={filters}
      onChange={setFilters}
      onReset={clearFilters}
      scrollAreaClassName="max-h-[calc(100vh-88px)] overflow-y-auto pr-4"
      scrollThumbClassName="block"
    />
  );

  return (
    <section className="bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-[1560px] space-y-4 px-4 py-6 lg:px-8">
        <FollowedHero
          followingCount={followed.length}
          openJobsCount={openJobsCount}
        />

        {followed.length > 0 ? (
          <>
            <FollowedWatchlistFilters
              searchValue={searchInput}
              totalCount={followed.length}
              visibleCount={visibleCompanies.length}
              activeFilterCount={activeCount}
              quickFilter={quickFilter}
              quickCounts={quickCounts}
              onSearchValueChange={setSearchInput}
              onSearch={handleSearch}
              onOpenFilters={() => setFiltersOpen(true)}
              onClear={clearFilters}
              onQuickFilterChange={setQuickFilter}
            />

            {visibleCompanies.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {visibleCompanies.map(item => (
                  <FollowedCompanyCard
                    key={item.companyId}
                    item={item}
                    onUnfollow={unfollow}
                  />
                ))}
              </div>
            ) : (
              <FollowedEmptyState type="filters" onClear={clearFilters} />
            )}
          </>
        ) : (
          <FollowedEmptyState type="none" />
        )}

        <DiscoverBanner />
      </div>

      <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DialogContent className="left-auto right-0 top-0 flex h-screen max-h-screen w-full max-w-md translate-x-0 translate-y-0 flex-col overflow-hidden rounded-none border-l p-5 sm:max-w-md data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right">
          <DialogHeader className="shrink-0">
            <DialogTitle>Filter followed companies</DialogTitle>
          </DialogHeader>
          {renderFilters()}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FollowedCompanies;
