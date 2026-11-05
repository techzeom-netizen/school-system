import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CompanyLogo from '@/features/jobseekers/components/FindCompanies/CompanyLogo';
import { toneClasses } from '@/features/jobseekers/data/companies';
import { companies } from './data/landingContent';

const TopCompaniesSection = ({
  onSelect,
}: {
  onSelect: (company: string) => void;
}) => (
  <section id="companies" aria-labelledby="companies-heading">
    <div className="mx-auto w-full max-w-[1560px] px-5 py-10 lg:px-8 lg:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="companies-heading"
            className="text-2xl font-bold text-gray-950 dark:text-slate-100"
          >
            Companies hiring now
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
            Meet the teams looking for their next great hire.
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-full border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 focus-visible:ring-blue-600"
        >
          <Link to="/companies">
            See all companies
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-5">
        {companies.map(company => (
          <article
            key={company.name}
            className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-[0_12px_28px_-18px_rgba(37,99,235,0.4)] focus-within:border-blue-400 motion-reduce:transform-none motion-reduce:transition-none"
          >
            <div
              className={`relative h-20 overflow-hidden ${toneClasses[company.tone]}`}
            >
              <span
                aria-hidden="true"
                className="absolute -bottom-10 -right-4 h-28 w-28 rounded-full border-[16px] border-white/35 dark:border-slate-700/35"
              />
              <span
                aria-hidden="true"
                className="absolute -left-6 -top-8 h-20 w-20 rounded-full bg-white/25 dark:bg-slate-900/25"
              />
              <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full border border-white/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/90 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                <BadgeCheck aria-hidden="true" className="size-3" />
                Verified
              </span>
            </div>
            <div className="relative -mt-7 flex flex-1 flex-col px-3.5 pb-3.5 sm:px-4 sm:pb-4">
              <CompanyLogo
                company={company}
                size="md"
                className="rounded-xl ring-4 ring-white dark:ring-slate-700"
              />
              <h3 className="mt-4 min-h-10 text-sm font-bold leading-5 text-gray-950 dark:text-slate-100">
                {company.name}
              </h3>
              <p className="mt-1 flex items-start gap-1.5 text-xs text-gray-500 dark:text-slate-400">
                <MapPin
                  aria-hidden="true"
                  className="mt-0.5 size-3.5 shrink-0"
                />
                <span>{company.city}</span>
              </p>
              <div className="mt-auto pt-4">
                <div className="border-t border-gray-100 dark:border-slate-800 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full justify-between gap-1 rounded-lg border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:hover:text-white focus-visible:ring-blue-600 motion-reduce:transition-none"
                    aria-label={`View ${company.jobs} open jobs at ${company.name}`}
                    onClick={() => onSelect(company.name)}
                  >
                    {company.jobs} open jobs
                    <ArrowRight
                      aria-hidden="true"
                      className="size-3.5 shrink-0"
                    />
                  </Button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
export default TopCompaniesSection;
