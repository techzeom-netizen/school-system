import { useMemo, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  CalendarClock,
  CheckCircle2,
  ExternalLink,
  FileText,
  Search,
  Send,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import {
  appliedJobs,
  statusTabs,
  statusTone,
  type AppliedJob,
  type AppliedStatus,
} from '../data/appliedJobs';

const sortOptions = [
  { label: 'Latest applied', value: 'latest' },
  { label: 'Status progress', value: 'progress' },
  { label: 'Company name', value: 'company' },
];

const AppliedJobCard = ({ application }: { application: AppliedJob }) => {
  const { job } = application;

  return (
    <article className="rounded-t-md border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md text-lg font-black ${job.companyLogoClassName || 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'}`}
          >
            {job.companyInitial || job.company[0]}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-lg font-bold text-slate-950 dark:text-slate-100">
                {job.title}
              </h3>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone[application.status]}`}
              >
                {application.status}
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
              {job.company} | {job.location} | {job.workMode}
            </p>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
              <span>{job.experience}</span>
              <span>{job.salary}</span>
              <span>Applied {application.appliedOn}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            asChild
            className="rounded-none bg-blue-600 text-white hover:bg-blue-700"
          >
            <Link to={`/jobseekers/applied-jobs/${job.id}`}>
              View job
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="rounded-lg bg-slate-50 dark:bg-slate-950 p-3">
          <div className="flex items-start gap-2">
            <CalendarClock className="mt-0.5 h-4 w-4 text-blue-700 dark:text-blue-400" />
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Next step
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {application.nextStep}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-start gap-2">
            <FileText className="mt-0.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Resume used:{' '}
              <span className="font-semibold">{application.resume}</span>
            </p>
          </div>
          <p className="mt-3 rounded-md border border-blue-100 dark:border-blue-900 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-600 dark:text-slate-300">
            {application.recruiterNote}
          </p>
        </div>

        <div className="rounded-lg border border-slate-100 dark:border-slate-800 p-4">
          <p className="text-lg font-bold text-slate-950 dark:text-slate-100">
            Application track
          </p>
          <div className="mt-5 overflow-x-auto pb-1">
            <div
              className="grid min-w-[520px] px-2"
              style={{
                gridTemplateColumns: `repeat(${application.timeline.length}, minmax(0, 1fr))`,
              }}
            >
              {application.timeline.map((item, index) => (
                <div
                  key={`${item.label}-${index}`}
                  className="relative text-center"
                >
                  {index < application.timeline.length - 1 && (
                    <span className="absolute left-1/2 right-[-50%] top-4 h-px bg-slate-200 dark:bg-slate-700" />
                  )}
                  <span
                    className={`relative z-10 mx-auto flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white dark:ring-slate-700 ${
                      item.done
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  >
                    {item.done && <CheckCircle2 className="h-4 w-4" />}
                  </span>
                  <p className="mt-3 text-xs font-semibold text-slate-950 dark:text-slate-100">
                    {item.label}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {item.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

const AppliedJobsPage = () => {
  const [query, setQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState<AppliedStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState('latest');

  const counts = useMemo(
    () =>
      statusTabs.reduce(
        (acc, item) => ({
          ...acc,
          [item]:
            item === 'All'
              ? appliedJobs.length
              : appliedJobs.filter(application => application.status === item)
                  .length,
        }),
        {} as Record<AppliedStatus | 'All', number>
      ),
    []
  );

  const filteredApplications = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = appliedJobs.filter(application => {
      const { job } = application;
      const matchesStatus = status === 'All' || application.status === status;
      const matchesQuery =
        !normalizedQuery ||
        [
          job.title,
          job.company,
          job.location,
          job.workMode,
          application.status,
          application.nextStep,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'company')
        return a.job.company.localeCompare(b.job.company);
      if (sortBy === 'progress') {
        return (
          b.timeline.filter(item => item.done).length -
          a.timeline.filter(item => item.done).length
        );
      }
      return b.appliedOn.localeCompare(a.appliedOn);
    });
  }, [query, sortBy, status]);

  const handleSearch = () => setQuery(searchInput.trim());
  const clearSearch = () => {
    setQuery('');
    setSearchInput('');
    setStatus('All');
  };

  const handleSearchKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <section className="bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-[1560px] px-4 py-6 lg:px-8">
        <section className="rounded-t-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950/40 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
                <Briefcase className="h-3.5 w-3.5" />
                Applied jobs
              </p>
              <h1 className="mt-3 text-2xl font-bold text-slate-950 dark:text-slate-100">
                Application tracker
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Track recruiter activity, interview steps, and offers in one
                place.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:min-w-[420px]">
              {[
                ['Applications', appliedJobs.length],
                ['Interviews', counts.Interview],
                ['Offers', counts.Offer],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-lg bg-slate-50 dark:bg-slate-950 p-3 text-center"
                >
                  <p className="text-xl font-bold text-slate-950 dark:text-slate-100">
                    {value}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-t-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_auto] lg:items-start">
            <FormField
              label=""
              name="appliedJobSearch"
              type="buttonText"
              value={searchInput}
              onChange={setSearchInput}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search applied jobs by role, company, or status"
              buttonText="Search"
              buttonVariant="default"
              onButtonClick={handleSearch}
              buttonDisabled={!searchInput.trim()}
            />
            <FormField
              label=""
              name="appliedJobSort"
              type="select"
              value={sortBy}
              onChange={setSortBy}
              options={sortOptions}
            />
            <Button
              type="button"
              variant="outline"
              className="h-8 mt-2 rounded-none border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
              onClick={clearSearch}
              disabled={!query && !searchInput && status === 'All'}
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {statusTabs.map(item => (
              <button
                key={item}
                type="button"
                onClick={() => setStatus(item)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  status === item
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-700 dark:hover:text-blue-400'
                }`}
              >
                {item}
                <span
                  className={`rounded-full px-1.5 text-xs ${
                    status === item
                      ? 'bg-white/20 dark:bg-slate-900/20'
                      : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  {counts[item]}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {filteredApplications.length} applications found
            </p>
            <p className="hidden items-center gap-1 text-xs text-slate-500 dark:text-slate-400 sm:flex">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Status updates are based on recruiter actions
            </p>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="rounded-t-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 p-10 text-center shadow-sm">
              <Search className="mx-auto h-10 w-10 text-slate-300" />
              <h2 className="mt-3 font-bold text-slate-950 dark:text-slate-100">
                No applications match
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Try changing the status tab or clearing your search.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {filteredApplications.map(application => (
                <AppliedJobCard
                  key={`${application.job.id}-${application.appliedOn}`}
                  application={application}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-4 rounded-t-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-950 dark:text-slate-100">
                  Keep applying while these are in progress
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Candidates usually hear back faster when they keep 5-8 active
                  applications.
                </p>
              </div>
            </div>
            <Button
              type="button"
              asChild
              className="rounded-none bg-blue-600 text-white hover:bg-blue-700"
            >
              <Link to="/jobseekers/aarav-candidate">Find more jobs</Link>
            </Button>
          </div>
        </section>
      </div>
    </section>
  );
};

export default AppliedJobsPage;
