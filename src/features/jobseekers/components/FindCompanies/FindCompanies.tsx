import { useMemo, useState } from 'react';
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormField from '@/components/common/FormField';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  INDUSTRIES,
  activeFilterCount,
  companies,
  defaultFilters,
  filterCompanies,
  getCompany,
  type CompanyFilters as Filters,
  type SortKey,
} from '../../data/companies';
import { useFollowedCompanies } from '../../data/useFollowedCompanies';
import CompanyCard from './CompanyCard';
import CompanyDetailView, { type CompanyTab } from './CompanyDetailView';
import CompanyFilters from './CompanyFilters';
import CompanySearchBar from './CompanySearchBar';
import ScrollLockPanel from '../job-search/ScrollLockPanel';

const tabValues: CompanyTab[] = ['overview', 'jobs', 'reviews', 'salaries'];

const isCompanyTab = (value: string | null): value is CompanyTab =>
  Boolean(value && tabValues.includes(value as CompanyTab));

const toggleIndustry = (filters: Filters, industry: string): Filters => ({
  ...filters,
  industries: filters.industries.includes(industry)
    ? filters.industries.filter(item => item !== industry)
    : [...filters.industries, industry],
});

type FindCompaniesProps = {
  basePath?: string;
  onFollowRequest?: (id: string) => void;
  embedded?: boolean;
};

const FindCompanies = ({
  basePath = '/jobseekers/companies',
  onFollowRequest,
  embedded = false,
}: FindCompaniesProps) => {
  const navigate = useNavigate();
  const { companyId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { following, toggle } = useFollowedCompanies();
  const handleToggleFollow = onFollowRequest ?? toggle;
  const Content = embedded ? 'div' : 'main';
  const activeCount = activeFilterCount(filters);
  const company = companyId ? getCompany(companyId) : undefined;
  const tabParam = searchParams.get('tab');
  const selectedTab: CompanyTab = isCompanyTab(tabParam)
    ? tabParam
    : 'overview';

  const results = useMemo(
    () => filterCompanies(companies, filters, following),
    [filters, following]
  );

  if (companyId) {
    if (!company) {
      return (
        <div className="mx-auto max-w-[900px] px-4 py-12 text-center">
          <h1 className="text-2xl font-black text-slate-950 dark:text-slate-100">
            Company not found
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            The company profile you opened is not available.
          </p>
          <Button
            asChild
            className="mt-5 bg-blue-600 hover:bg-blue-700 dark:text-white"
          >
            <Link to={basePath}>All companies</Link>
          </Button>
        </div>
      );
    }

    return (
      <CompanyDetailView
        company={company}
        initialTab={selectedTab}
        isFollowing={following.has(company.id)}
        onBack={() => navigate(basePath)}
        onTabChange={tab => setSearchParams(tab === 'overview' ? {} : { tab })}
        onToggleFollow={handleToggleFollow}
        basePath={basePath}
      />
    );
  }

  const resetFilters = () => {
    setFilters(defaultFilters);
    setMobileFiltersOpen(false);
  };

  const renderFilters = (
    scrollAreaClassName?: string,
    scrollThumbClassName?: string
  ) => (
    <CompanyFilters
      filters={filters}
      onChange={setFilters}
      onReset={resetFilters}
      scrollAreaClassName={scrollAreaClassName}
      scrollThumbClassName={scrollThumbClassName}
    />
  );

  return (
    <>
      <Content className="bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto w-full max-w-[1560px] px-3 py-6 lg:px-8">
          <section className="rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 p-5 shadow-sm md:p-7">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-400">
                  Company directory
                </p>
                <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-slate-100 md:text-4xl">
                  Explore companies
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Compare culture, salaries, reviews, and open roles from sample
                  employers.
                </p>
              </div>

              <div className="w-full lg:justify-self-end">
                <CompanySearchBar
                  value={filters.query}
                  hasActiveFilters={activeCount > 0}
                  onSearch={query =>
                    setFilters(current => ({ ...current, query }))
                  }
                  onClear={resetFilters}
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {INDUSTRIES.map(industry => {
                const active = filters.industries.includes(industry);
                return (
                  <button
                    key={industry}
                    type="button"
                    className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
                      active
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                    onClick={() =>
                      setFilters(current => toggleIndustry(current, industry))
                    }
                  >
                    {industry}
                  </button>
                );
              })}
            </div>
          </section>

          <div className="mt-5 lg:hidden">
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400"
              aria-expanded={mobileFiltersOpen}
              onClick={() => setMobileFiltersOpen(true)}
            >
              <Filter className="h-4 w-4" aria-hidden="true" />
              Filters
              {activeCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white">
                  {activeCount}
                </span>
              )}
            </Button>
          </div>

          <div
            id={embedded ? 'company-results' : undefined}
            className="mt-5 grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]"
          >
            <ScrollLockPanel
              className="hidden lg:block lg:self-start"
              minWidth={1024}
              boundaryId={embedded ? 'company-results' : undefined}
            >
              {renderFilters()}
            </ScrollLockPanel>

            <section className="min-w-0 space-y-4">
              <div className="flex flex-col gap-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <p
                  role="status"
                  aria-live="polite"
                  className="font-bold text-slate-900 dark:text-slate-100"
                >
                  {results.length} companies found
                </p>
                <div className="sm:w-64">
                  <FormField
                    label="Sort"
                    name="company-sort"
                    type="select"
                    value={filters.sort}
                    onChange={value =>
                      setFilters(current => ({
                        ...current,
                        sort: value as SortKey,
                      }))
                    }
                    options={[
                      { value: 'relevance', label: 'Relevance' },
                      { value: 'rating', label: 'Highest rated' },
                      { value: 'reviews', label: 'Most reviewed' },
                      { value: 'jobs', label: 'Most open jobs' },
                    ]}
                    className="[&_label]:sr-only"
                  />
                </div>
              </div>

              {results.length ? (
                <div className="grid gap-4 xl:grid-cols-2">
                  {results.map(item => (
                    <CompanyCard
                      key={item.id}
                      company={item}
                      isFollowing={following.has(item.id)}
                      onToggleFollow={handleToggleFollow}
                      basePath={basePath}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 p-10 text-center shadow-sm">
                  <h2 className="text-xl font-black text-slate-950 dark:text-slate-100">
                    No companies match your filters
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Try widening the rating, location, or industry filters.
                  </p>
                  <Button
                    type="button"
                    className="mt-5 bg-blue-600 hover:bg-blue-700 dark:text-white"
                    onClick={resetFilters}
                  >
                    Reset filters
                  </Button>
                </div>
              )}
            </section>
          </div>
        </div>
      </Content>

      <Dialog open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <DialogContent className="left-auto right-0 top-0 flex h-screen max-h-screen w-full max-w-md translate-x-0 translate-y-0 flex-col overflow-hidden rounded-none border-l p-5 sm:max-w-md data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right">
          <DialogHeader className="shrink-0">
            <DialogTitle>Filter companies</DialogTitle>
          </DialogHeader>
          {renderFilters(
            'max-h-[calc(100vh-88px)] overflow-y-auto pr-4',
            'block'
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FindCompanies;
