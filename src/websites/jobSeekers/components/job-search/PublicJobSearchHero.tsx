import type { ReactNode } from 'react';
import { ArrowRight, MapPin, Search } from 'lucide-react';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import PopularSearches from '../PublicLanding/PopularSearches';
import type { LandingFilter } from '../PublicLanding/data/landingContent';

type PublicJobSearchHeroProps = {
  query: string;
  location: string;
  onQueryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onPopularSearchSelect: (filter: LandingFilter) => void;
  children?: ReactNode;
};

const PublicJobSearchHero = ({
  query,
  location,
  onQueryChange,
  onLocationChange,
  onPopularSearchSelect,
  children,
}: PublicJobSearchHeroProps) => (
  <section
    aria-labelledby="job-search-heading"
    className="relative isolate overflow-hidden border-b border-blue-100 dark:border-blue-900 bg-gradient-to-b from-blue-50/80 dark:from-blue-950/80 via-white dark:via-slate-900 to-white dark:to-slate-900"
  >
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -right-32 -top-44 -z-10 h-96 w-96 rounded-full border-[48px] border-blue-100/40 dark:border-blue-900/40"
    />
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-32 -left-32 -z-10 h-64 w-64 rounded-full bg-blue-50/70 dark:bg-blue-950/70"
    />
    <div className="mx-auto w-full max-w-[1560px] px-5 py-5 lg:px-8 lg:py-5">
      <div className="mx-auto max-w-4xl text-center">
        <h1
          id="job-search-heading"
          className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-gray-950 dark:text-slate-100 sm:text-4xl"
        >
          Find roles that match your{' '}
          <span className="text-blue-700 dark:text-blue-400">
            skills, location, and experience.
          </span>
        </h1>
      </div>

      <div className="mx-auto mt-7 max-w-[1100px]">
        <form
          role="search"
          aria-label="Search job openings"
          onSubmit={event => {
            event.preventDefault();
            document
              .getElementById('results')
              ?.scrollIntoView({ block: 'start', behavior: 'instant' });
          }}
          className="grid items-end gap-4 rounded-2xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 p-4 shadow-[0_12px_36px_-24px_rgba(37,99,235,0.35)] sm:p-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_160px]"
        >
          <div className="relative min-w-0">
            <FormField
              label="Role, company or skill"
              name="jobSearch"
              type="text"
              value={query}
              onChange={onQueryChange}
              placeholder="Job title, company or keywords"
              className="[&_label]:font-semibold [&_label]:text-gray-700 dark:[&_label]:text-slate-200 [&_input]:h-12 [&_input]:rounded-xl [&_input]:border-gray-200 dark:[&_input]:border-slate-700 [&_input]:bg-gray-50/70 dark:[&_input]:bg-slate-950/70 [&_input]:pl-10 [&_input]:pr-3 [&_input]:text-sm [&_input]:text-gray-950 dark:[&_input]:text-slate-100 [&_input]:placeholder:text-gray-400 [&_input]:focus:border-blue-500 [&_input]:focus:bg-white dark:[&_input]:focus:bg-slate-900"
            />
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute bottom-3.5 left-3 size-5 text-blue-500 dark:text-blue-400"
            />
          </div>
          <div className="relative min-w-0">
            <FormField
              label="Location"
              name="jobLocation"
              type="text"
              value={location}
              onChange={onLocationChange}
              placeholder="City or remote"
              className="[&_label]:font-semibold [&_label]:text-gray-700 dark:[&_label]:text-slate-200 [&_input]:h-12 [&_input]:rounded-xl [&_input]:border-gray-200 dark:[&_input]:border-slate-700 [&_input]:bg-gray-50/70 dark:[&_input]:bg-slate-950/70 [&_input]:pl-10 [&_input]:pr-3 [&_input]:text-sm [&_input]:text-gray-950 dark:[&_input]:text-slate-100 [&_input]:placeholder:text-gray-400 [&_input]:focus:border-blue-500 [&_input]:focus:bg-white dark:[&_input]:focus:bg-slate-900"
            />
            <MapPin
              aria-hidden="true"
              className="pointer-events-none absolute bottom-3.5 left-3 size-5 text-blue-500 dark:text-blue-400"
            />
          </div>
          <Button
            type="submit"
            variant="outline"
            size="lg"
            className="group h-12 w-full rounded-xl border-blue-700 bg-blue-700 px-5 text-sm font-semibold text-white shadow-sm hover:border-blue-800 hover:bg-blue-800 hover:text-white dark:hover:text-white focus-visible:ring-blue-500 focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            Search jobs
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none motion-reduce:group-hover:transform-none"
            />
          </Button>
        </form>
        <PopularSearches onSelect={onPopularSearchSelect} />
        {children}
      </div>
    </div>
  </section>
);
export default PublicJobSearchHero;
