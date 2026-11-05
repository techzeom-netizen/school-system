import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DiscoverBanner = () => (
  <section className="flex flex-col gap-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
    <div>
      <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
        Discover more great companies
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Build your network and never miss an opportunity.
      </p>
    </div>
    <Link
      to="/jobseekers/companies"
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    >
      Explore companies
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  </section>
);

export default DiscoverBanner;
