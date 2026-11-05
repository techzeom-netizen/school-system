import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  quickTiles,
  quickTileAccents,
  type LandingFilter,
} from './data/landingContent';

const QuickJobTiles = ({
  onSelect,
}: {
  onSelect: (filter: LandingFilter) => void;
}) => (
  <section aria-labelledby="quick-jobs-heading">
    <h2
      id="quick-jobs-heading"
      className="text-2xl font-bold text-gray-800 dark:text-slate-100"
    >
      Find your kind of work
    </h2>
    <p className="mt-1.5 text-sm text-gray-700 dark:text-slate-200 sm:text-base">
      Start with how you want to work. One tap filters the results below.
    </p>
    <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-5">
      {quickTiles.map(
        ({ title, description, icon: Icon, accent, count, filter }) => (
          <Button
            key={title}
            type="button"
            variant="outline"
            aria-label={`${title}, ${count}`}
            onClick={() => onSelect(filter)}
            className={cn(
              'group relative h-auto min-h-[170px] min-w-0 flex-col items-stretch justify-between gap-0 overflow-hidden whitespace-normal rounded-2xl border-[var(--tile-border)] bg-gradient-to-br from-[var(--tile-tint)] dark:from-[color:color-mix(in_srgb,var(--tile-tint)_12%,#0f172a)] to-white dark:to-slate-900 p-4 text-left text-gray-800 dark:text-slate-100 transition-all duration-200 last:col-span-2 last:min-h-[140px] hover:-translate-y-0.5 hover:border-[var(--tile-accent)] hover:text-gray-950 dark:hover:text-slate-100 hover:shadow-[0_7px_14px_-16px_var(--tile-accent)] focus-visible:border-blue-600 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none sm:min-h-[196px] sm:p-5 md:last:col-span-1 md:last:min-h-[196px]',
              quickTileAccents[accent]
            )}
          >
            <Icon
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-5 -right-4 size-20 text-[var(--tile-accent)] dark:text-[color:color-mix(in_srgb,var(--tile-accent)_60%,white)] opacity-[0.09] transition-[transform,opacity] duration-200 group-hover:-rotate-6 group-hover:scale-110 group-hover:opacity-[0.14] motion-reduce:transform-none motion-reduce:transition-none motion-reduce:group-hover:transform-none"
            />
            <span className="relative z-10 flex items-start justify-between gap-2">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--tile-accent)] text-white shadow-[0_8px_16px_-8px_var(--tile-accent)] sm:h-12 sm:w-12">
                <Icon aria-hidden="true" className="size-5 sm:size-6" />
              </span>
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--tile-border)] bg-white dark:bg-slate-900 text-[var(--tile-accent)] dark:text-[color:color-mix(in_srgb,var(--tile-accent)_60%,white)] transition-[transform,color,background-color,border-color] duration-200 group-hover:translate-x-0.5 group-hover:border-[var(--tile-accent)] group-hover:bg-[var(--tile-accent)] group-hover:text-white dark:group-hover:text-white motion-reduce:transform-none motion-reduce:transition-none motion-reduce:group-hover:transform-none"
              >
                <ArrowRight className="size-4" />
              </span>
            </span>
            <span className="relative z-10 block min-w-0">
              <span className="block text-base font-extrabold leading-tight sm:text-lg">
                {title}
              </span>
              <span className="mt-0.5 block text-sm font-normal text-gray-600 dark:text-slate-300">
                {description}
              </span>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--tile-border)] bg-white dark:bg-slate-900 px-3 py-0.5 text-xs font-bold text-[var(--tile-accent)] dark:text-[color:color-mix(in_srgb,var(--tile-accent)_60%,white)]">
                <span
                  aria-hidden="true"
                  className="h-[7px] w-[7px] rounded-full bg-[var(--tile-accent)]"
                />
                {count}
              </span>
            </span>
          </Button>
        )
      )}
    </div>
  </section>
);
export default QuickJobTiles;
