import type { ReactNode } from 'react';
import {
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  Clock3,
  Download,
  IndianRupee,
  MapPin,
  Share2,
  ShieldCheck,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatDate } from '../../data/profile';
import { initials, type CandidateProfile } from '../../data/myProfile';

type ProfileTopCardProps = {
  profile: CandidateProfile;
  mode: 'candidate' | 'recruiter';
  onShare?: () => void;
  onDownloadResume?: () => void;
  editAction?: ReactNode;
  recruiterActions?: ReactNode;
};

const VerifiedChip = ({
  label,
  verified,
}: {
  label: string;
  verified: boolean;
}) => {
  return (
    <span
      className={`inline-flex whitespace-nowrap items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
        verified
          ? 'border-emerald-100 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
          : 'border-amber-100 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
      }`}
    >
      <CheckCircle2 className="h-3.5 w-3.5" />
      {label} {verified ? 'verified' : 'pending'}
    </span>
  );
};

const StatItem = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Briefcase;
}) => {
  return (
    <div className="grid min-w-0 grid-cols-[40px_minmax(0,1fr)] items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 px-3 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
        <Icon className="h-[17px] w-[17px]" />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-bold text-slate-900 dark:text-slate-100">
          {value || '-'}
        </p>
      </div>
    </div>
  );
};

const ProfileImage = ({ profile }: { profile: CandidateProfile }) => {
  return (
    <div className="relative">
      <div
        className={`relative flex h-32 w-32 items-center justify-center rounded-xl border-[5px] border-white dark:border-slate-700 bg-white dark:bg-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.16)] md:h-[150px] md:w-[150px] lg:h-44 lg:w-44 ${
          profile.openToWork
            ? 'ring-2 ring-emerald-200 dark:ring-emerald-800'
            : ''
        }`}
      >
        <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 text-3xl font-extrabold text-blue-700 dark:text-blue-400">
          {profile.photoUrl ? (
            <img
              src={profile.photoUrl}
              alt={profile.fullName}
              className="h-full w-full object-cover"
            />
          ) : (
            initials(profile.fullName)
          )}
        </div>

        {/* Verified */}
        {profile.emailVerified && profile.phoneVerified && (
          <div
            title="Verified candidate"
            className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-white dark:border-slate-700 bg-blue-600 text-white shadow-md"
          >
            <BadgeCheck className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  );
};

const OpenToWork = ({ roles }: { roles: string[] }) => {
  return (
    <div className="mt-3 w-full max-w-44 overflow-hidden rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/70 md:max-w-[150px] lg:max-w-44">
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

            <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
              Open to work
            </p>
          </div>

          <p className="mt-0.5 truncate text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
            {roles[0] || 'New opportunities'}
          </p>
        </div>
      </div>
    </div>
  );
};

const ProfileTopCard = ({
  profile,
  mode,
  onShare,
  onDownloadResume,
  editAction,
  recruiterActions,
}: ProfileTopCardProps) => {
  const showCurrentPosition =
    Boolean(profile.currentPosition) &&
    profile.currentPosition.toLowerCase() !== profile.headline.toLowerCase();

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-[0_8px_32px_rgba(15,23,42,0.06)]">
      {/* Cover */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-blue-800 sm:h-[190px]">
        {profile.coverUrl && (
          <img
            src={profile.coverUrl}
            alt=""
            className="h-full w-full object-cover"
            onError={event => {
              event.currentTarget.style.display = 'none';
            }}
          />
        )}
      </div>

      {/* Profile body */}
      <div className="relative px-4 pb-5 sm:px-6">
        <div className="grid gap-4 md:grid-cols-[150px_minmax(0,1fr)_170px] lg:grid-cols-[176px_minmax(0,1fr)_190px] xl:grid-cols-[176px_minmax(0,1fr)_auto]">
          {/* Left candidate identity */}
          <div className="flex flex-col items-center md:items-start">
            <div className="relative z-10 -mt-16 md:-mt-[74px]">
              <ProfileImage profile={profile} />
            </div>

            {profile.openToWork && (
              <OpenToWork roles={profile.openToWorkRoles} />
            )}
          </div>

          {/* Main information */}
          <div className="min-w-0 pt-1 md:pt-5">
            <div className="min-w-0">
              {/* Name */}
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="break-words text-[26px] font-extrabold tracking-[-0.02em] text-slate-950 dark:text-slate-100 sm:text-[30px]">
                  {profile.fullName}
                </h1>

                {profile.emailVerified && profile.phoneVerified && (
                  <div
                    title="Verified profile"
                    className="flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/40 px-2 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Verified
                  </div>
                )}
              </div>

              {/* Headline */}
              <p className="mt-1.5 break-words text-[16px] font-semibold leading-6 text-slate-700 dark:text-slate-200 sm:text-[17px]">
                {profile.headline}
              </p>

              {/* Current position */}
              {showCurrentPosition && (
                <p className="mt-1 break-words text-sm font-medium text-slate-500 dark:text-slate-400">
                  {profile.currentPosition}
                </p>
              )}

              {/* Location + verification */}
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {profile.location}
                </span>

                <span className="mx-1 hidden h-4 w-px bg-slate-200 dark:bg-slate-700 lg:block" />

                <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">
                  <VerifiedChip
                    label="Email"
                    verified={profile.emailVerified}
                  />
                  <VerifiedChip
                    label="Phone"
                    verified={profile.phoneVerified}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid shrink-0 grid-cols-2 gap-3 md:flex md:flex-col md:pt-5 xl:flex-row">
            {mode === 'candidate' && onShare && (
              <Button
                type="button"
                onClick={onShare}
                className="h-11 min-w-0 rounded-lg bg-blue-600 px-3 font-semibold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 md:w-full xl:w-auto"
              >
                <Share2 className="mr-2 h-4 w-4 shrink-0" />
                <span className="truncate">Share profile</span>
              </Button>
            )}

            {mode === 'recruiter' && recruiterActions}

            {/* Resume button kept */}
            <Button
              type="button"
              variant="outline"
              onClick={onDownloadResume}
              className="h-11 min-w-0 rounded-lg border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 px-3 font-semibold text-blue-700 dark:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 md:w-full xl:w-auto"
            >
              <Download className="mr-2 h-4 w-4 shrink-0" />
              <span className="sm:hidden">Resume</span>
              <span className="hidden sm:inline">Download Resume</span>
            </Button>

            {mode === 'candidate' && editAction && (
              <div className="col-span-2 w-full [&>*]:h-11 [&>*]:w-full [&>*]:rounded-lg md:col-span-1">
                {editAction}
              </div>
            )}
          </div>
        </div>

        {/* Candidate quick details */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          <StatItem
            label="Experience"
            value={profile.experience}
            icon={Briefcase}
          />

          <StatItem
            label="Current CTC"
            value={profile.currentCtc}
            icon={IndianRupee}
          />

          <StatItem
            label="Expected CTC"
            value={profile.expectedCtc}
            icon={IndianRupee}
          />

          <StatItem
            label="Notice period"
            value={profile.noticePeriod}
            icon={Clock3}
          />

          <StatItem
            label="Profile updated"
            value={formatDate(profile.lastUpdated)}
            icon={CheckCircle2}
          />
        </div>
      </div>
    </section>
  );
};

export default ProfileTopCard;
