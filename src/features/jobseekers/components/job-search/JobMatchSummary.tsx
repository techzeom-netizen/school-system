import { Filter, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

type JobMatchSummaryProps = {
  count: number;
  activeFilterCount: number;
  onOpenFilters: () => void;
};

const JobMatchSummary = ({
  count,
  activeFilterCount,
  onOpenFilters,
}: JobMatchSummaryProps) => (
  <section className="flex flex-col gap-3 border border-blue-300 dark:border-blue-700 rounded-t-md bg-white dark:bg-slate-800/50 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400">
        <Target className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
          {count} jobs match your profile
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Based on your skills, experience and preferences.
        </p>
      </div>
    </div>

    <Button
      type="button"
      variant="outline"
      size="sm"
      className="hidden shrink-0 gap-2 sm:inline-flex xl:hidden"
      onClick={onOpenFilters}
    >
      <Filter className="h-4 w-4" />
      Filters
      {activeFilterCount > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white">
          {activeFilterCount}
        </span>
      )}
    </Button>
  </section>
);

export default JobMatchSummary;
