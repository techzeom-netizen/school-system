import { jobs, type Job } from './jobs';

export type AppliedStatus =
  | 'Applied'
  | 'Viewed'
  | 'Shortlisted'
  | 'Interview'
  | 'Offer'
  | 'Not selected';

export type AppliedJob = {
  job: Job;
  appliedOn: string;
  status: AppliedStatus;
  resume: string;
  nextStep: string;
  recruiterNote: string;
  timeline: Array<{
    label: string;
    date: string;
    done: boolean;
  }>;
};

export const statusTabs: Array<AppliedStatus | 'All'> = [
  'All',
  'Applied',
  'Viewed',
  'Shortlisted',
  'Interview',
  'Offer',
  'Not selected',
];

export const appliedJobs: AppliedJob[] = [
  {
    job: jobs[0],
    appliedOn: '2026-10-04',
    status: 'Interview',
    resume: 'Frontend Engineer resume.pdf',
    nextStep: 'Technical interview scheduled for 9 Oct, 11:00 AM',
    recruiterNote: 'Recruiter viewed your profile and shortlisted your resume.',
    timeline: [
      { label: 'Applied', date: '4 Oct', done: true },
      { label: 'Viewed', date: '5 Oct', done: true },
      { label: 'Shortlisted', date: '6 Oct', done: true },
      { label: 'Interview', date: '9 Oct', done: false },
    ],
  },
  {
    job: jobs[2],
    appliedOn: '2026-10-02',
    status: 'Viewed',
    resume: 'Recruiter profile resume.pdf',
    nextStep: 'Waiting for recruiter response',
    recruiterNote: 'Application was opened by ScalePath hiring team.',
    timeline: [
      { label: 'Applied', date: '2 Oct', done: true },
      { label: 'Viewed', date: '3 Oct', done: true },
      { label: 'Shortlist', date: '-', done: false },
      { label: 'Decision', date: '-', done: false },
    ],
  },
  {
    job: jobs[4],
    appliedOn: '2026-09-29',
    status: 'Shortlisted',
    resume: 'Product UI resume.pdf',
    nextStep: 'Portfolio review in progress',
    recruiterNote: 'Your design systems experience matched this role.',
    timeline: [
      { label: 'Applied', date: '29 Sep', done: true },
      { label: 'Viewed', date: '30 Sep', done: true },
      { label: 'Shortlisted', date: '1 Oct', done: true },
      { label: 'Review', date: 'Now', done: false },
    ],
  },
  {
    job: jobs[5],
    appliedOn: '2026-09-24',
    status: 'Offer',
    resume: 'Operations resume.pdf',
    nextStep: 'Offer discussion pending',
    recruiterNote: 'Hiring manager wants to discuss compensation.',
    timeline: [
      { label: 'Applied', date: '24 Sep', done: true },
      { label: 'Interview', date: '28 Sep', done: true },
      { label: 'Selected', date: '30 Sep', done: true },
      { label: 'Offer', date: 'Pending', done: false },
    ],
  },
  {
    job: jobs[3],
    appliedOn: '2026-09-19',
    status: 'Not selected',
    resume: 'Backend resume.pdf',
    nextStep: 'Application closed',
    recruiterNote:
      'The company moved ahead with candidates closer to the role.',
    timeline: [
      { label: 'Applied', date: '19 Sep', done: true },
      { label: 'Viewed', date: '20 Sep', done: true },
      { label: 'Decision', date: '26 Sep', done: true },
    ],
  },
];

export const statusTone: Record<AppliedStatus, string> = {
  Applied: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200',
  Viewed: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400',
  Shortlisted:
    'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
  Interview:
    'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400',
  Offer: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400',
  'Not selected': 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400',
};

export const findAppliedJobByJobId = (jobId: string | undefined) =>
  appliedJobs.find(application => application.job.id === jobId);
