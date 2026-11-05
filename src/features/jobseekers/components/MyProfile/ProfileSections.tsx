import { useState } from 'react';
import {
  Award,
  Briefcase,
  Download,
  Eye,
  FileText,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  Sparkles,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type {
  Accomplishment,
  CandidateProfile,
  TimelineEntry,
} from '../../data/myProfile';
import { ExpandableText, ProfileCard, ShowAllButton } from './ProfileCard';
import ResumePreviewDialog from './ResumePreviewDialog';

const TagList = ({ tags }: { tags: string[] }) =>
  tags.length > 0 ? (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {tags.map(tag => (
        <span
          key={tag}
          className="rounded-full border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-400"
        >
          {tag}
        </span>
      ))}
    </div>
  ) : null;

const TimelineList = ({
  items,
  icon: Icon,
}: {
  items: TimelineEntry[];
  icon: LucideIcon;
}) => (
  <ol className="space-y-0">
    {items.map((item, index) => (
      <li key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
        {index < items.length - 1 && (
          <span
            aria-hidden="true"
            className="absolute left-5 top-11 h-[calc(100%-2.75rem)] w-px bg-slate-200 dark:bg-slate-700"
          />
        )}
        <span className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-slate-950 dark:text-slate-100">
              {item.title}
            </h3>
            {item.current && (
              <span className="rounded bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                Current
              </span>
            )}
          </div>
          {item.subtitle && (
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {item.subtitle}
            </p>
          )}
          {[item.period, item.duration, item.location].filter(Boolean).length >
            0 && (
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {[item.period, item.duration, item.location]
                .filter(Boolean)
                .join(' | ')}
            </p>
          )}
          {item.description && (
            <div className="mt-2">
              <ExpandableText text={item.description} maxLength={220} />
            </div>
          )}
          {item.bullets.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600 dark:text-slate-300 marker:text-blue-400">
              {item.bullets.map(bullet => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}
          <TagList tags={item.tags} />
        </div>
      </li>
    ))}
  </ol>
);

const LimitedTimeline = ({
  items,
  icon,
}: {
  items: TimelineEntry[];
  icon: LucideIcon;
}) => {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? items : items.slice(0, 3);

  if (items.length === 0) return null;

  return (
    <>
      <TimelineList items={visibleItems} icon={icon} />
      {items.length > 3 && (
        <ShowAllButton
          expanded={expanded}
          total={items.length}
          onClick={() => setExpanded(current => !current)}
        />
      )}
    </>
  );
};

const ProjectCards = ({ projects }: { projects: TimelineEntry[] }) => {
  if (projects.length === 0) return null;

  return (
    <ProfileCard icon={FolderKanban} title="Projects">
      <div className="grid gap-3 md:grid-cols-2">
        {projects.map(project => (
          <article
            key={project.id}
            className="flex flex-col rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 dark:border-white/10 p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-bold text-slate-950 dark:text-slate-100">
                  {project.title}
                </h3>
                {project.subtitle && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {project.subtitle}
                  </p>
                )}
              </div>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${project.title}`}
                  className="shrink-0 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
            {project.description && (
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {project.description}
              </p>
            )}
            <TagList tags={project.tags} />
          </article>
        ))}
      </div>
    </ProfileCard>
  );
};

const Accomplishments = ({ items }: { items: Accomplishment[] }) => {
  if (items.length === 0) return null;

  return (
    <ProfileCard icon={Award} title="Accomplishments">
      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {items.map(item => (
          <li
            key={item.id}
            className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Award className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-950 dark:text-slate-100">
                {item.title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {[item.kind, item.issuer, item.year]
                  .filter(Boolean)
                  .join(' | ')}
              </p>
            </div>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${item.title}`}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </li>
        ))}
      </ul>
    </ProfileCard>
  );
};

const SkillsCard = ({ skills }: { skills: string[] }) =>
  skills.length > 0 ? (
    <ProfileCard icon={Sparkles} title="Key skills">
      <div className="flex flex-wrap gap-2">
        {skills.map(skill => (
          <span
            key={skill}
            className="rounded-full border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 text-sm font-semibold text-blue-700 dark:text-blue-400"
          >
            {skill}
          </span>
        ))}
      </div>
    </ProfileCard>
  ) : null;

const ResumeCard = ({
  profile,
  onDownloadResume,
}: {
  profile: CandidateProfile;
  onDownloadResume?: () => void;
}) => {
  const [resumePreviewOpen, setResumePreviewOpen] = useState(false);

  if (!profile.resume) return null;

  return (
    <ProfileCard icon={FileText} title="Resume">
      <div className="flex flex-col gap-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 ring-1 ring-slate-200 dark:ring-slate-700">
            <FileText className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-950 dark:text-slate-100">
              {profile.resume.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {profile.resume.meta}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
            onClick={() => setResumePreviewOpen(true)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
            onClick={onDownloadResume}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
      <ResumePreviewDialog
        open={resumePreviewOpen}
        onOpenChange={setResumePreviewOpen}
        profile={profile}
      />
    </ProfileCard>
  );
};

const ProfileSections = ({
  profile,
  onDownloadResume,
}: {
  profile: CandidateProfile;
  onDownloadResume?: () => void;
}) => (
  <main className="min-w-0 space-y-4">
    {profile.summary && (
      <ProfileCard icon={UserRound} title="About">
        <ExpandableText text={profile.summary} maxLength={420} />
      </ProfileCard>
    )}
    <SkillsCard skills={profile.skills} />
    <ResumeCard profile={profile} onDownloadResume={onDownloadResume} />
    {profile.experienceList.length > 0 && (
      <ProfileCard icon={Briefcase} title="Experience">
        <LimitedTimeline items={profile.experienceList} icon={Briefcase} />
      </ProfileCard>
    )}
    <ProjectCards projects={profile.projects} />
    {profile.education.length > 0 && (
      <ProfileCard icon={GraduationCap} title="Education">
        <LimitedTimeline items={profile.education} icon={GraduationCap} />
      </ProfileCard>
    )}
    <Accomplishments items={profile.accomplishments} />
  </main>
);

export default ProfileSections;
