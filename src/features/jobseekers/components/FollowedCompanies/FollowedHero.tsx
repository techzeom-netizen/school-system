import { Building2 } from 'lucide-react';

type FollowedHeroProps = {
  followingCount: number;
  openJobsCount: number;
};

const FollowedHero = ({ followingCount, openJobsCount }: FollowedHeroProps) => (
  <section className="rounded-t-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950/40 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
          <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
          Your career network
        </p>
        <h1 className="mt-3 text-2xl font-bold text-slate-950 dark:text-slate-100">
          Companies you're following
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Track favorite employers, open roles, and alerts from one focused
          watchlist.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:min-w-[280px]">
        {[
          ['Following', followingCount],
          ['Open jobs', openJobsCount],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg bg-slate-50 dark:bg-slate-950 p-3 text-center"
          >
            <p className="text-xl font-bold text-slate-950 dark:text-slate-100">
              {value}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FollowedHero;
