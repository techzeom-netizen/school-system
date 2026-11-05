import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Briefcase,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Globe,
  GraduationCap,
  Linkedin,
  Mail,
  MailCheck,
  MapPin,
  Phone,
  Share2,
  ShieldCheck,
  Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatSalary as formatProfileSalary } from '../../data/profile';
import { formatBytes, formatDate, formatMonth } from '../../data/resume';
import type {
  CandidateProfileData,
  ProfileViewer,
} from '../../data/candidateProfile';

type CandidateProfileProps = {
  profile: CandidateProfileData;
  viewer: ProfileViewer;
};

const profileImage =
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=220&q=80';
const coverImage =
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80';

const Card = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-t-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
    <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
      <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
        {title}
      </h2>
    </div>
    {children}
  </section>
);

const ShareProfileDialog = ({
  open,
  onOpenChange,
  profileUrl,
  candidateName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileUrl: string;
  candidateName: string;
}) => {
  const [copied, setCopied] = useState(false);
  const message = `View ${candidateName}'s profile: ${profileUrl}`;
  const subject = `${candidateName}'s candidate profile`;

  const shareLinks = [
    {
      label: 'WhatsApp',
      icon: Share2,
      href: `https://wa.me/?text=${encodeURIComponent(message)}`,
    },
    {
      label: 'Email',
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`,
    },
    {
      label: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`,
    },
  ];

  const copyLink = async () => {
    await navigator.clipboard.writeText(profileUrl);
    setCopied(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {shareLinks.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-700 dark:hover:text-blue-400"
            >
              <Icon className="h-4 w-4" />
              {label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => void copyLink()}
            className="flex w-full items-center gap-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-700 dark:hover:text-blue-400"
          >
            <Copy className="h-4 w-4" />
            {copied ? 'Profile link copied' : 'Copy profile link'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CandidateProfile = ({ profile, viewer }: CandidateProfileProps) => {
  const [shareOpen, setShareOpen] = useState(false);
  const isOwner = viewer === 'candidate';
  const details = profile.personal;
  const profileUrl = useMemo(
    () => `${window.location.origin}/jobseekers/my-profile`,
    []
  );

  return (
    <>
      <section className="overflow-hidden rounded-t-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 shadow-sm">
        <div className="relative h-52 bg-slate-200 dark:bg-slate-700">
          <img
            src={coverImage}
            alt="Candidate cover"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent" />
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/95 dark:bg-slate-900/95 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              Recruiter visible
            </span>
            <span className="rounded-full bg-white/95 dark:bg-slate-900/95 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400 shadow-sm">
              Open to {profile.preferences.workMode} roles
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="-mt-14 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <img
                src={profileImage}
                alt={details.fullName}
                className="h-32 w-32 rounded-full border-4 border-white dark:border-slate-700 object-cover shadow-md"
              />
              <div className="pb-1">
                <h1 className="text-3xl font-bold text-slate-950 dark:text-slate-100">
                  {details.fullName}
                </h1>
                <p className="mt-1 text-base font-semibold text-slate-700 dark:text-slate-200">
                  {details.currentRole} at {details.company}
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {details.currentLocation}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" />
                    {details.experienceYears}y {details.experienceMonths}m
                  </span>
                  <span>{formatProfileSalary(details.currentSalary)}</span>
                  <span>Notice: {profile.preferences.noticePeriod}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {isOwner && (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-none border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                  onClick={() => setShareOpen(true)}
                >
                  <Share2 className="h-4 w-4" />
                  Share profile
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                className="rounded-none border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
              >
                <Download className="h-4 w-4" />
                Download resume
              </Button>
              {isOwner ? (
                <Button
                  type="button"
                  asChild
                  className="rounded-none bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Link to="/jobseekers/profile">Edit profile</Link>
                </Button>
              ) : (
                <Button
                  type="button"
                  className="rounded-none bg-blue-600 text-white hover:bg-blue-700"
                >
                  Contact candidate
                </Button>
              )}
            </div>
          </div>

          <div className="mt-5 grid gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ['Profile match', '92%'],
              ['Response ready', '24h'],
              ['Projects', String(profile.projects.length)],
              [
                'Experience',
                `${details.experienceYears}y ${details.experienceMonths}m`,
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-lg bg-slate-50 dark:bg-slate-950 p-3"
              >
                <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                  {label}
                </p>
                <p className="mt-1 text-xl font-bold text-slate-950 dark:text-slate-100">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <main className="space-y-4">
          <Card title="About">
            <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
              <div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-slate-100">
                  {profile.summary.headline}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {profile.summary.summary} Experienced in turning complex HR
                  workflows into fast, readable and mobile-friendly product
                  screens that recruiters and candidates can use every day.
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/40 p-4">
                <p className="text-sm font-bold text-blue-900 dark:text-blue-300">
                  Best fit for
                </p>
                <p className="mt-2 text-sm leading-6 text-blue-900/80 dark:text-blue-300/80">
                  {profile.preferences.desiredRole}, frontend product teams,
                  candidate portals and recruiter dashboards.
                </p>
              </div>
            </div>
          </Card>

          <Card title="Experience">
            <div className="mt-4 space-y-3">
              {profile.employment.map(item => (
                <div
                  key={item.id}
                  className="rounded-lg bg-slate-50 dark:bg-slate-950 p-4"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:justify-between">
                    <div>
                      <h3 className="font-bold text-slate-950 dark:text-slate-100">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {item.subtitle}
                      </p>
                    </div>
                    <span className="rounded-full bg-white dark:bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {formatMonth(item.start)} - {formatMonth(item.end)}
                    </span>
                  </div>
                  {item.description && (
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card title="Projects">
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {profile.projects.map(project => (
                <div
                  key={project.title}
                  className="rounded-lg bg-slate-50 dark:bg-slate-950 p-4"
                >
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                    <Target className="h-4 w-4" />
                    <p className="text-xs font-semibold uppercase">
                      {project.role}
                    </p>
                  </div>
                  <h3 className="mt-2 font-bold text-slate-950 dark:text-slate-100">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {project.description}
                  </p>
                  <p className="mt-3 rounded-md bg-white dark:bg-slate-900 p-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                    {project.impact}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Education and certifications">
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {profile.education.map(item => (
                <div
                  key={item.id}
                  className="rounded-lg bg-slate-50 dark:bg-slate-950 p-4"
                >
                  <GraduationCap className="h-5 w-5 text-blue-700 dark:text-blue-400" />
                  <h3 className="mt-2 font-bold text-slate-950 dark:text-slate-100">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {item.subtitle}
                  </p>
                </div>
              ))}
              {profile.certifications.map(certification => (
                <div
                  key={certification.title}
                  className="rounded-lg bg-slate-50 dark:bg-slate-950 p-4"
                >
                  <Award className="h-5 w-5 text-blue-700 dark:text-blue-400" />
                  <h3 className="mt-2 font-bold text-slate-950 dark:text-slate-100">
                    {certification.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {certification.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </main>

        <aside className="space-y-4">
          <Card title="Career snapshot">
            <dl className="mt-4 space-y-3 text-sm">
              {[
                ['Current role', details.currentRole],
                ['Current company', details.company],
                ['Preferred role', profile.preferences.desiredRole],
                ['Preferred location', profile.preferences.locations],
                ['Employment type', profile.preferences.jobType],
                ['Work mode', profile.preferences.workMode],
                [
                  'Expected salary',
                  formatProfileSalary(profile.preferences.salary),
                ],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-slate-500 dark:text-slate-400">
                    {label}
                  </dt>
                  <dd className="text-right font-semibold text-slate-900 dark:text-slate-100">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card title="Skills">
            <div className="mt-4 space-y-4">
              {profile.skills.map(group => (
                <div key={group.title}>
                  <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                    {group.title}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {group.items.map(skill => (
                      <span
                        key={skill}
                        className="rounded-full border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 text-sm font-semibold text-blue-700 dark:text-blue-400"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Contact">
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-950 p-3 text-sm">
                <span className="inline-flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
                  <MailCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Email
                </span>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  Verified
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-950 p-3 text-sm">
                <span className="inline-flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
                  <Phone className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  Phone
                </span>
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                  Pending
                </span>
              </div>
              {profile.links.map(link => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-700 dark:hover:text-blue-400"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    {link.label}
                  </span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              ))}
            </div>
          </Card>

          <Card title="Resume">
            <div className="mt-4 rounded-lg bg-slate-50 dark:bg-slate-950 p-4">
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-5 w-5 text-blue-700 dark:text-blue-400" />
                <div className="min-w-0">
                  <p className="truncate font-bold text-slate-950 dark:text-slate-100">
                    {profile.resume.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {formatBytes(profile.resume.size)} | Updated{' '}
                    {formatDate(profile.resume.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </aside>
      </div>

      {isOwner && (
        <ShareProfileDialog
          open={shareOpen}
          onOpenChange={setShareOpen}
          profileUrl={profileUrl}
          candidateName={details.fullName}
        />
      )}
    </>
  );
};

export default CandidateProfile;
