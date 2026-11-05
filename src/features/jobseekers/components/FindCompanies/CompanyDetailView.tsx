import { Link } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  CalendarDays,
  Globe,
  Heart,
  MapPin,
  Plus,
  Star,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RatingPill, Stars } from '@/components/common/Rating';
import {
  formatCount,
  similarCompanies,
  type Company,
} from '../../data/companies';
import CompanyLogo from './CompanyLogo';
import { JobsTab, OverviewTab, ReviewsTab, SalariesTab } from './CompanyTabs';

export type CompanyTab = 'overview' | 'jobs' | 'reviews' | 'salaries';

type CompanyDetailViewProps = {
  company: Company;
  initialTab: CompanyTab;
  isFollowing: boolean;
  onBack: () => void;
  onTabChange: (tab: CompanyTab) => void;
  onToggleFollow: (id: string) => void;
  basePath?: string;
};

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'jobs', label: 'Jobs' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'salaries', label: 'Salaries' },
] as const;

const CompanyDetailView = ({
  company,
  initialTab,
  isFollowing,
  onTabChange,
  onToggleFollow,
  basePath = '/jobseekers/companies',
}: CompanyDetailViewProps) => {
  const similar = similarCompanies(company, 3);

  return (
    <div className="mx-auto w-full max-w-[1560px] px-3 py-6 lg:px-8">
      <section className="overflow-hidden rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="h-16" />

        <div className="px-5 pb-5">
          <div className="-mt-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex min-w-0 items-stretch gap-4">
              {/* Company Logo */}
              <div className="relative z-10 w-24 shrink-0 self-stretch sm:w-32">
                <CompanyLogo
                  company={company}
                  size="lg"
                  className="!h-full !w-full rounded-xl bg-white dark:bg-slate-900 object-contain"
                />
              </div>

              {/* Company Information */}
              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <h1 className="break-words text-xl font-black text-slate-950 dark:text-slate-100 sm:text-2xl md:text-3xl">
                  {company.name}
                </h1>

                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {company.tagline}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <RatingPill value={company.rating} />
                  <Stars value={company.rating} />

                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    HQ {company.hq}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={'outline'}
                aria-pressed={isFollowing}
                onClick={() => onToggleFollow(company.id)}
                className={
                  isFollowing
                    ? 'shrink-0 border-blue-500 text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40'
                    : 'shrink-0 border-blue-300 dark:border-blue-700'
                }
              >
                <Plus
                  className={
                    isFollowing ? 'h-4 w-4  fill-current hidden' : 'h-4 w-4'
                  }
                  aria-hidden="true"
                />
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700 dark:text-white"
              >
                <a href={company.website} target="_blank" rel="noreferrer">
                  <Globe className="h-4 w-4" aria-hidden="true" />
                  Website
                </a>
              </Button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Rating', company.rating.toFixed(1), Star],
              ['Reviews', formatCount(company.reviewCount), Users],
              ['Open jobs', company.jobs.length.toString(), Briefcase],
              ['Recommend', `${company.recommendPercent}%`, Heart],
            ].map(([label, value, Icon]) => (
              <div
                key={label as string}
                className="rounded-lg border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-4"
              >
                <Icon
                  className="h-5 w-5 text-blue-700 dark:text-blue-400"
                  aria-hidden="true"
                />
                <p className="mt-2 text-2xl font-black text-slate-950 dark:text-slate-100">
                  {value as string}
                </p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {label as string}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div
        className="mt-5 border-b border-blue-200 dark:border-blue-800"
        role="tablist"
        aria-label={`${company.name} sections`}
      >
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map(tab => {
            const selected = initialTab === tab.id;
            const suffix =
              tab.id === 'jobs'
                ? ` (${company.jobs.length})`
                : tab.id === 'reviews'
                  ? ` (${company.reviews.length})`
                  : '';

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${tab.id}-panel`}
                id={`${tab.id}-tab`}
                className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-bold ${
                  selected
                    ? 'border-blue-700 text-blue-700 dark:text-blue-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400'
                }`}
                onClick={() => onTabChange(tab.id)}
              >
                {tab.label}
                {suffix}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div
          role="tabpanel"
          id={`${initialTab}-panel`}
          aria-labelledby={`${initialTab}-tab`}
        >
          {initialTab === 'overview' && <OverviewTab company={company} />}
          {initialTab === 'jobs' && <JobsTab company={company} />}
          {initialTab === 'reviews' && <ReviewsTab company={company} />}
          {initialTab === 'salaries' && <SalariesTab company={company} />}
        </div>

        <aside className="space-y-5">
          <section className="rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
              Company details
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex gap-3">
                <Building2
                  className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400"
                  aria-hidden="true"
                />
                <div>
                  <dt className="font-bold text-slate-700 dark:text-slate-200">
                    Industry
                  </dt>
                  <dd className="text-slate-600 dark:text-slate-300">
                    {company.industry} · {company.type}
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Users
                  className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400"
                  aria-hidden="true"
                />
                <div>
                  <dt className="font-bold text-slate-700 dark:text-slate-200">
                    Size
                  </dt>
                  <dd className="text-slate-600 dark:text-slate-300">
                    {company.size} employees
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <CalendarDays
                  className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400"
                  aria-hidden="true"
                />
                <div>
                  <dt className="font-bold text-slate-700 dark:text-slate-200">
                    Founded
                  </dt>
                  <dd className="text-slate-600 dark:text-slate-300">
                    {company.founded}
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin
                  className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400"
                  aria-hidden="true"
                />
                <div>
                  <dt className="font-bold text-slate-700 dark:text-slate-200">
                    Locations
                  </dt>
                  <dd className="text-slate-600 dark:text-slate-300">
                    {company.locations.join(', ')}
                  </dd>
                </div>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
              Similar companies
            </h2>
            <div className="mt-4 space-y-3">
              {similar.map(item => (
                <Link
                  key={item.id}
                  to={`${basePath}/${item.id}`}
                  className="flex items-center gap-3 rounded-lg border border-slate-100 dark:border-slate-800 p-3 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                >
                  <CompanyLogo company={item} size="sm" />
                  <span className="min-w-0">
                    <span className="block truncate font-bold text-slate-900 dark:text-slate-100">
                      {item.name}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {item.industry}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default CompanyDetailView;
