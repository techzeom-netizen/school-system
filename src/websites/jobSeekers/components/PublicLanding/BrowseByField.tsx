import type { CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { categories } from './data/landingContent';

const BrowseByField = ({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (category: string) => void;
}) => (
  <section aria-labelledby="browse-field-heading" className="mt-10">
    <h2
      id="browse-field-heading"
      className="text-2xl font-bold text-gray-800 dark:text-slate-100"
    >
      Browse by field
    </h2>
    <p className="mt-1 text-sm text-gray-600 dark:text-slate-300 sm:text-base">
      Explore opportunities in your area of expertise.
    </p>
    <div className="mt-6 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
      {categories.map(({ name, count, icon: Icon, accent, tint, roles }) => (
        <Button
          key={name}
          type="button"
          variant="outline"
          aria-pressed={selected === name}
          onClick={() => onSelect(selected === name ? '' : name)}
          style={
            { '--field-accent': accent, '--field-tint': tint } as CSSProperties
          }
          className={cn(
            'group h-auto min-w-0 flex-col items-stretch justify-start gap-1.5 whitespace-normal rounded-xl border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--field-accent)] hover:bg-white dark:hover:bg-slate-900 hover:shadow-[6px_9px_10px_-10px_var(--field-accent)] focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none',
            selected === name &&
              'border-[var(--field-accent)] bg-gradient-to-br from-[var(--field-tint)] dark:from-[color:color-mix(in_srgb,var(--field-tint)_12%,#0f172a)] to-white dark:to-slate-900 ring-2 ring-[var(--field-accent)]'
          )}
        >
          <span className="flex items-start justify-between gap-3">
            <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-[var(--field-tint)] dark:bg-[color:color-mix(in_srgb,var(--field-tint)_12%,#0f172a)] text-[var(--field-accent)] dark:text-[color:color-mix(in_srgb,var(--field-accent)_60%,white)]">
              <Icon aria-hidden="true" className="size-[26px]" />
            </span>
            <span
              aria-hidden="true"
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 dark:border-slate-700 text-gray-400 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-[var(--field-accent)] group-hover:bg-[var(--field-accent)] group-hover:text-white dark:group-hover:text-white motion-reduce:transform-none motion-reduce:transition-none motion-reduce:group-hover:transform-none',
                selected === name &&
                  'border-[var(--field-accent)] bg-[var(--field-accent)] text-white'
              )}
            >
              <ArrowUpRight className="size-4" />
            </span>
          </span>
          <span className="block text-lg font-extrabold text-gray-950 dark:text-slate-100">
            {name}
          </span>
          <span className="text-sm font-normal text-gray-600 dark:text-slate-300">
            <strong className="text-base text-gray-950 dark:text-slate-100">
              {count}
            </strong>{' '}
            open jobs
          </span>
          <span className="mt-auto flex flex-wrap gap-1.5 border-t border-dashed border-gray-200 dark:border-slate-700 pt-3.5">
            {roles.slice(0, 3).map(role => (
              <span
                key={role}
                className="rounded-md border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-950 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:text-slate-300"
              >
                {role}
              </span>
            ))}
          </span>
        </Button>
      ))}
    </div>
  </section>
);
export default BrowseByField;
