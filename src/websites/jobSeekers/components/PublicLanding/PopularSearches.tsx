import { TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { popularSearches, type LandingFilter } from './data/landingContent';

const PopularSearches = ({
  onSelect,
}: {
  onSelect: (filter: LandingFilter) => void;
}) => (
  <section
    aria-labelledby="popular-searches-heading"
    className="mt-5 flex flex-wrap items-center gap-2.5"
  >
    <h2
      id="popular-searches-heading"
      className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-950 dark:text-slate-100"
    >
      <TrendingUp
        aria-hidden="true"
        className="size-[18px] text-orange-500 dark:text-orange-400"
      />
      Trending now
    </h2>
    {popularSearches.map(item => (
      <Button
        key={item.label}
        type="button"
        variant="outline"
        onClick={() => onSelect(item.filter)}
        className="h-auto gap-2 rounded-full border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-1.5 pl-4 pr-2 text-sm font-semibold text-gray-950 dark:text-slate-100 shadow-sm transition-all duration-150 hover:-translate-y-px hover:border-blue-600 hover:bg-white dark:hover:bg-slate-900 hover:text-gray-950 dark:hover:text-slate-100 hover:shadow-[0_6px_14px_-8px_theme(colors.blue.600)] focus-visible:border-blue-600 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
      >
        {item.label}
        <span className="rounded-full bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-400">
          {item.count}
        </span>
      </Button>
    ))}
  </section>
);
export default PopularSearches;
