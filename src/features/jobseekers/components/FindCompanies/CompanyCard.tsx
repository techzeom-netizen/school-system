import { Link } from 'react-router-dom';
import { Briefcase, Building2, MapPin, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RatingPill, Stars } from '@/components/common/Rating';
import { formatCount, type Company } from '../../data/companies';
import CompanyLogo from './CompanyLogo';

type CompanyCardProps = {
  company: Company;
  isFollowing: boolean;
  onToggleFollow: (id: string) => void;
  basePath?: string;
};

const CompanyCard = ({
  company,
  isFollowing,
  onToggleFollow,
  basePath = '/jobseekers/companies',
}: CompanyCardProps) => (
  <article className="flex h-full flex-col rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
    <div className="flex items-start gap-4">
      <CompanyLogo company={company} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={`${basePath}/${company.id}`}
              className="text-lg font-bold text-slate-950 dark:text-slate-100 hover:text-blue-700 dark:hover:text-blue-400"
            >
              {company.name}
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <RatingPill value={company.rating} />
              <Stars value={company.rating} />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {formatCount(company.reviewCount)} reviews
              </span>
            </div>
          </div>
          <Button
            type="button"
            variant={'outline'}
            size="sm"
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
        </div>
        <p className="mt-3 truncate text-sm text-slate-600 dark:text-slate-300">
          {company.tagline}
        </p>
      </div>
    </div>

    <div className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
      <span className="flex min-w-0 items-center gap-2">
        <Building2
          className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400"
          aria-hidden="true"
        />
        <span className="truncate">
          {company.industry} · {company.type}
        </span>
      </span>
      <span className="flex min-w-0 items-center gap-2">
        <Users
          className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400"
          aria-hidden="true"
        />
        <span>{company.size} employees</span>
      </span>
      <span className="flex min-w-0 items-center gap-2 sm:col-span-2">
        <MapPin
          className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400"
          aria-hidden="true"
        />
        <span className="truncate">HQ {company.hq}</span>
      </span>
    </div>

    <div className="mt-4 flex flex-wrap gap-2">
      {company.tags.slice(0, 3).map(tag => (
        <span
          key={tag}
          className="rounded-full bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400"
        >
          {tag}
        </span>
      ))}
    </div>

    <div className="mt-auto flex flex-col gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-semibold text-green-700 dark:text-green-400">
        {company.recommendPercent}% recommend to a friend
      </span>
      <Link
        to={`${basePath}/${company.id}?tab=jobs`}
        className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-400 hover:underline"
      >
        <Briefcase className="h-4 w-4" aria-hidden="true" />
        {company.jobs.length} open jobs
      </Link>
    </div>
  </article>
);

export default CompanyCard;
