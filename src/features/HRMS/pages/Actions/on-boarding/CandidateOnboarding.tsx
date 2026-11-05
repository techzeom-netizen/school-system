'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  CalendarDays,
  Circle,
  ClipboardCheck,
  Clock3,
  Mail,
  Search,
  Smartphone,
  AlertCircle,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { Button } from '@/components/ui/button';
import {
  findOnboardingCandidate,
  saveOnboardingCandidate,
  type OnboardingCandidate,
  type VerificationStatus,
} from './onboardingCandidateStore';

const VERIFICATION_ITEMS = [
  { key: 'identity', label: 'Identity verification' },
  { key: 'employment', label: 'Previous employment' },
  { key: 'education', label: 'Education verification' },
  { key: 'address', label: 'Address verification' },
] as const;

const STATUS_OPTIONS: VerificationStatus[] = [
  'Not Started',
  'In Progress',
  'Verified',
  'Needs Review',
];

const STATUS_STYLE: Record<
  VerificationStatus,
  { icon: LucideIcon; idle: string; active: string; dot: string }
> = {
  'Not Started': {
    icon: Circle,
    idle: 'hover:bg-muted',
    active: 'border-border bg-muted text-foreground',
    dot: 'bg-muted-foreground',
  },
  'In Progress': {
    icon: Clock3,
    idle: 'hover:bg-secondary/40',
    active: 'border-primary/40 bg-secondary/20 text-secondary-foreground',
    dot: 'bg-primary',
  },
  Verified: {
    icon: BadgeCheck,
    idle: 'hover:bg-primary/10',
    active: 'border-primary/40 bg-primary/10 text-primary',
    dot: 'bg-primary',
  },
  'Needs Review': {
    icon: AlertCircle,
    idle: 'hover:bg-destructive/10',
    active: 'border-destructive/30 bg-destructive/10 text-destructive',
    dot: 'bg-destructive',
  },
};

const isIdentifierType = (value: string): value is 'candidateId' | 'mobile' =>
  value === 'candidateId' || value === 'mobile';

const defaultJoiningDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

type VerificationKey = (typeof VERIFICATION_ITEMS)[number]['key'];
type CandidateDraft = {
  name: string;
  email: string;
  mobile: string;
  role: string;
  department: string;
  joiningDate: string;
  education: string;
  experience: string;
  skills: string;
  verification: Record<VerificationKey, VerificationStatus>;
};

const emptyDraft: CandidateDraft = {
  name: '',
  email: '',
  mobile: '',
  role: '',
  department: '',
  joiningDate: defaultJoiningDate(),
  education: '',
  experience: '',
  skills: '',
  verification: {
    identity: 'Not Started',
    employment: 'Not Started',
    education: 'Not Started',
    address: 'Not Started',
  },
};

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('');

const daysUntil = (isoDate: string) => {
  if (!isoDate) return null;
  const target = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
};

const formatDate = (isoDate: string) => {
  const date = new Date(`${isoDate}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
};

/** Circular readiness gauge */
function ReadinessRing({ value }: { value: number }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          strokeWidth="7"
          className="stroke-white/15"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value / 100)}
          className="stroke-amber-300 transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-semibold leading-none text-primary-foreground">
          {value}%
        </span>
        <span className="mt-1 text-[11px] text-primary-foreground/70">
          ready
        </span>
      </div>
    </div>
  );
}

/** Live summary that reads like a boarding pass for the new joiner */
function JoinerPass({
  draft,
  candidateId,
  active,
  readiness,
}: {
  draft: CandidateDraft;
  candidateId: string;
  active: boolean;
  readiness: number;
}) {
  const remaining = daysUntil(draft.joiningDate);
  const initials = initialsOf(draft.name);
  const verifiedCount = VERIFICATION_ITEMS.filter(
    item => draft.verification[item.key] === 'Verified'
  ).length;

  return (
    <aside
      aria-label="Candidate summary"
      className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_20px_50px_-24px_hsl(var(--primary)/0.35)]"
    >
      <div className="relative bg-primary p-6 text-primary-foreground">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-lg font-bold text-secondary-foreground">
            {initials || <UserRound className="h-6 w-6" />}
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold leading-tight">
              {draft.name.trim() || 'New joiner'}
            </p>
            <p className="mt-0.5 truncate text-sm text-primary-foreground/80">
              {draft.role.trim() || 'Job title pending'}
            </p>
            <p className="truncate text-xs text-primary-foreground/60">
              {draft.department.trim() || 'Department pending'}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-5">
          <ReadinessRing value={readiness} />
          <div className="text-sm leading-relaxed text-primary-foreground/85">
            {active
              ? readiness === 100
                ? 'Profile and checks are complete.'
                : 'Complete the profile and clear all four checks to reach 100%.'
              : 'Look up a candidate to begin.'}
          </div>
        </div>
      </div>

      {/* tear line */}
      <div className="relative h-0 border-t-2 border-dashed border-border/80">
        <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-muted" />
        <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-muted" />
      </div>

      <div className="space-y-5 p-6">
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Joining date</dt>
            <dd className="mt-1 flex items-center gap-1.5 font-medium text-foreground">
              <CalendarDays className="h-4 w-4 text-primary" />
              {active ? formatDate(draft.joiningDate) : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Starts in</dt>
            <dd className="mt-1 font-medium text-foreground">
              {active && remaining !== null
                ? remaining > 0
                  ? `${remaining} day${remaining === 1 ? '' : 's'}`
                  : remaining === 0
                    ? 'Today'
                    : 'Date passed'
                : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Candidate ID</dt>
            <dd className="mt-1 truncate font-medium text-foreground">
              {candidateId || '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Checks cleared</dt>
            <dd className="mt-1 font-medium text-foreground">
              {verifiedCount} of {VERIFICATION_ITEMS.length}
            </dd>
          </div>
        </dl>

        <ul className="space-y-2.5 border-t border-border pt-4">
          {VERIFICATION_ITEMS.map(item => {
            const status = draft.verification[item.key];
            return (
              <li
                key={item.key}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span
                    className={`h-2 w-2 rounded-full ${STATUS_STYLE[status].dot}`}
                  />
                  {item.label}
                </span>
                <span className="text-xs text-muted-foreground">{status}</span>
              </li>
            );
          })}
        </ul>

        {(draft.email || draft.mobile) && (
          <div className="space-y-1.5 border-t border-border pt-4 text-sm text-muted-foreground">
            {draft.email && (
              <p className="flex items-center gap-2 truncate">
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground/80" />
                <span className="truncate">{draft.email}</span>
              </p>
            )}
            {draft.mobile && (
              <p className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 shrink-0 text-muted-foreground/80" />
                {draft.mobile}
              </p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

/** One verification row: label + four tappable status chips */
function VerificationRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: VerificationStatus;
  onChange: (status: VerificationStatus) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map(status => {
          const style = STATUS_STYLE[status];
          const Icon = style.icon;
          const selected = value === status;
          return (
            <button
              key={status}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(status)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                selected
                  ? style.active
                  : `border-border text-muted-foreground ${style.idle}`
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {status}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function CandidateOnboardingPage() {
  const navigate = useNavigate();
  const [identifierType, setIdentifierType] = useState<
    'candidateId' | 'mobile'
  >('candidateId');
  const [identifier, setIdentifier] = useState('');
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [candidateId, setCandidateId] = useState('');
  const [draft, setDraft] = useState<CandidateDraft>(emptyDraft);

  const readiness = useMemo(() => {
    const profileFields = [
      draft.name,
      draft.role,
      draft.department,
      draft.email,
      draft.mobile,
      draft.education,
      draft.experience,
      draft.skills,
    ];
    const profileDone = profileFields.filter(v => v.trim()).length;
    const verified = VERIFICATION_ITEMS.filter(
      item => draft.verification[item.key] === 'Verified'
    ).length;
    return Math.round(
      (profileDone / profileFields.length) * 50 +
        (verified / VERIFICATION_ITEMS.length) * 50
    );
  }, [draft]);

  const startOnboarding = () => {
    const value = identifier.trim();
    if (!value) {
      toast.error('Enter a candidate ID or mobile number to continue');
      return;
    }

    const saved = findOnboardingCandidate(identifierType, value);
    setCandidateId(
      saved?.candidateId ?? (identifierType === 'candidateId' ? value : '')
    );
    setDraft(
      saved
        ? {
            name: saved.name,
            email: saved.email,
            mobile: saved.mobile,
            role: saved.role,
            department: saved.department,
            joiningDate: saved.joiningDate,
            education: saved.education,
            experience: saved.experience,
            skills: saved.skills.join(', '),
            verification: {
              ...emptyDraft.verification,
              ...saved.verification,
            },
          }
        : {
            ...emptyDraft,
            mobile: identifierType === 'mobile' ? value : '',
          }
    );
    setDetailsVisible(true);
    if (saved) toast.info('Existing onboarding details loaded');
    else {
      toast.info(
        'No saved record found in this session. Enter the candidate details to create one.'
      );
    }
  };

  const saveCandidate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.name.trim() || !draft.role.trim()) {
      toast.error('Candidate name and job title are required');
      return;
    }

    const candidate: OnboardingCandidate = {
      id: `candidate-${Date.now()}`,
      candidateId: candidateId.trim(),
      mobile: draft.mobile.trim(),
      name: draft.name.trim(),
      email: draft.email.trim(),
      role: draft.role.trim(),
      department: draft.department.trim() || 'General',
      joiningDate: draft.joiningDate,
      education: draft.education.trim(),
      experience: draft.experience.trim(),
      skills: draft.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(Boolean),
      verification: draft.verification,
    };

    saveOnboardingCandidate(candidate);
    toast.success('Candidate onboarding details saved for this session');
    navigate('/dashboard/employer/actions/onboarding-hub');
  };

  const update = <K extends keyof CandidateDraft>(
    key: K,
    value: CandidateDraft[K]
  ) => setDraft(current => ({ ...current, [key]: value }));

  return (
    <div className="min-h-full bg-muted p-4 sm:p-6 lg:p-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        {/* Header */}
        <header>
          <Button
            type="button"
            variant="ghost"
            className="-ml-3 mb-3 text-muted-foreground"
            onClick={() =>
              navigate('/dashboard/employer/actions/onboarding-hub')
            }
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Onboarding Hub
          </Button>
          <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Bring your new hire on board
          </h1>
          <p className="mt-2 max-w-xl text-base leading-relaxed text-muted-foreground">
            Find the candidate, confirm their details and clear the background
            checks. Everything you enter appears on their summary as you go.
          </p>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-4 lg:gap-8">
          {/* Summary rail */}
          <div className="lg:sticky lg:top-6 lg:col-span-1">
            <JoinerPass
              draft={draft}
              candidateId={candidateId}
              active={detailsVisible}
              readiness={readiness}
            />
          </div>

          <div className="flex min-w-0 flex-col gap-6 lg:col-span-3">
            {/* Lookup */}
            <section className="rounded-3xl border border-teal-950/10 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center gap-2 text-foreground">
                <Search className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Find a candidate</h2>
              </div>

              <form
                onSubmit={event => {
                  event.preventDefault();
                  startOnboarding();
                }}
                className="flex flex-col gap-4"
              >
                <div
                  role="tablist"
                  aria-label="Search using"
                  className="inline-flex w-fit rounded-full bg-muted p-1"
                >
                  {(
                    [
                      ['candidateId', 'Candidate ID'],
                      ['mobile', 'Mobile number'],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      role="tab"
                      aria-selected={identifierType === value}
                      onClick={() => {
                        if (isIdentifierType(value)) setIdentifierType(value);
                      }}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        identifierType === value
                          ? 'bg-primary text-primary-foreground shadow'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <FormField
                      label={
                        identifierType === 'candidateId'
                          ? 'Candidate ID'
                          : 'Mobile number'
                      }
                      name="candidateIdentifier"
                      type={identifierType === 'mobile' ? 'tel' : 'text'}
                      value={identifier}
                      onChange={value => setIdentifier(value)}
                      placeholder={
                        identifierType === 'candidateId'
                          ? 'Enter candidate ID'
                          : 'Enter mobile number'
                      }
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="h-10 bg-primary px-6 text-primary-foreground hover:bg-primary/90"
                  >
                    <Search className="h-4 w-4" />
                    {detailsVisible ? 'Load candidate' : 'Continue'}
                  </Button>
                </div>
              </form>

              <p className="mt-3 text-xs text-muted-foreground">
                If the identifier matches a saved record, its details load
                automatically.
              </p>
            </section>

            {/* Empty state */}
            {!detailsVisible && (
              <div className="rounded-3xl border border-dashed border-border p-8 text-center">
                <p className="font-medium text-foreground">
                  No candidate selected
                </p>
                <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                  Enter a candidate ID or mobile number above to open their
                  profile and start the checks.
                </p>
              </div>
            )}

            {detailsVisible && (
              <form onSubmit={saveCandidate} className="space-y-6">
                <Section title="Candidate information" icon={UserRound}>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <FormField
                      label="Full name"
                      name="candidateName"
                      value={draft.name}
                      onChange={value => update('name', value)}
                      placeholder="Enter candidate's full name"
                      required
                    />
                    <FormField
                      label="Email address"
                      name="candidateEmail"
                      type="email"
                      value={draft.email}
                      onChange={value => update('email', value)}
                      placeholder="name@example.com"
                    />
                    <FormField
                      label="Mobile number"
                      name="candidateMobile"
                      type="tel"
                      value={draft.mobile}
                      onChange={value => update('mobile', value)}
                      placeholder="Enter mobile number"
                    />
                    <FormField
                      label="Job title"
                      name="candidateRole"
                      value={draft.role}
                      onChange={value => update('role', value)}
                      placeholder="Enter job title"
                      required
                    />
                    <FormField
                      label="Department"
                      name="candidateDepartment"
                      value={draft.department}
                      onChange={value => update('department', value)}
                      placeholder="Enter department"
                    />
                    <FormField
                      label="Expected joining date"
                      name="candidateJoiningDate"
                      type="date"
                      value={draft.joiningDate}
                      required
                      onChange={value => update('joiningDate', value)}
                    />
                  </div>
                </Section>

                <Section title="Skills and experience" icon={Briefcase}>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <FormField
                      label="Skills"
                      name="candidateSkills"
                      type="textarea"
                      colSpan={2}
                      value={draft.skills}
                      onChange={value => update('skills', value)}
                      placeholder="Separate skills with commas"
                      hint="For example: React, TypeScript, stakeholder management"
                      rows={3}
                    />
                    <div className="grid content-start gap-4">
                      <FormField
                        label="Highest qualification"
                        name="candidateEducation"
                        value={draft.education}
                        onChange={value => update('education', value)}
                        placeholder="Enter qualification"
                      />
                      <FormField
                        label="Total experience"
                        name="candidateExperience"
                        value={draft.experience}
                        onChange={value => update('experience', value)}
                        placeholder="For example: 5 years"
                      />
                    </div>
                  </div>
                </Section>

                <Section title="Background verification" icon={ClipboardCheck}>
                  <div className="space-y-3">
                    {VERIFICATION_ITEMS.map(item => (
                      <VerificationRow
                        key={item.key}
                        label={item.label}
                        value={draft.verification[item.key]}
                        onChange={status =>
                          setDraft(current => ({
                            ...current,
                            verification: {
                              ...current.verification,
                              [item.key]: status,
                            },
                          }))
                        }
                      />
                    ))}
                  </div>
                </Section>

                <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/90 p-3 pl-5 shadow-lg backdrop-blur">
                  <p className="hidden text-sm text-muted-foreground sm:block">
                    Profile {readiness}% ready
                  </p>
                  <div className="ml-auto flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        navigate('/dashboard/employer/actions/onboarding-hub')
                      }
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Save candidate
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
