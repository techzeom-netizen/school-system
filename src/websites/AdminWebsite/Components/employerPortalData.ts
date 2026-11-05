import {
  BarChart3,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Headphones,
  LayoutDashboard,
  Search,
  ShieldCheck,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';

export interface IconTextItem {
  icon: LucideIcon;
  title: string;
  text: string;
  tint?: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface CandidateItem {
  initials: string;
  name: string;
  role: string;
  skills: string[];
  match: string;
}

export interface PlanItem {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export interface ReviewItem {
  initials: string;
  name: string;
  role: string;
  quote: string;
}

export interface ResourceItem {
  category: string;
  title: string;
  text: string;
  gradient: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const heroChecks = [
  'Post your first job for free',
  'Access a large database of verified CVs',
  'Dashboards to track every application',
];

// TODO: replace with real content
export const heroStats: StatItem[] = [
  { value: '10K+', label: 'Active jobs' },
  { value: '5L+', label: 'Candidate CVs' },
  { value: '2K+', label: 'Hiring companies' },
];

// TODO: replace with real content
export const trustedBrands = [
  'Northwind',
  'Acme Corp',
  'Globex',
  'Initech',
  'Umbra',
];

export const assuranceItems: IconTextItem[] = [
  {
    icon: FileCheck2,
    title: 'Verified profiles',
    text: 'Candidate details are structured for faster screening.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure by design',
    text: 'Protected recruiter access for employer teams.',
  },
  {
    icon: Clock3,
    title: 'Fast onboarding',
    text: 'Create an account and start setting up roles quickly.',
  },
  {
    icon: Headphones,
    title: 'Dedicated support',
    text: 'Get help with posting, search and account setup.',
  },
];

export const featureItems: IconTextItem[] = [
  {
    icon: Briefcase,
    title: 'Post jobs',
    text: 'Publish roles with skills, salary, location and screening details.',
    tint: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400',
  },
  {
    icon: Search,
    title: 'Find CVs',
    text: 'Search candidate profiles and save promising matches.',
    tint: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
  },
  {
    icon: LayoutDashboard,
    title: 'Hiring dashboard',
    text: 'Track applications, shortlists, interviews and offers.',
    tint: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400',
  },
  {
    icon: UsersRound,
    title: 'Team collaboration',
    text: 'Keep recruiters and hiring managers aligned.',
    tint: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400',
  },
  {
    icon: CheckCircle2,
    title: 'Verified candidates',
    text: 'Review clearer candidate data before outreach.',
    tint: 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400',
  },
  {
    icon: BookOpen,
    title: 'Hiring resources',
    text: 'Use practical resources for job descriptions and interviews.',
    tint: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400',
  },
];

export const postJobHighlights = [
  'Create job posts with role, location, salary and work mode details.',
  'Add skills, responsibilities and screening questions before publishing.',
  'Track responses from the same recruiter dashboard after the job goes live.',
];

export const postJobPreviewFields = [
  ['Job title', 'Senior React Developer'],
  ['Location', 'Bengaluru / Hybrid'],
  ['Experience', '4-7 years'],
  ['Salary range', 'Rs 12L - 20L'],
];

// TODO: replace with real content
export const dashboardKpis: StatItem[] = [
  { value: '24', label: 'Active jobs' },
  { value: '186', label: 'New applications' },
  { value: '42', label: 'Shortlisted CVs' },
  { value: '17', label: 'Interviews booked' },
];

export const pipelineItems: StatItem[] = [
  { value: '186', label: 'Applied' },
  { value: '126', label: 'Screened' },
  { value: '78', label: 'Shortlisted' },
  { value: '44', label: 'Interview' },
  { value: '18', label: 'Offer' },
];

// TODO: replace with real content
export const candidateRows: CandidateItem[] = [
  {
    initials: 'AR',
    name: 'Aarav Rao',
    role: 'React developer - 4 yrs',
    skills: ['React', 'TypeScript', 'Redux'],
    match: '96%',
  },
  {
    initials: 'MS',
    name: 'Meera Singh',
    role: 'Frontend engineer - 5 yrs',
    skills: ['Next.js', 'UI', 'Testing'],
    match: '94%',
  },
  {
    initials: 'IK',
    name: 'Imran Khan',
    role: 'Full stack developer - 6 yrs',
    skills: ['Node', 'React', 'AWS'],
    match: '91%',
  },
  {
    initials: 'NP',
    name: 'Nisha Patel',
    role: 'UI engineer - 3 yrs',
    skills: ['React', 'Tailwind', 'Figma'],
    match: '89%',
  },
];

export const howItWorksItems = [
  {
    title: 'Register',
    text: 'Create your recruiter account with verified work details.',
  },
  {
    title: 'Post a job',
    text: 'Publish your role with requirements and screening information.',
  },
  {
    title: 'Review CVs',
    text: 'Shortlist matching candidates from applications and search.',
  },
  {
    title: 'Hire',
    text: 'Coordinate interviews, offers and final selection.',
  },
];

// TODO: replace with real content
export const industries = [
  ['IT', 'IT & Software', '3,200+ candidates'],
  ['FN', 'Finance & Banking', '1,450+ candidates'],
  ['HC', 'Healthcare', '980+ candidates'],
  ['MK', 'Sales & Marketing', '2,100+ candidates'],
  ['OP', 'Operations', '1,260+ candidates'],
  ['HR', 'HR & Admin', '870+ candidates'],
  ['ED', 'Education', '640+ candidates'],
  ['EN', 'Engineering', '1,720+ candidates'],
];

// TODO: replace with real content
export const statsBandItems: StatItem[] = [
  { value: '10K+', label: 'Active job openings' },
  { value: '5L+', label: 'Verified candidate CVs' },
  { value: '2K+', label: 'Companies hiring' },
  { value: '48 hrs', label: 'Average time to first shortlist' },
];

export const comparisonRows = [
  ['Verified candidate profiles', 'Included', 'Manual checks'],
  ['Time to first shortlist', '~48 hours', '2-3 weeks'],
  ['Real-time hiring dashboard', 'Available', 'Spreadsheet tracking'],
  ['Team collaboration', 'Built in', 'Scattered updates'],
  ['Cost per hire', 'Optimized plans', 'High agency spend'],
];

// TODO: replace with real content
export const pricingPlans: PlanItem[] = [
  {
    name: 'Starter',
    price: 'Rs 0/month',
    description: 'For school teams trying Demo School workflows.',
    features: [
      'Post your first job',
      'Basic candidate responses',
      'Email support',
    ],
  },
  {
    name: 'Growth',
    price: 'Rs 4,999/month',
    description: 'For growing teams hiring across multiple roles.',
    highlighted: true,
    features: [
      'Unlimited active jobs',
      'Candidate search access',
      'Pipeline dashboard',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For companies needing scale and account support.',
    features: ['Custom access', 'Team onboarding', 'Priority support'],
  },
];

// TODO: replace with real content
export const reviews: ReviewItem[] = [
  {
    initials: 'AV',
    name: 'Anika Verma',
    role: 'HR Lead, Northwind',
    quote:
      'Demo School helped our team move from scattered updates to a clear pipeline.',
  },
  {
    initials: 'RK',
    name: 'Rohan Kapoor',
    role: 'Talent Partner, Globex',
    quote:
      'The candidate search experience is fast, practical and easy for recruiters to adopt.',
  },
  {
    initials: 'SD',
    name: 'Sara Dsouza',
    role: 'People Ops, Umbra',
    quote:
      'Posting roles and reviewing responses feels much more organized now.',
  },
];

export const resources: ResourceItem[] = [
  {
    category: 'Hiring guide',
    title: 'How to write job posts candidates actually read',
    text: 'A practical checklist for clearer roles and stronger responses.',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    category: 'Screening',
    title: 'Shortlist faster without losing quality',
    text: 'Simple steps for using skills, signals and structured notes.',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    category: 'Interviews',
    title: 'Build an interview plan your team can follow',
    text: 'Align recruiters and hiring managers before the first call.',
    gradient: 'from-amber-500 to-orange-600',
  },
];

export const faqs: FaqItem[] = [
  {
    question: 'How do I register as a recruiter?',
    answer:
      'Use Register Account on this page, complete your work details and submit the form for review.',
  },
  {
    question: 'Is posting a job free?',
    answer:
      'The starter plan includes your first job post so your team can try the hiring workflow.',
  },
  {
    question: 'Can multiple recruiters use one company account?',
    answer:
      'Yes. Team access is available on higher plans and can be configured during onboarding.',
  },
  {
    question: 'Are candidate profiles verified?',
    answer:
      'Candidate profiles are structured to support faster review, with verification workflows planned for deeper checks.',
  },
  {
    question: 'I forgot my password. What should I do?',
    answer:
      "Use 'Forgot password?' on the login card and we will email you a secure link to reset it.",
  },
];

export const registerFeatures: IconTextItem[] = [
  {
    icon: Briefcase,
    title: 'Post jobs easily',
    text: 'Publish openings with the details candidates need.',
  },
  {
    icon: Search,
    title: 'Search candidates',
    text: 'Find talent by role, skill and location.',
  },
  {
    icon: BarChart3,
    title: 'Track your pipeline',
    text: 'Keep every application stage visible.',
  },
  {
    icon: UsersRound,
    title: 'Free HRMS for your team',
    text: 'Manage employees, attendance and leave at no cost.',
  },
];
