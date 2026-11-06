import type { LogoTone } from '@/features/jobseekers/data/companies';
import {
  Building2,
  Briefcase,
  Users,
  MapPin,
  IndianRupee,
  Heart,
  Code2,
  Palette,
  Database,
  Megaphone,
  Settings,
  Landmark,
  ShoppingBag,
  HeartPulse,
  BadgeCheck,
  LockKeyhole,
  ShieldCheck,
  FileText,
  Bell,
  UserPlus,
  Send,
  ClipboardList,
  type LucideIcon,
} from 'lucide-react';

export type LandingStat = {
  value: string;
  label: string;
  delta: string;
  growth: boolean;
  icon: LucideIcon;
  accent: string;
  tint: string;
};
// TODO: replace with API data.
// prettier-ignore
export const stats: LandingStat[] = [
  { value: '12,400+', label: 'Verified companies', delta: '340 added this week', growth: true, icon: Building2, accent: '#8f2438', tint: '#eff6ff' },
  { value: '86,000+', label: 'Open jobs today', delta: '2,100 new today', growth: true, icon: Briefcase, accent: '#059669', tint: '#ecfdf5' },
  { value: '1.2M', label: 'Job seekers', delta: '18K this month', growth: true, icon: Users, accent: '#7c3aed', tint: '#f5f3ff' },
  { value: '48 hrs', label: 'Typical employer reply', delta: 'Across all employers', growth: false, icon: Bell, accent: '#d97706', tint: '#fffbeb' },
];
export type LandingFilter = {
  query?: string;
  location?: string;
  workMode?: string;
  experience?: string;
  jobType?: string;
  minSalary?: number;
  company?: string;
};

// TODO: replace with API data.
// prettier-ignore
export const popularSearches: { label: string; count: string; filter: LandingFilter }[] = [
  { label: 'React', count: '1.2K', filter: { query: 'React' } },
  { label: 'HR', count: '980', filter: { query: 'HR' } },
  { label: 'Data analyst', count: '870', filter: { query: 'Data analyst' } },
  { label: 'UI designer', count: '640', filter: { query: 'UI designer' } },
  { label: 'Bengaluru', count: '9.4K', filter: { location: 'Bengaluru' } },
  { label: 'Remote jobs', count: '1.2K', filter: { workMode: 'Remote' } },
];
export const quickTileAccents = {
  blue: '[--tile-accent:#8f2438] [--tile-border:#bfdbfe] [--tile-tint:#eff6ff]',
  violet:
    '[--tile-accent:#7c3aed] [--tile-border:#ddd6fe] [--tile-tint:#f5f3ff]',
  emerald:
    '[--tile-accent:#059669] [--tile-border:#a7f3d0] [--tile-tint:#ecfdf5]',
  amber:
    '[--tile-accent:#d97706] [--tile-border:#fde68a] [--tile-tint:#fffbeb]',
  sky: '[--tile-accent:#0284c7] [--tile-border:#bae6fd] [--tile-tint:#f0f9ff]',
} as const;
export type QuickJobTile = {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: keyof typeof quickTileAccents;
  count: string;
  filter: LandingFilter;
};
export const quickTiles: QuickJobTile[] = [
  {
    title: 'Work from home',
    description: 'Remote-first roles',
    icon: MapPin,
    accent: 'blue',
    count: '1.2K jobs',
    filter: { workMode: 'Remote' },
  },
  {
    title: 'Fresher jobs',
    description: '0-2 years',
    icon: Users,
    accent: 'violet',
    count: '1.1K jobs',
    filter: { experience: '0-2 years' },
  },
  {
    title: 'Internships',
    description: 'Learn on the job',
    icon: FileText,
    accent: 'emerald',
    count: '880 jobs',
    filter: { jobType: 'Internship' },
  },
  {
    title: 'High paying',
    description: '15 LPA and above',
    icon: IndianRupee,
    accent: 'amber',
    count: '940 jobs',
    filter: { minSalary: 15 },
  },
  {
    title: 'Hybrid jobs',
    description: 'Office plus home',
    icon: Building2,
    accent: 'sky',
    count: '2.4K jobs',
    filter: { workMode: 'Hybrid' },
  },
];

export type FieldCategory = {
  name: string;
  icon: LucideIcon;
  count: string;
  accent: string;
  tint: string;
  roles: string[];
  pattern: RegExp;
};
// TODO: replace with API data.
// prettier-ignore
export const categories: FieldCategory[] = [
  { name: 'Engineering', count: '24,800', icon: Code2, accent: '#8f2438', tint: '#eff6ff', roles: ['Frontend', 'Backend', 'DevOps'], pattern: /engineer|developer/i },
  { name: 'Design', count: '6,200', icon: Palette, accent: '#7c3aed', tint: '#f5f3ff', roles: ['Product', 'UI/UX', 'Graphic'], pattern: /design/i },
  { name: 'Data', count: '8,400', icon: Database, accent: '#0891b2', tint: '#ecfeff', roles: ['Analyst', 'Data science', 'BI'], pattern: /data|analyst|analytics/i },
  { name: 'Marketing', count: '7,100', icon: Megaphone, accent: '#db2777', tint: '#fdf2f8', roles: ['SEO', 'Content', 'Performance'], pattern: /marketing|growth|seo/i },
  { name: 'Operations', count: '9,600', icon: Settings, accent: '#475569', tint: '#f1f5f9', roles: ['HR', 'Supply chain', 'Admin'], pattern: /operations|coordinator|recruit|acquisition/i },
  { name: 'Finance', count: '5,300', icon: Landmark, accent: '#d97706', tint: '#fffbeb', roles: ['Accounts', 'Audit', 'FP&A'], pattern: /finance|account|risk/i },
  { name: 'Sales', count: '11,200', icon: ShoppingBag, accent: '#059669', tint: '#ecfdf5', roles: ['Inside sales', 'Field sales', 'BD'], pattern: /sales|business development/i },
  { name: 'Healthcare', count: '3,400', icon: HeartPulse, accent: '#e11d48', tint: '#fff1f2', roles: ['Nursing', 'Pharma', 'Lab'], pattern: /health|nurse|medical|doctor/i },
];
export type LandingCompany = {
  name: string;
  city: string;
  jobs: number;
  tone: LogoTone;
};
export const companies: LandingCompany[] = [
  {
    name: 'KD Public School',
    city: 'Bengaluru',
    jobs: 24,
    tone: 'blue',
  },
  {
    name: 'PeopleWorks',
    city: 'Hyderabad',
    jobs: 18,
    tone: 'violet',
  },
  {
    name: 'ScalePath',
    city: 'Remote',
    jobs: 32,
    tone: 'emerald',
  },
  {
    name: 'WorkNest',
    city: 'Mumbai',
    jobs: 12,
    tone: 'rose',
  },
  {
    name: 'BrightStaff',
    city: 'Delhi NCR',
    jobs: 28,
    tone: 'amber',
  },
];

export const findByTags = {
  Skills: [
    'React',
    'TypeScript',
    'Python',
    'SQL',
    'Figma',
    'HR Operations',
    'Excel',
    'Java',
  ],
  Location: [
    'Bengaluru',
    'Hyderabad',
    'Pune',
    'Mumbai',
    'Delhi NCR',
    'Chennai',
    'Remote',
  ],
  Industry: [
    'IT Services',
    'Fintech',
    'Healthcare',
    'HR Tech',
    'Education',
    'Retail',
  ],
  Company: companies.map(company => company.name),
};

export const resumeScores = [
  { label: 'Skills', value: 90 },
  { label: 'Experience', value: 80 },
  { label: 'Summary', value: 64 },
  { label: 'Keywords', value: 88 },
];
export const sampleResumeScore = 82;

export const steps = [
  {
    title: 'Create your profile',
    text: 'Add your skills, experience, and resume so employers can discover you.',
    icon: UserPlus,
    accent: '#b45309',
    tint: '#fffbeb',
    from: '#facc15',
    to: '#fb923c',
    headline: 'Put your experience in the spotlight.',
    highlights: [
      'Add your skills and experience',
      'Include your resume',
      'Keep your profile up to date',
    ],
    focus: 'Your profile',
    next: 'Explore roles',
  },
  {
    title: 'Apply in one click',
    text: 'Find a role that fits and send your profile with one simple application.',
    icon: Send,
    accent: '#4f65df',
    tint: '#eff6ff',
    from: '#c96b7c',
    to: '#818cf8',
    headline: 'Make your next career move.',
    highlights: [
      'Search for roles that match your skills',
      'Refine by location and work mode',
      'Apply with your profile',
    ],
    focus: 'The right role',
    next: 'Track updates',
  },
  {
    title: 'Track every application',
    text: 'Keep your applications, updates, and next steps in one place.',
    icon: ClipboardList,
    accent: '#15803d',
    tint: '#f0fdf4',
    from: '#4ade80',
    to: '#16a34a',
    headline: 'Stay clear on what comes next.',
    highlights: [
      'Review your submitted applications',
      'Follow application updates',
      'Keep track of your next steps',
    ],
    focus: 'Your applications',
    next: 'Your next role',
  },
];

export const trustPoints = [
  {
    title: 'Companies are verified',
    text: 'Discover opportunities from verified employers.',
    icon: BadgeCheck,
  },
  {
    title: 'Your resume stays private',
    text: 'You stay in control of your profile and resume.',
    icon: LockKeyhole,
  },
  {
    title: 'Free for job seekers',
    text: 'Search, apply, and take your next step without a fee.',
    icon: ShieldCheck,
  },
];

export type CareerTool = {
  title: string;
  text: string;
  icon: LucideIcon;
  href: string;
  action: string;
  accent: string;
  tint: string;
  highlights: string[];
};
export const tools: CareerTool[] = [
  {
    title: 'Your dream company wishlist',
    text: 'Keep your favorite employers close. Save the companies you would love to join and explore their open roles.',
    icon: Heart,
    href: '/jobseekers/followed-companies',
    action: 'View your wishlist',
    accent: '#b45309',
    tint: '#fffbeb',
    highlights: ['Save your favorite employers', 'Explore their open roles'],
  },
  {
    title: 'Notification alerts',
    text: 'Keep up with interview invitations, employer updates, and important job search notifications in one place.',
    icon: Bell,
    href: '/jobseekers/notifications',
    action: 'View notifications',
    accent: '#8f2438',
    tint: '#eff6ff',
    highlights: [
      'Interview and employer updates',
      'One place for unread alerts',
    ],
  },
  {
    title: 'Full application tracking',
    text: 'Follow your applications from submission to the next step, with a clear view of your application status.',
    icon: ClipboardList,
    href: '/jobseekers/applied-jobs',
    action: 'Track your applications',
    accent: '#15803d',
    tint: '#f0fdf4',
    highlights: ['Review every application', 'Follow status and next steps'],
  },
];

export const footerLinks = [
  {
    title: 'Job seekers',
    links: [
      { label: 'Search jobs', href: '/jobs' },
      { label: 'Browse companies', href: '/companies' },
      { label: 'Create account', href: '/jobseekers/register' },
    ],
  },
  {
    title: 'Employers',
    links: [
      { label: 'Hire talent', href: '/employer' },
      { label: 'Employer sign in', href: '/employer' },
    ],
  },
  {
    title: 'KD Public School',
    links: [
      { label: 'About us', href: '/about' },
      { label: 'Contact us', href: '/contact' },
    ],
  },
];
