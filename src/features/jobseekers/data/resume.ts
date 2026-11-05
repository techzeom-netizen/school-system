import type { LucideIcon } from 'lucide-react';

export type ResumeFile = {
  id: string;
  name: string;
  label: string;
  size: number;
  updatedAt: Date;
  isDefault: boolean;
  file?: File;
};

export type ProfileSummary = {
  headline: string;
  summary: string;
};

export type SectionKey =
  | 'employment'
  | 'education'
  | 'projects'
  | 'certifications'
  | 'languages';

export type ResumeSectionItem = {
  id: string;
  title: string;
  subtitle: string;
  start?: string;
  end?: string;
  description?: string;
};

export type SectionConfig = {
  key: SectionKey;
  title: string;
  addLabel: string;
  titleLabel: string;
  subtitleLabel: string;
  description?: boolean;
  dates?: boolean;
};

export type CareerPreferences = {
  desiredRole: string;
  jobType: string;
  locations: string;
  salary: string;
  noticePeriod: string;
  workMode: string;
};

export type Visibility = 'all' | 'applied' | 'hidden';

export type OpenToWork = {
  enabled: boolean;
  jobType: string;
  startDate: string;
};

export type ChecklistItem = {
  key: string;
  label: string;
  done: boolean;
};

export type ActivityItem = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export const MAX_RESUMES = 3;
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const acceptedResumeTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const sectionConfigs: SectionConfig[] = [
  {
    key: 'employment',
    title: 'Employment',
    addLabel: 'Add employment',
    titleLabel: 'Job title',
    subtitleLabel: 'Company',
    description: true,
    dates: true,
  },
  {
    key: 'education',
    title: 'Education',
    addLabel: 'Add education',
    titleLabel: 'Degree',
    subtitleLabel: 'College',
    dates: true,
  },
  {
    key: 'projects',
    title: 'Projects',
    addLabel: 'Add project',
    titleLabel: 'Project name',
    subtitleLabel: 'Your role / tech used',
    description: true,
    dates: true,
  },
  {
    key: 'certifications',
    title: 'Certifications',
    addLabel: 'Add certification',
    titleLabel: 'Certification name',
    subtitleLabel: 'Issued by',
    dates: true,
  },
  {
    key: 'languages',
    title: 'Languages',
    addLabel: 'Add language',
    titleLabel: 'Language',
    subtitleLabel: 'Proficiency',
  },
];

export const initialResumeFiles: ResumeFile[] = [
  {
    id: 'resume-frontend',
    name: 'Aarav_Verma_Frontend_Resume.pdf',
    label: 'Frontend',
    size: 1420000,
    updatedAt: new Date('2026-06-20T09:00:00'),
    isDefault: true,
  },
  {
    id: 'resume-fullstack',
    name: 'Aarav_Verma_Fullstack_Resume.docx',
    label: 'Full-stack',
    size: 1180000,
    updatedAt: new Date('2026-05-28T09:00:00'),
    isDefault: false,
  },
];

export const initialSummary: ProfileSummary = {
  headline: 'Frontend Developer | React, TypeScript, Tailwind | 3+ years',
  summary:
    'Frontend developer with 3+ years of experience building hiring dashboards, reusable React components, and candidate-facing job discovery workflows.',
};

export const initialSkills = [
  'React',
  'TypeScript',
  'Tailwind CSS',
  'REST APIs',
  'JavaScript',
  'UI Components',
  'Responsive Design',
];

export const initialSections: Record<SectionKey, ResumeSectionItem[]> = {
  employment: [
    {
      id: 'employment-1',
      title: 'Frontend Engineer',
      subtitle: 'Demo School',
      start: '2023-04',
      description:
        'Built reusable dashboards, filters, and candidate-facing job search experiences.',
    },
  ],
  education: [
    {
      id: 'education-1',
      title: 'B.Tech Computer Science',
      subtitle: 'Bengaluru Institute of Technology',
      start: '2019-08',
      end: '2023-06',
    },
  ],
  projects: [],
  certifications: [],
  languages: [
    { id: 'language-1', title: 'English', subtitle: 'Professional' },
    { id: 'language-2', title: 'Hindi', subtitle: 'Native' },
  ],
};

export const initialPreferences: CareerPreferences = {
  desiredRole: 'Senior Frontend Developer',
  jobType: 'Full-time',
  locations: 'Bengaluru, Remote',
  salary: '1800000',
  noticePeriod: '30 days',
  workMode: 'Hybrid',
};

export const formatBytes = (bytes: number) => {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(mb >= 1 ? 1 : 2)} MB`;
};

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);

export const formatMonth = (month?: string, fallback = 'Present') => {
  if (!month) return fallback;
  const [year, value] = month.split('-').map(Number);
  return new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(year, value - 1));
};

export const formatSalary = (salary: string) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(salary || 0));

export const getMonthsSince = (date: Date, now = new Date('2026-10-05')) => {
  const years = now.getFullYear() - date.getFullYear();
  const months = now.getMonth() - date.getMonth();
  return years * 12 + months;
};

export const createResumeFromFile = (
  file: File,
  isDefault = false
): ResumeFile => ({
  id: `resume-${Date.now()}-${file.name}`,
  name: file.name,
  label: file.name.toLowerCase().includes('full') ? 'Full-stack' : 'Frontend',
  size: file.size,
  updatedAt: new Date(),
  isDefault,
  file,
});
