import {
  Briefcase,
  Building2,
  CalendarClock,
  FileText,
  MessageCircle,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

export type JobSeekerNotification = {
  id: string;
  group: 'Today' | 'Earlier';
  companyInitial: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  icon: LucideIcon;
  iconTone: string;
  avatarTone: string;
  href?: string;
  primaryAction?: string;
  secondaryAction?: string;
};

export const jobSeekerNotifications: JobSeekerNotification[] = [
  {
    id: 'interview-invite',
    group: 'Today',
    companyInitial: 'NL',
    title: 'Nimbus Labs invited you to an interview',
    description: 'Frontend Engineer - Tomorrow, 11:00 AM - Video call',
    time: '12m',
    unread: true,
    icon: CalendarClock,
    iconTone: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40',
    avatarTone:
      'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 border-violet-100 dark:border-violet-900',
    href: '/jobseekers/applied-jobs/J-1024',
    primaryAction: 'Accept',
    secondaryAction: 'Reschedule',
  },
  {
    id: 'new-job-matches',
    group: 'Today',
    companyInitial: 'J',
    title: '6 new jobs match your profile',
    description:
      'Frontend Engineer at Payzen, Backend Engineer at FinPath and 4 more',
    time: '45m',
    unread: true,
    icon: Sparkles,
    iconTone:
      'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40',
    avatarTone:
      'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900',
    href: '/jobseekers/aarav-candidate',
    primaryAction: 'View jobs',
  },
  {
    id: 'application-viewed',
    group: 'Today',
    companyInitial: 'P',
    title: 'Payzen viewed your application',
    description: 'Frontend Engineer - Applied 3 days ago',
    time: '2h ago',
    unread: true,
    icon: FileText,
    iconTone:
      'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
    avatarTone:
      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900',
    href: '/jobseekers/applied-jobs/J-1026',
  },
  {
    id: 'recruiter-message',
    group: 'Today',
    companyInitial: 'F',
    title: 'Riya from FinPath sent you a message',
    description:
      '"Hi Aarav, we liked your profile. Are you free for a quick chat this week?"',
    time: '5h ago',
    unread: true,
    icon: MessageCircle,
    iconTone: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40',
    avatarTone:
      'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border-teal-100 dark:border-teal-900',
    href: '/jobseekers/applied-jobs/J-1028',
    primaryAction: 'Reply',
  },
  {
    id: 'learnloop-jobs',
    group: 'Earlier',
    companyInitial: 'L',
    title: 'LearnLoop posted 2 new jobs',
    description: 'UI/UX Designer, Frontend Engineer - You follow this company',
    time: '1d',
    unread: false,
    icon: Building2,
    iconTone:
      'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40',
    avatarTone:
      'bg-yellow-50 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400 border-yellow-100 dark:border-yellow-900',
    href: '/jobseekers/followed-companies',
  },
  {
    id: 'shortlisted',
    group: 'Earlier',
    companyInitial: 'C',
    title: 'Cartly shortlisted your application',
    description: 'Product Designer - Next step pending recruiter review',
    time: '2d',
    unread: false,
    icon: Briefcase,
    iconTone: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40',
    avatarTone:
      'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900',
    href: '/jobseekers/applied-jobs/J-1029',
  },
];
