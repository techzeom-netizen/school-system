import {
  initialOnlineLinks,
  initialPersonalDetails,
  type PersonalDetails,
} from './profile';
import {
  initialPreferences,
  initialResumeFiles,
  initialSections,
  initialSummary,
  type CareerPreferences,
  type ProfileSummary,
  type ResumeFile,
  type ResumeSectionItem,
} from './resume';

export type ProfileViewer = 'candidate' | 'recruiter';

export type CandidateProfileData = {
  personal: PersonalDetails;
  summary: ProfileSummary;
  preferences: CareerPreferences;
  resume: ResumeFile;
  skills: {
    title: string;
    items: string[];
  }[];
  links: {
    label: string;
    url: string;
  }[];
  employment: ResumeSectionItem[];
  education: ResumeSectionItem[];
  projects: Array<{
    title: string;
    role: string;
    description: string;
    impact: string;
  }>;
  certifications: Array<{
    title: string;
    subtitle: string;
    date: string;
  }>;
  languages: ResumeSectionItem[];
  highlights: string[];
};

export const candidateProfile: CandidateProfileData = {
  personal: initialPersonalDetails,
  summary: initialSummary,
  preferences: initialPreferences,
  resume:
    initialResumeFiles.find(resume => resume.isDefault) ||
    initialResumeFiles[0],
  skills: [
    {
      title: 'Frontend',
      items: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS'],
    },
    {
      title: 'Product UI',
      items: ['Responsive Design', 'UI Components', 'Accessibility'],
    },
    {
      title: 'Workflow',
      items: ['REST APIs', 'Job Search', 'Dashboard UX', 'Form Validation'],
    },
  ],
  links: [
    {
      label: 'LinkedIn',
      url: initialOnlineLinks.linkedin || 'https://linkedin.com/in/navneet-r',
    },
    {
      label: 'GitHub',
      url: initialOnlineLinks.github || 'https://github.com/navneet-r',
    },
    {
      label: 'Portfolio',
      url: initialOnlineLinks.portfolio || 'https://navneet.dev',
    },
  ],
  employment: initialSections.employment,
  education: initialSections.education,
  projects: [
    {
      title: 'Candidate Job Search Experience',
      role: 'React, TypeScript, Tailwind CSS',
      description:
        'Built job cards, filters, saved jobs and application tracking screens for a candidate hiring portal.',
      impact:
        'Improved job discovery flows with reusable components and clearer status feedback.',
    },
    {
      title: 'Recruiter Dashboard UI',
      role: 'Reusable components, API integration',
      description:
        'Created dashboard sections for hiring insights, candidate profile review and communication actions.',
      impact:
        'Reduced duplicated UI work through shared form and card patterns.',
    },
  ],
  certifications: [
    {
      title: 'React and TypeScript Advanced UI',
      subtitle: 'Frontend Masters',
      date: '2025',
    },
    {
      title: 'Accessible Web Interfaces',
      subtitle: 'Google Developers',
      date: '2024',
    },
  ],
  languages: initialSections.languages,
  highlights: [
    'Built reusable hiring dashboards and candidate job discovery workflows',
    'Strong React, TypeScript, Tailwind CSS and REST API implementation',
    'Comfortable with recruiter-facing flows, filters, forms and responsive UI',
  ],
};
