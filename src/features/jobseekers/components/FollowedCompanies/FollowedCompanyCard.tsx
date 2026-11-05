import {
  ArrowRight,
  ExternalLink,
  MapPin,
  UserMinus,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RatingPill } from '@/components/common/Rating';
import { formatCount } from '../../data/companies';
import {
  followersOf,
  type FollowedCompany,
} from '../../data/followedCompanies';
import CompanyLogo from '../FindCompanies/CompanyLogo';

type FollowedCompanyCardProps = {
  item: FollowedCompany;
  onUnfollow: (id: string, name: string) => void;
};

const linkButtonClasses =
  'inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-blue-200 dark:border-blue-800 px-3 text-sm font-semibold text-blue-700 dark:text-blue-400 transition hover:bg-blue-50 dark:hover:bg-blue-950/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2';

const FollowedCompanyCard = ({
  item,
  onUnfollow,
}: FollowedCompanyCardProps) => {
  const { company } = item;
  const companyPath = `/jobseekers/companies/${company.id}`;

  return (
    <article className="min-w-0 rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition hover:border-blue-400 hover:shadow-md sm:p-5">
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 gap-3">
          <CompanyLogo company={company} />
          <div className="min-w-0">
            <Link
              to={companyPath}
              className="block truncate text-base font-bold text-slate-950 dark:text-slate-100 hover:text-blue-700 dark:hover:text-blue-400"
            >
              {company.name}
            </Link>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {company.industry}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <RatingPill value={company.rating} />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                ({formatCount(company.reviewCount)} reviews)
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-full justify-end gap-2 sm:w-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onUnfollow(company.id, company.name)}
            className="h-9 gap-2 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-950 hover:text-gray-700 dark:hover:text-slate-200"
          >
            <UserMinus className="h-4 w-4" aria-hidden="true" />
            Unfollow
          </Button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {company.hq}, India
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Users className="h-4 w-4" aria-hidden="true" />
          {company.size} employees
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {company.tags.slice(0, 2).map(tag => (
          <span
            key={tag}
            className="rounded-full border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400"
          >
            {tag}
          </span>
        ))}
        {company.jobs.length > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Hiring now
          </span>
        )}
      </div>

      <div className="my-4 border-t border-slate-100 dark:border-slate-800" />

      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-2xl font-bold text-slate-950 dark:text-slate-100">
            {company.jobs.length}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            open {company.jobs.length === 1 ? 'position' : 'positions'}
          </p>
        </div>
        <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
          {formatCount(followersOf(company.id))} followers
        </p>
      </div>

      <div className="mt-4 flex gap-3">
        <Link to={companyPath} className={linkButtonClasses}>
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          View company
        </Link>
        <Link
          to={`${companyPath}?tab=jobs`}
          className={`${linkButtonClasses} border-blue-50 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40`}
        >
          Explore jobs
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
};

export default FollowedCompanyCard;
