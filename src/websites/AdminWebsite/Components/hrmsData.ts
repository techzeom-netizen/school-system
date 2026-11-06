import {
  BarChart3,
  CalendarCheck,
  CalendarDays,
  ClipboardCheck,
  FileText,
  Megaphone,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

export const hrmsHero = {
  pill: 'Free HRMS included',
  title: 'Free HRMS for your company',
  text: 'Manage staff, attendance and leave with the KD Public School ERP.',
  tag: 'FREE',
};

export interface HrmsModule {
  label: string;
  icon: LucideIcon;
}

export const hrmsModules: HrmsModule[] = [
  { label: 'Employee records', icon: Users },
  { label: 'Attendance tracking', icon: ClipboardCheck },
  { label: 'Leave management', icon: CalendarDays },
  { label: 'Payroll & payslips', icon: Wallet },
  { label: 'Employee documents', icon: FileText },
  { label: 'Announcements', icon: Megaphone },
  { label: 'Holiday calendar', icon: CalendarCheck },
  { label: 'HR reports', icon: BarChart3 },
];

export const hrmsPoints = [
  'One place for every employee record',
  'Attendance and leave, approved in a click',
  'Built for your team, free for your company',
];

// Sample numbers for the decorative product preview only.
export const hrmsKpis = [
  { label: 'Employees', value: '128' },
  { label: 'Present today', value: '117' },
  { label: 'On leave', value: '6' },
  { label: 'Pending approvals', value: '5' },
];

export const hrmsWeek = [
  { day: 'Mon', value: 92 },
  { day: 'Tue', value: 96 },
  { day: 'Wed', value: 89 },
  { day: 'Thu', value: 94 },
  { day: 'Fri', value: 85 },
];

export type HrmsStatus = 'Present' | 'On leave' | 'Remote';

export const hrmsEmployees: {
  initials: string;
  name: string;
  role: string;
  status: HrmsStatus;
  color: string;
}[] = [
  {
    initials: 'AR',
    name: 'Aarav Rao',
    role: 'Engineering',
    status: 'Present',
    color: 'bg-blue-600',
  },
  {
    initials: 'PS',
    name: 'Priya Sharma',
    role: 'Design',
    status: 'Remote',
    color: 'bg-violet-600',
  },
  {
    initials: 'KM',
    name: 'Karan Mehta',
    role: 'Sales',
    status: 'On leave',
    color: 'bg-emerald-600',
  },
];

export const hrmsStatusClass: Record<HrmsStatus, string> = {
  Present:
    'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300',
  Remote: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300',
  'On leave':
    'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300',
};
