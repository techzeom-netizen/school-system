export type TimelineEntry = {
  id: string;
  title: string;
  subtitle?: string;
  period?: string;
  duration?: string;
  location?: string;
  description?: string;
  bullets: string[];
  tags: string[];
  link?: string;
  current?: boolean;
};

export type Accomplishment = {
  id: string;
  kind: 'certification' | 'award' | 'publication' | 'other';
  title: string;
  issuer?: string;
  year?: string;
  link?: string;
};

export type LabelValue = {
  label: string;
  value: string;
};

export type CandidateProfile = {
  id: string;
  fullName: string;
  headline: string;
  currentPosition: string;
  location: string;
  photoUrl: string;
  coverUrl: string;
  lastUpdated: Date;
  openToWork: boolean;
  openToWorkRoles: string[];
  emailVerified: boolean;
  phoneVerified: boolean;
  email: string;
  phone: string;
  experience: string;
  currentCtc: string;
  expectedCtc: string;
  noticePeriod: string;
  summary: string;
  experienceList: TimelineEntry[];
  education: TimelineEntry[];
  projects: TimelineEntry[];
  accomplishments: Accomplishment[];
  skills: string[];
  languages: LabelValue[];
  preferences: LabelValue[];
  personal: LabelValue[];
  links: LabelValue[];
  resume?: {
    name: string;
    meta: string;
    url?: string;
  };
};

export const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const maskEmail = (email: string) => {
  const [name, domain] = email.split('@');
  if (!name || !domain) return email;
  return `${name.slice(0, 2)}${'*'.repeat(Math.max(name.length - 2, 3))}@${domain}`;
};

export const maskPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length <= 4) return phone;
  return `${'*'.repeat(Math.max(digits.length - 4, 6))}${digits.slice(-4)}`;
};

export const formatCtc = (value: string | number) => {
  const amount = Number(value || 0);
  if (!amount) return '';
  const lpa = amount / 100000;
  return `Rs ${Number.isInteger(lpa) ? lpa : lpa.toFixed(1)} LPA`;
};

export const mockProfile: CandidateProfile = {
  id: 'aarav-candidate',
  fullName: 'Aarav Candidate',
  headline: 'Frontend Developer | React, TypeScript, Tailwind',
  currentPosition: 'Teacher at Demo School',
  location: 'Bengaluru, Karnataka',
  photoUrl:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=220&q=80',
  coverUrl:
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80',
  lastUpdated: new Date('2026-06-20T09:00:00'),
  openToWork: true,
  openToWorkRoles: ['Senior Frontend Developer'],
  emailVerified: true,
  phoneVerified: true,
  email: 'aarav@example.com',
  phone: '9876543210',
  experience: '3y 6m',
  currentCtc: 'Rs 12 LPA',
  expectedCtc: 'Rs 18 LPA',
  noticePeriod: '30 days',
  summary: 'Frontend developer building recruiter and candidate workflows.',
  experienceList: [
    {
      id: 'mock-exp-1',
      title: 'Frontend Engineer',
      subtitle: 'Demo School',
      period: 'Apr 2023 - Apr 2025',
      duration: '3y 6m',
      location: 'Bengaluru',
      description:
        'Built job search, resume, saved jobs, and candidate profile experiences for a hiring platform.',
      bullets: [
        'Created reusable React and TypeScript components.',
        'Improved mobile layouts for candidate workflows.',
      ],
      tags: ['React', 'TypeScript', 'Tailwind CSS'],
      current: true,
    },
    {
      id: 'mock-exp-2',
      title: 'Teacher at Demo School',
      subtitle: 'Demo School',
      period: 'Apr 2025 - Present',
      duration: '1y 6m',
      location: 'Bengaluru',
      description:
        'Built job search, resume, saved jobs, and candidate profile experiences for a hiring platform.',
      bullets: [
        'Created reusable React and TypeScript components.',
        'Improved mobile layouts for candidate workflows.',
      ],
      tags: ['React', 'TypeScript', 'Tailwind CSS'],
      current: true,
    },
  ],
  education: [
    {
      id: 'mock-education-1',
      title: 'B.Tech Computer Science',
      subtitle: 'Bengaluru Institute of Technology',
      period: 'Aug 2019 - Jun 2023',
      bullets: [],
      tags: ['Computer Science'],
    },
  ],
  projects: [
    {
      id: 'mock-project-1',
      title: 'Resume manager',
      subtitle: 'PDF preview and active resume flow',
      period: '2026',
      description:
        'Candidate resume workspace with upload, default resume selection, and preview support.',
      bullets: [],
      tags: ['Resume', 'PDF', 'Profile'],
      link: 'https://demo-school.edu',
    },
  ],
  accomplishments: [
    {
      id: 'mock-cert-1',
      kind: 'certification',
      title: 'Advanced React and TypeScript',
      issuer: 'Frontend Masters',
      year: '2026',
    },
  ],
  skills: ['React', 'TypeScript', 'Tailwind CSS', 'REST APIs', 'JavaScript'],
  languages: [
    { label: 'English', value: 'Professional' },
    { label: 'Hindi', value: 'Native' },
  ],
  preferences: [
    { label: 'Preferred role', value: 'Senior Frontend Developer' },
    { label: 'Job type', value: 'Full-time' },
    { label: 'Work mode', value: 'Hybrid' },
    { label: 'Preferred locations', value: 'Bengaluru, Remote' },
  ],
  personal: [
    { label: 'Work authorization', value: 'Indian citizen' },
    { label: 'Hometown', value: 'Mysuru' },
  ],
  links: [
    { label: 'LinkedIn', value: 'https://www.linkedin.com/in/aarav-candidate' },
    { label: 'GitHub', value: 'https://github.com/aarav-candidate' },
    { label: 'Portfolio', value: 'https://aarav.dev' },
  ],
  resume: {
    name: 'Aarav_Verma_Frontend_Resume.pdf',
    meta: 'Frontend | 1.4 MB | Updated 20 Jun 2026',
  },
};
