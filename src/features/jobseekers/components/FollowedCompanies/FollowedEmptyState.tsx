import { Heart, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

type FollowedEmptyStateProps = {
  type: 'none' | 'filters';
  onClear?: () => void;
};

const FollowedEmptyState = ({ type, onClear }: FollowedEmptyStateProps) => {
  if (type === 'none') {
    return (
      <section className="rounded-lg border border-dashed border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 p-10 text-center shadow-sm">
        <Heart className="mx-auto h-10 w-10 text-blue-200" aria-hidden="true" />
        <h2 className="mt-3 text-lg font-bold text-slate-950 dark:text-slate-100">
          You are not following any companies yet
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Follow companies to build a personalized employer watchlist.
        </p>
        <Button
          asChild
          className="mt-5 bg-blue-600 hover:bg-blue-700 dark:text-white"
        >
          <Link to="/jobseekers/companies">Find companies</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 p-10 text-center shadow-sm">
      <SearchX
        className="mx-auto h-10 w-10 text-slate-300"
        aria-hidden="true"
      />
      <h2 className="mt-3 text-lg font-bold text-slate-950 dark:text-slate-100">
        No followed companies match
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Try changing your search, industry, or watchlist chips.
      </p>
      <Button
        type="button"
        variant="outline"
        onClick={onClear}
        className="mt-5 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-700 dark:hover:text-red-400"
      >
        Clear search and filters
      </Button>
    </section>
  );
};

export default FollowedEmptyState;
