import type { ComponentProps } from 'react';
import { MapPin, Search } from 'lucide-react';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import type PublicJobSearchHero from './PublicJobSearchHero';

const fieldClassName =
  'space-y-0 md:space-y-0 [&_label]:sr-only [&_input]:h-11 [&_input]:rounded-md [&_input]:border-gray-200 dark:[&_input]:border-slate-700 [&_input]:bg-white dark:[&_input]:bg-slate-900 [&_input]:pl-12 [&_input]:pr-4 [&_input]:text-base [&_input]:text-gray-900 dark:[&_input]:text-slate-100 [&_input]:placeholder:text-gray-500 dark:[&_input]:placeholder:text-slate-400 [&_input]:focus:border-blue-500';

const SearchJobsHero = ({
  query,
  location,
  onQueryChange,
  onLocationChange,
  children,
}: ComponentProps<typeof PublicJobSearchHero>) => (
  <section
    aria-labelledby="job-search-heading"
    className="border-b border-blue-100 dark:border-blue-900 bg-white dark:bg-slate-900"
  >
    <div className="mx-auto w-full max-w-[1560px] px-5 py-0 lg:px-8">
      <div className="mb-4">
        <div className=" text-start">
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
      </div>
      <form
        role="search"
        aria-label="Search job openings"
        onSubmit={event => {
          event.preventDefault();
          document
            .getElementById('results')
            ?.scrollIntoView({ block: 'start', behavior: 'instant' });
        }}
        className="grid items-end gap-3 rounded-lg  border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-950 p-3 shadow-sm lg:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)_132px]"
      >
        <div className="relative min-w-0">
          <FormField
            label="Role, company or skill"
            name="jobSearch"
            type="text"
            value={query}
            onChange={onQueryChange}
            placeholder="Search by role, company, or skill"
            className={fieldClassName}
          />
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[12px] left-4 size-4 text-gray-400"
          />
        </div>
        <div className="relative min-w-0">
          <FormField
            label="Location"
            name="jobLocation"
            type="text"
            value={location}
            onChange={onLocationChange}
            placeholder="Location"
            className={fieldClassName}
          />
          <MapPin
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[12px] left-4 size-4  text-gray-400"
          />
        </div>
        <Button type="submit" size="lg" className="h-11 w-full px-6 text-base">
          <Search aria-hidden="true" className="size-5" />
          Search
        </Button>
      </form>
      {children}
    </div>
  </section>
);

export default SearchJobsHero;
