import { ArrowRight, ChevronDown, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

type AuthenticatedJobSearchHeroProps = {
  query: string;
  location: string;
  onQueryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
};

const popularSearches = [
  'Frontend',
  'Backend',
  'Product Manager',
  'Data Analyst',
  'Remote',
  'Bengaluru',
];

const AuthenticatedJobSearchHero = ({
  query,
  location,
  onQueryChange,
  onLocationChange,
}: AuthenticatedJobSearchHeroProps) => (
  <section className="flex h-auto flex-col self-start overflow-hidden rounded-xl border border-blue-300 dark:border-blue-700 bg-gradient-to-br from-white dark:from-slate-800/50 via-white dark:via-slate-800/50 to-blue-50 dark:to-slate-800/70 shadow-md shadow-blue-100 dark:shadow-blue-800 xl:h-80">
    {/* Banner image (top) */}
    <div className="relative h-36 shrink-0 sm:h-44 lg:h-52 xl:min-h-0 xl:flex-1">
      <img
        src="/frontendImages/SearchCoverImage.png"
        alt="Workspace banner"
        draggable={false}
        className="h-full w-full object-cover object-center"
      />
      {/* Fade the bottom of the image into the card */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/70 dark:from-slate-900/70 to-transparent" />
    </div>

    {/* Search card overlapping the bottom of the image */}
    <div className="relative z-10 -mt-8 shrink-0 px-3 sm:-mt-10 sm:px-5 lg:px-6">
      <div className="rounded-xl border border-blue-500/70 bg-white/95 dark:bg-slate-900/95 p-2 shadow-lg shadow-blue-900/10 backdrop-blur sm:p-3">
        <div className="grid items-start gap-2 md:grid-cols-[minmax(0,1fr)_minmax(180px,0.7fr)] lg:grid-cols-[1fr_0.7fr_170px]">
          <div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
              <input
                name="jobSearch"
                type="text"
                value={query}
                onChange={event => onQueryChange(event.target.value)}
                placeholder="Search by role, company, or skill"
                className="h-11 w-full rounded-lg bg-blue-50 dark:bg-slate-800 rounded-r-none pl-12 pr-4 text-sm text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:bg-blue-50/60 dark:focus:bg-blue-950/60 sm:h-12"
              />
            </div>
          </div>

          <div className="lg:boder-l lg:border-slate-200 dark:lg:border-slate-700">
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
              <input
                name="jobLocation"
                type="text"
                value={location}
                onChange={event => onLocationChange(event.target.value)}
                placeholder="Location"
                className="h-11 w-full rounded-lg bg-blue-50 dark:bg-gray-800 rounded-l-none pl-12 pr-10 text-sm text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:bg-blue-50/60 dark:focus:bg-blue-950/60 sm:h-12"
              />
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
            </div>
          </div>

          <Button className="h-11 w-full rounded-lg bg-blue-600 px-6 text-sm hover:bg-blue-700 sm:h-12 sm:text-base md:col-span-2 lg:col-span-1 dark:text-white">
            Search Jobs
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>

    {/* Popular searches */}
    <div className="shrink-0 px-3 py-4 sm:px-5 lg:px-6 xl:py-5">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="w-full font-semibold text-slate-700 dark:text-slate-200 sm:w-auto sm:mr-2">
          Popular searches:
        </span>
        {popularSearches.map(chip => (
          <Button
            key={chip}
            type="button"
            onClick={() =>
              chip === 'Remote' || chip === 'Bengaluru'
                ? onLocationChange(chip)
                : onQueryChange(chip)
            }
            variant="outline"
            className="h-8 rounded-full border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 px-3 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-700 dark:hover:text-blue-400 sm:h-7 sm:px-4 sm:text-sm"
          >
            {chip}
          </Button>
        ))}
      </div>
    </div>
  </section>
);

export default AuthenticatedJobSearchHero;
