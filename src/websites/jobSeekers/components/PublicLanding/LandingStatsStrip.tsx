import type { CSSProperties } from 'react';
import { Triangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LandingStat } from './data/landingContent';

const LandingStatsStrip = ({ stats }: { stats: LandingStat[] }) => (
  <section
    aria-labelledby="stats-heading"
    className="relative z-10 -mt-10 grid grid-cols-2 rounded-2xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 shadow-md sadow-[12px_2px_50px_-20px_rgba(37,99,235,0.45)] sm:-mt-14 lg:grid-cols-4"
  >
    <h2 id="stats-heading" className="sr-only">
      Careers at a glance
    </h2>
    {stats.map(
      ({ value, label, delta, growth, icon: Icon, accent, tint }, index) => (
        <div
          key={label}
          style={
            { '--stat-accent': accent, '--stat-tint': tint } as CSSProperties
          }
          className={cn(
            'relative flex flex-wrap items-center gap-2.5 p-3.5 sm:flex-nowrap sm:gap-4 sm:p-6',
            index >= 2 &&
              'border-t border-gray-200 dark:border-slate-700 lg:border-t-0'
          )}
        >
          {index > 0 && (
            <span
              aria-hidden="true"
              className={cn(
                'absolute inset-y-[22px] left-0 w-px bg-gray-200 dark:bg-slate-700',
                index % 2 === 0 && 'hidden lg:block'
              )}
            />
          )}
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--stat-tint)] dark:bg-[color:color-mix(in_srgb,var(--stat-tint)_12%,#0f172a)] text-[var(--stat-accent)] dark:text-[color:color-mix(in_srgb,var(--stat-accent)_60%,white)] ring-1 ring-[color-mix(in_srgb,var(--stat-accent)_18%,transparent)] sm:h-14 sm:w-14">
            <Icon aria-hidden="true" className="size-6" />
          </span>
          <div className="min-w-[90px] flex-1">
            <p className="md:text-xl font-extrabold leading-none tracking-tight text-gray-800 dark:text-slate-100 sm:text-xl">
              {value}
            </p>
            <p className="mt-1.5 text-xs font-semibold text-gray-700 dark:text-slate-200">
              {label}
            </p>
            <span
              className={cn(
                'mt-2 hidden items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold sm:inline-flex',
                growth
                  ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300'
              )}
            >
              {growth && (
                <Triangle aria-hidden="true" className="size-2 fill-current" />
              )}
              {delta}
            </span>
          </div>
        </div>
      )
    )}
  </section>
);
export default LandingStatsStrip;
