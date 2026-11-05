import {
  Bookmark,
  Briefcase,
  CheckCircle2,
  IndianRupee,
  MapPin,
  Star,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Job } from '../data/jobs';

type JobCardProps = {
  job: Job;
  onApply?: (job: Job) => void;
};

const JobCard = ({ job, onApply }: JobCardProps) => {
  const visibleSkills = job.skills.slice(0, 4);
  const hiddenSkills = Math.max(job.skills.length - visibleSkills.length, 0);
  const workModeLabel =
    job.workMode === 'Remote' ? 'Remote' : `${job.location} (${job.workMode})`;

  return (
    <article className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-4 shadow-sm transition hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md">
      <div className="flex gap-4">
        <div
          className={cn(
            'flex h-14 w-14 shrink-0 items-center justify-center rounded-md text-2xl font-black shadow-sm',
            job.companyLogoClassName ||
              'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
          )}
        >
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={`${job.company} logo`}
              className="h-full w-full rounded-md object-cover"
            />
          ) : (
            job.companyInitial || job.company[0]
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300">
                <span>{job.company}</span>
                {job.verified && (
                  <CheckCircle2 className="h-4 w-4 fill-blue-600 text-white" />
                )}
              </div>
              <h3 className="mt-1 text-xl font-bold leading-tight text-slate-950 dark:text-slate-100">
                {job.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {job.featured && (
                <Badge className="border-yellow-700 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/40">
                  <Star className="mr-1 h-3.5 w-3.5 fill-yellow-700 text-yellow-600 dark:text-yellow-400" />
                  Featured
                </Badge>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Save ${job.title}`}
                className="h-9 w-9 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400"
              >
                <Bookmark className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Briefcase className="h-4 w-4 text-slate-400" />
              {job.experience}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-slate-400" />
              {workModeLabel}
            </span>
            <span className="flex items-center gap-1">
              <IndianRupee className="h-4 w-4 text-slate-400" />
              {job.salary}
            </span>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {job.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {visibleSkills.map(skill => (
              <Badge
                key={skill}
                variant="outline"
                className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
              >
                {skill}
              </Badge>
            ))}
            {hiddenSkills > 0 && (
              <Badge
                variant="outline"
                className="border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200"
              >
                +{hiddenSkills}
              </Badge>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Posted: 3 days ago</span>
            </div>

            <Button
              asChild={!onApply}
              onClick={onApply ? () => onApply(job) : undefined}
              className="h-10 min-w-[128px]"
            >
              {onApply ? (
                job.featured ? (
                  'Quick Apply'
                ) : (
                  'Apply'
                )
              ) : (
                <Link to={`/jobseekers/jobs/${job.id}`}>
                  {job.featured ? 'Quick Apply' : 'Apply'}
                </Link>
              )}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default JobCard;
