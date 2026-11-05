import React from 'react';
import {
  ArrowRight,
  Bookmark,
  Briefcase,
  Calendar,
  GraduationCap,
  Layers,
  Link as LinkIcon,
  Linkedin,
  Mail,
  Map,
  MapPin,
  Share2,
  Timer,
  Twitter,
  Wallet,
} from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { allJobs, findJobById } from '../data/jobs';

const JobDetailPage = () => {
  const { jobId } = useParams();
  const [searchParams] = useSearchParams();
  const job = findJobById(jobId, {
    companyId: searchParams.get('company'),
  });
  const relatedJobs = allJobs
    .filter(
      item =>
        item.id !== jobId || (job ? item.companyId !== job.companyId : false)
    )
    .slice(0, 6);

  if (!job) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-950 dark:text-slate-100">
          Job not found
        </h1>
        <p className="mt-3 text-gray-600 dark:text-slate-300">
          This job may have been removed or the link is incorrect.
        </p>
        <Button asChild className="mt-6">
          <Link to="/jobseekers">Back to jobs</Link>
        </Button>
      </section>
    );
  }

  return (
    <>
      <section className="bg-white dark:bg-slate-900">
        <div className="mx-auto grid w-full px-10 gap-10  py-10 lg:grid-cols-[1fr_420px] lg:px-8">
          <article>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div
                className={cn(
                  'flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-4xl font-black',
                  job.companyLogoClassName || 'bg-blue-600 text-white'
                )}
              >
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={`${job.company} logo`}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  job.companyInitial || job.company[0]
                )}
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-950 dark:text-slate-100">
                  {job.title}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-base text-gray-600 dark:text-slate-300">
                  <span>at {job.company}</span>
                  <Badge className="rounded-sm bg-green-600 px-2 py-1 text-[11px] uppercase text-white hover:bg-green-600">
                    {job.type}
                  </Badge>
                  {job.featured && (
                    <Badge className="rounded-sm bg-red-50 dark:bg-red-950/40 px-2 py-1 text-[11px] font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-6 text-sm leading-7 text-gray-600 dark:text-slate-300">
              <section>
                <h3 className="mb-4 text-base font-semibold text-gray-950 dark:text-slate-100">
                  Job Description
                </h3>
                <p>{job.description}</p>
                <p className="mt-4">
                  You will collaborate with product, design, and operations
                  teams to build reliable hiring experiences that feel clear,
                  fast, and easy to use for every candidate.
                </p>
                <p className="mt-4">
                  This role is ideal for someone who enjoys practical product
                  work, communicates well with cross-functional teams, and wants
                  to help shape a growing HR platform.
                </p>
              </section>

              <section>
                <h3 className="mb-2 text-base font-semibold text-gray-950 dark:text-slate-100">
                  Requirements
                </h3>
                <ul className="list-disc space-y-1 pl-5">
                  {job.responsibilities.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                  {job.skills.slice(0, 4).map(skill => (
                    <li key={skill}>Hands-on experience with {skill}.</li>
                  ))}
                  <li>
                    Strong problem-solving and written communication skills.
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="mb-2 text-base font-semibold text-gray-950 dark:text-slate-100">
                  Desirable
                </h3>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Experience working on SaaS, HR, or hiring products.</li>
                  <li>
                    Comfort with fast-moving product and operations teams.
                  </li>
                  <li>
                    Ability to turn ambiguous requirements into clean work.
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="mb-2 text-base font-semibold text-gray-950 dark:text-slate-100">
                  Benefits
                </h3>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    Flexible work model with modern collaboration practices.
                  </li>
                  <li>Learning budget and support for professional growth.</li>
                  <li>Paid time off, wellness support, and team events.</li>
                  <li>
                    Opportunity to contribute to a growing hiring platform.
                  </li>
                </ul>
              </section>
            </div>
          </article>

          <aside className="space-y-6">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label={`Save ${job.title}`}
                className="h-12 w-12 rounded-sm bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40"
              >
                <Bookmark className="h-5 w-5" />
              </Button>
              <Button className="h-12 flex-1 rounded-sm bg-blue-700 px-8 text-white hover:bg-blue-800">
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-slate-700 rounded-md border border-blue-100 dark:border-blue-900 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="px-2 text-center">
                <p className="text-sm font-semibold text-gray-950 dark:text-slate-100">
                  Salary (INR)
                </p>
                <p className="mt-4 text-lg font-semibold text-green-600 dark:text-green-400">
                  {job.salary}
                </p>
                <p className="mt-1 text-sm text-gray-400">Yearly salary</p>
              </div>
              <div className="px-2 text-center">
                <Map className="mx-auto h-7 w-7 text-blue-700 dark:text-blue-400" />
                <p className="mt-3 text-sm font-semibold text-gray-950 dark:text-slate-100">
                  Job Location
                </p>
                <p className="mt-1 text-sm text-gray-400">{job.location}</p>
              </div>
            </div>

            <div className="rounded-md border border-blue-100 dark:border-blue-900 bg-white dark:bg-slate-900 shadow-sm">
              <div className="p-6">
                <h3 className="text-base font-semibold text-gray-950 dark:text-slate-100">
                  Job Overview
                </h3>
                <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
                  <OverviewItem
                    icon={<Calendar />}
                    label="Job posted"
                    value={job.posted}
                  />
                  <OverviewItem
                    icon={<Timer />}
                    label="Job expire in"
                    value="30 days"
                  />
                  <OverviewItem
                    icon={<Layers />}
                    label="Job level"
                    value={job.experience}
                  />
                  <OverviewItem
                    icon={<Wallet />}
                    label="Experience"
                    value={job.salary}
                  />
                  <OverviewItem
                    icon={<GraduationCap />}
                    label="Education"
                    value="Graduation"
                  />
                  <OverviewItem
                    icon={<Briefcase />}
                    label="Openings"
                    value={`${job.openings} roles`}
                  />
                </div>
              </div>

              <div className="border-t border-blue-100 dark:border-blue-900 p-6">
                <h3 className="text-base font-semibold text-gray-950 dark:text-slate-100">
                  Share this job:
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40"
                  >
                    <LinkIcon className="h-4 w-4" />
                    Copy Links
                  </Button>
                  <ShareButton label="Share on LinkedIn">
                    <Linkedin className="h-4 w-4" />
                  </ShareButton>
                  <ShareButton label="Share this job">
                    <Share2 className="h-4 w-4" />
                  </ShareButton>
                  <ShareButton label="Share on Twitter">
                    <Twitter className="h-4 w-4" />
                  </ShareButton>
                  <ShareButton label="Share by email">
                    <Mail className="h-4 w-4" />
                  </ShareButton>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="mx-auto w-full  px-5 py-16 lg:px-8">
          <h2 className="text-3xl font-semibold text-gray-950 dark:text-slate-100">
            Similar Jobs
          </h2>
          <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {relatedJobs.map(relatedJob => (
              <Link
                key={relatedJob.id}
                to={`/jobseekers/jobs/${relatedJob.id}${
                  relatedJob.companyId ? `?company=${relatedJob.companyId}` : ''
                }`}
                className="group rounded-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm transition hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-950 dark:text-slate-100 transition group-hover:text-blue-700 dark:group-hover:text-blue-400">
                      {relatedJob.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                      <Badge className="rounded-sm bg-green-50 dark:bg-green-950/40 px-2 py-0.5 text-[10px] uppercase text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/40">
                        {relatedJob.type}
                      </Badge>
                      <span>Salary: {relatedJob.salary}</span>
                    </div>
                  </div>
                  <Bookmark className="mt-8 h-5 w-5 text-gray-300 transition group-hover:text-blue-700 dark:group-hover:text-blue-400" />
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded text-base font-black',
                      relatedJob.companyLogoClassName ||
                        'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                    )}
                  >
                    {relatedJob.companyLogo ? (
                      <img
                        src={relatedJob.companyLogo}
                        alt={`${relatedJob.company} logo`}
                        className="h-full w-full rounded object-cover"
                      />
                    ) : (
                      relatedJob.companyInitial || relatedJob.company[0]
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-950 dark:text-slate-100">
                      {relatedJob.company}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400">
                      <MapPin className="h-3.5 w-3.5" />
                      {relatedJob.location}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

type OverviewItemProps = {
  icon: React.ReactElement;
  label: string;
  value: string;
};

const OverviewItem = ({ icon, label, value }: OverviewItemProps) => (
  <div>
    <div className="text-blue-700 dark:text-blue-400">
      {React.cloneElement(icon, { className: 'h-6 w-6' })}
    </div>
    <p className="mt-3 text-[10px] font-medium uppercase text-gray-400">
      {label}:
    </p>
    <p className="mt-1 text-xs font-semibold text-gray-950 dark:text-slate-100">
      {value}
    </p>
  </div>
);

type ShareButtonProps = {
  children: React.ReactNode;
  label: string;
};

const ShareButton = ({ children, label }: ShareButtonProps) => (
  <Button
    type="button"
    variant="secondary"
    size="icon"
    aria-label={label}
    className="h-8 w-8 rounded-sm bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40"
  >
    {children}
  </Button>
);

export default JobDetailPage;
