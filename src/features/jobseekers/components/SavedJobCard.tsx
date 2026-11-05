import {
  Bookmark,
  Briefcase,
  CheckCircle2,
  IndianRupee,
  MapPin,
  MoreHorizontal,
  Star,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Job } from '../data/jobs';

type SavedJobCardProps = {
  job: Job;
  onUnsave: (jobId: string) => void;
};

const SavedJobCard = ({ job, onUnsave }: SavedJobCardProps) => {
  const visibleSkills = job.skills.slice(0, 4);
  const hiddenSkills = Math.max(job.skills.length - visibleSkills.length, 0);
  const workModeLabel =
    job.workMode === 'Remote' ? 'Remote' : `${job.location} (${job.workMode})`;

  return (
    <article className="flex min-h-[360px] flex-col rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm transition hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
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

          <div className="min-w-0">
            <Link
              to={`/jobseekers/jobs/${job.id}`}
              className="line-clamp-2 text-lg font-bold leading-tight text-slate-950 dark:text-slate-100 transition hover:text-blue-700 dark:hover:text-blue-400"
            >
              {job.title}
            </Link>
            <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <span className="truncate">{job.company}</span>
              {job.verified && (
                <CheckCircle2 className="h-4 w-4 shrink-0 fill-blue-600 text-white" />
              )}
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Open actions for ${job.title}`}
          className="h-8 w-8 shrink-0 text-slate-500 dark:text-slate-400"
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40">
          {job.type}
        </Badge>
        <Badge
          variant="outline"
          className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
        >
          {job.workMode}
        </Badge>
        {job.featured && (
          <Badge className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40">
            <Star className="mr-1 h-3.5 w-3.5 fill-amber-500 text-amber-500 dark:text-amber-400" />
            Featured
          </Badge>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
        <span className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-slate-400" />
          {workModeLabel}
        </span>
        <span className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-slate-400" />
          {job.experience}
        </span>
        <span className="flex items-center gap-2">
          <IndianRupee className="h-4 w-4 text-slate-400" />
          {job.salary}
        </span>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {job.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {visibleSkills.map(skill => (
          <Badge
            key={skill}
            variant="outline"
            className="border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200"
          >
            {skill}
          </Badge>
        ))}
        {hiddenSkills > 0 && (
          <Badge
            variant="outline"
            className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
          >
            +{hiddenSkills}
          </Badge>
        )}
      </div>

      <div className="mt-auto pt-5">
        <div className="flex items-center justify-between gap-3">
          <p className="shrink-0 text-xs font-medium text-slate-500 dark:text-slate-400">
            Posted: {job.posted}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button asChild className="h-10 flex-1">
            <Link to={`/jobseekers/jobs/${job.id}`}>Apply</Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
            onClick={() => onUnsave(job.id)}
          >
            <Bookmark className="h-4 w-4 fill-blue-700" />
            Saved
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Unsave ${job.title}`}
            className="h-10 w-10 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"
            onClick={() => onUnsave(job.id)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </article>
  );
};

export default SavedJobCard;
