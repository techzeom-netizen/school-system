import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  CheckCircle2,
  Search,
  ThumbsUp,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormField from '@/components/common/FormField';
import { RatingBar, Stars } from '@/components/common/Rating';
import { formatLpa, type Company } from '../../data/companies';

type TabProps = {
  company: Company;
};

export const OverviewTab = ({ company }: TabProps) => {
  const [expanded, setExpanded] = useState(false);
  const about = expanded ? company.about : `${company.about.slice(0, 180)}...`;

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
          About
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {about}
        </p>
        <Button
          type="button"
          variant="link"
          className="mt-2 h-auto p-0 text-blue-700 dark:text-blue-400"
          onClick={() => setExpanded(current => !current)}
        >
          {expanded ? 'Show less' : 'Show more'}
        </Button>
      </section>

      <section className="rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
          Employee ratings
        </h2>
        <div className="mt-4 grid gap-5 lg:grid-cols-[180px_1fr]">
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/40 p-4 text-center">
            <p className="text-4xl font-black text-blue-700 dark:text-blue-400">
              {company.rating.toFixed(1)}
            </p>
            <Stars value={company.rating} className="mt-2 justify-center" />
            <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
              {company.reviewCount} employee reviews
            </p>
          </div>
          <div className="space-y-3">
            <RatingBar label="Culture" value={company.breakdown.culture} />
            <RatingBar
              label="Work-life balance"
              value={company.breakdown.workLife}
            />
            <RatingBar
              label="Management"
              value={company.breakdown.management}
            />
            <RatingBar
              label="Compensation"
              value={company.breakdown.compensation}
            />
            <RatingBar label="Career growth" value={company.breakdown.growth} />
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-green-100 dark:border-green-900 bg-green-50 dark:bg-green-950/40 p-4">
            <ThumbsUp
              className="h-5 w-5 text-green-700 dark:text-green-400"
              aria-hidden="true"
            />
            <p className="mt-2 text-2xl font-black text-green-700 dark:text-green-400">
              {company.recommendPercent}%
            </p>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Recommend to a friend
            </p>
          </div>
          <div className="rounded-lg border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-4">
            <CheckCircle2
              className="h-5 w-5 text-blue-700 dark:text-blue-400"
              aria-hidden="true"
            />
            <p className="mt-2 text-2xl font-black text-blue-700 dark:text-blue-400">
              {company.ceoApproval}%
            </p>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Approve of CEO
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
          Perks
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {company.perks.map(perk => (
            <span
              key={perk}
              className="rounded-full bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 text-sm font-semibold text-blue-700 dark:text-blue-400"
            >
              {perk}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

export const JobsTab = ({ company }: TabProps) => (
  <section className="rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
    <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
      Open jobs
    </h2>
    {company.jobs.length ? (
      <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
        {company.jobs.map(job => (
          <div
            key={job.id}
            className="grid gap-3 py-4 lg:grid-cols-[1fr_auto] lg:items-center"
          >
            <div className="min-w-0">
              <h3 className="font-bold text-slate-950 dark:text-slate-100">
                {job.title}
              </h3>
              <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-600 dark:text-slate-300">
                <span>{job.location}</span>
                <span>{job.experience}</span>
                <span>{job.salary}</span>
                <span>{job.posted}</span>
                <span className="rounded-full bg-green-50 dark:bg-green-950/40 px-2 py-0.5 font-semibold text-green-700 dark:text-green-400">
                  {job.workMode}
                </span>
              </p>
            </div>
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 dark:text-white"
            >
              <Link to={`/jobseekers/jobs/${job.id}?company=${company.id}`}>
                <Briefcase className="h-4 w-4" aria-hidden="true" />
                View job
              </Link>
            </Button>
          </div>
        ))}
      </div>
    ) : (
      <p className="mt-4 rounded-lg bg-slate-50 dark:bg-slate-950 p-6 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
        No open jobs right now.
      </p>
    )}
  </section>
);

export const ReviewsTab = ({ company }: TabProps) => {
  const [ratingFilter, setRatingFilter] = useState(0);
  const reviews = ratingFilter
    ? company.reviews.filter(
        review => Math.floor(review.rating) === ratingFilter
      )
    : company.reviews;

  return (
    <section className="rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
          Reviews
        </h2>
        <div className="flex flex-wrap gap-2">
          {[0, 4, 3].map(value => (
            <Button
              key={value}
              type="button"
              size="sm"
              variant={ratingFilter === value ? 'default' : 'outline'}
              className={
                ratingFilter === value
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'border-blue-200 dark:border-blue-800'
              }
              onClick={() => setRatingFilter(value)}
            >
              {value === 0 ? 'All' : `${value} stars`}
            </Button>
          ))}
        </div>
      </div>
      <div className="mt-4 space-y-4">
        {reviews.map(review => (
          <article
            key={review.id}
            className="rounded-lg border border-slate-200 dark:border-slate-700 p-4"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <Stars value={review.rating} />
                <h3 className="mt-2 font-bold text-slate-950 dark:text-slate-100">
                  {review.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {review.role} · {review.employmentStatus} · {review.date}
                </p>
              </div>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                {review.rating.toFixed(1)}
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-green-50 dark:bg-green-950/40 p-3">
                <p className="flex items-center gap-2 text-sm font-bold text-green-700 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  Pros
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {review.pros}
                </p>
              </div>
              <div className="rounded-lg bg-red-50 dark:bg-red-950/40 p-3">
                <p className="flex items-center gap-2 text-sm font-bold text-red-700 dark:text-red-400">
                  <XCircle className="h-4 w-4" aria-hidden="true" />
                  Cons
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {review.cons}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export const SalariesTab = ({ company }: TabProps) => {
  const [query, setQuery] = useState('');
  const salaries = useMemo(
    () =>
      company.salaries.filter(salary =>
        salary.role.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [company.salaries, query]
  );
  const highest = Math.max(...company.salaries.map(salary => salary.max));

  return (
    <section className="rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
          Salaries
        </h2>
        <div className="relative sm:w-72">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <FormField
            label="Search job title"
            name="salary-search"
            value={query}
            onChange={setQuery}
            placeholder="Search job title"
            className="[&_input]:h-10 [&_input]:rounded-lg [&_input]:pl-9 [&_label]:sr-only"
          />
        </div>
      </div>
      {salaries.length ? (
        <div className="mt-4 space-y-4">
          {salaries.map(salary => (
            <article
              key={salary.id}
              className="rounded-lg border border-slate-200 dark:border-slate-700 p-4"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-bold text-slate-950 dark:text-slate-100">
                    {salary.role}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {salary.reports} salary reports
                  </p>
                </div>
                <p className="text-lg font-black text-blue-700 dark:text-blue-400">
                  {formatLpa(salary.average)}
                </p>
              </div>
              <div className="mt-4 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-2 rounded-full bg-blue-600"
                  style={{
                    width: `${Math.max(8, (salary.max / highest) * 100)}%`,
                  }}
                />
              </div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {formatLpa(salary.min)} - {formatLpa(salary.max)}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-lg bg-slate-50 dark:bg-slate-950 p-6 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
          No salary roles match your search.
        </p>
      )}
    </section>
  );
};
