import {
  companies,
  initialsOf,
  toneClasses,
  type CompanyJob,
} from './companies';

export type Job = {
  id: string;
  title: string;
  company: string;
  companyId?: string;
  companyLogo?: string;
  companyInitial?: string;
  companyLogoClassName?: string;
  verified?: boolean;
  featured?: boolean;
  location: string;
  type: string;
  experience: string;
  salary: string;
  posted: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  openings: number;
  teamMembers?: number;
  matchScore?: number;
  skills: string[];
  description: string;
  responsibilities: string[];
};

export type JobDetailLookupOptions = {
  companyId?: string | null;
};

export const jobs: Job[] = [
  {
    id: 'J-1024',
    title: 'Frontend Engineer',
    company: 'KD Public School',
    companyInitial: 'H',
    companyLogoClassName:
      'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400',
    verified: true,
    featured: true,
    location: 'Bengaluru',
    type: 'Full time',
    experience: '2-5 years',
    salary: '8-14 LPA',
    posted: '1 day ago',
    workMode: 'Hybrid',
    openings: 4,
    teamMembers: 4,
    matchScore: 95,
    skills: [
      'React',
      'TypeScript',
      'Tailwind CSS',
      'REST APIs',
      'UI/UX',
      'Vite',
    ],
    description:
      'Build responsive hiring dashboards, reusable UI components, and candidate-facing job discovery workflows.',
    responsibilities: [
      'Build reusable React screens for recruiter and candidate workflows.',
      'Work with APIs, form states, and responsive Tailwind layouts.',
      'Improve page performance and accessibility across the job portal.',
    ],
  },
  {
    id: 'J-1025',
    title: 'HR Operations Lead',
    company: 'PeopleWorks',
    companyInitial: 'P',
    companyLogoClassName: 'bg-violet-600 text-white',
    location: 'Hyderabad',
    type: 'Full time',
    experience: '5-8 years',
    salary: '10-16 LPA',
    posted: '2 days ago',
    workMode: 'On-site',
    openings: 2,
    teamMembers: 12,
    matchScore: 88,
    skills: [
      'HR Operations',
      'People Management',
      'Analytics',
      'Communication',
      'Payroll',
    ],
    description:
      'Lead HR operations, streamline people processes, and drive employee experience across India.',
    responsibilities: [
      'Manage onboarding, documentation, payroll inputs, and exits.',
      'Keep HRMS records accurate for audits and reporting.',
      'Coordinate with managers on hiring and employee operations.',
    ],
  },
  {
    id: 'J-1026',
    title: 'Talent Acquisition Partner',
    company: 'ScalePath',
    companyInitial: 'S',
    companyLogoClassName:
      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
    verified: true,
    location: 'Remote',
    type: 'Contract',
    experience: '3-6 years',
    salary: '6-11 LPA',
    posted: '3 days ago',
    workMode: 'Remote',
    openings: 6,
    teamMembers: 7,
    matchScore: 84,
    skills: ['Sourcing', 'Screening', 'Stakeholder Management', 'ATS'],
    description:
      'Source high-signal candidates, build shortlists, and coordinate interview pipelines for product roles.',
    responsibilities: [
      'Source candidates from job boards, referrals, and talent communities.',
      'Run screening calls and maintain clean ATS updates.',
      'Partner with hiring managers on role requirements and shortlists.',
    ],
  },
  {
    id: 'J-1027',
    title: 'Backend Developer',
    company: 'CloudHire Systems',
    companyInitial: 'C',
    companyLogoClassName:
      'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400',
    location: 'Pune',
    type: 'Full time',
    experience: '3-7 years',
    salary: '12-20 LPA',
    posted: 'Today',
    workMode: 'On-site',
    openings: 3,
    teamMembers: 9,
    matchScore: 79,
    skills: ['Node.js', 'PostgreSQL', 'AWS', 'Microservices'],
    description:
      'Design scalable APIs, improve data pipelines, and collaborate with frontend teams on hiring products.',
    responsibilities: [
      'Design and maintain Node.js services for job and candidate data.',
      'Build PostgreSQL queries and background jobs for hiring workflows.',
      'Collaborate on API contracts with frontend and product teams.',
    ],
  },
  {
    id: 'J-1028',
    title: 'Product Designer',
    company: 'WorkNest',
    companyInitial: 'W',
    companyLogoClassName:
      'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400',
    featured: true,
    location: 'Mumbai',
    type: 'Full time',
    experience: '2-4 years',
    salary: '7-13 LPA',
    posted: '5 days ago',
    workMode: 'Hybrid',
    openings: 1,
    teamMembers: 5,
    matchScore: 75,
    skills: ['Figma', 'Design Systems', 'Research', 'Prototyping'],
    description:
      'Craft polished candidate journeys, recruiter workflows, and clean design systems for HR products.',
    responsibilities: [
      'Design job search, profile, and recruiter dashboard screens.',
      'Maintain UI components and interaction patterns in Figma.',
      'Validate workflows with quick prototypes and user feedback.',
    ],
  },
  {
    id: 'J-1029',
    title: 'Recruitment Coordinator',
    company: 'BrightStaff',
    companyInitial: 'B',
    companyLogoClassName:
      'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400',
    location: 'Delhi NCR',
    type: 'Full time',
    experience: '0-2 years',
    salary: '3-5 LPA',
    posted: '1 week ago',
    workMode: 'On-site',
    openings: 8,
    teamMembers: 10,
    matchScore: 70,
    skills: ['Scheduling', 'Communication', 'Excel', 'Candidate Support'],
    description:
      'Coordinate interviews, follow up with candidates, and maintain accurate hiring records across teams.',
    responsibilities: [
      'Schedule interviews and keep candidates updated.',
      'Maintain hiring trackers and share daily pipeline status.',
      'Support recruiters with documentation and offer coordination.',
    ],
  },
];

const skillsByRole: Record<string, string[]> = {
  frontend: ['React', 'TypeScript', 'Tailwind CSS', 'Accessibility'],
  platform: ['Cloud Infrastructure', 'Kubernetes', 'CI/CD', 'Observability'],
  designer: ['Figma', 'Design Systems', 'Research', 'Prototyping'],
  customer: ['Customer Success', 'Stakeholder Management', 'CRM', 'Onboarding'],
  java: ['Java', 'Spring Boot', 'React', 'REST APIs'],
  qa: ['Automation Testing', 'Selenium', 'API Testing', 'Regression Testing'],
  risk: ['Risk Analysis', 'SQL', 'Fraud Monitoring', 'Reporting'],
  backend: ['Node.js', 'PostgreSQL', 'APIs', 'System Design'],
  category: [
    'Category Management',
    'Vendor Management',
    'Analytics',
    'Pricing',
  ],
  operations: ['Operations', 'Excel', 'Process Improvement', 'Reporting'],
  implementation: ['Implementation', 'Client Training', 'Configuration', 'SQL'],
  react: ['React Native', 'TypeScript', 'Mobile UI', 'REST APIs'],
  learning: ['Instructional Design', 'Content Strategy', 'Assessment', 'LMS'],
  growth: ['Performance Marketing', 'SEO', 'Campaigns', 'Analytics'],
  industrial: ['IoT', 'PLC Systems', 'Factory Automation', 'Data Monitoring'],
  strategy: [
    'Strategy',
    'Business Analysis',
    'Stakeholder Management',
    'Excel',
  ],
  ai: ['AI Workflows', 'LLM APIs', 'TypeScript', 'Product Engineering'],
  service: [
    'Service Delivery',
    'Program Management',
    'SLA Management',
    'Reporting',
  ],
};

const getCompanyJobSkills = (title: string) => {
  const normalizedTitle = title.toLowerCase();
  const matchedKey = Object.keys(skillsByRole).find(key =>
    normalizedTitle.includes(key)
  );

  return matchedKey
    ? skillsByRole[matchedKey]
    : ['Communication', 'Problem Solving', 'Collaboration', 'Ownership'];
};

const getCompanyJobType = (job: CompanyJob) =>
  job.workMode === 'Remote' ? 'Contract' : 'Full time';

export const companyJobs: Job[] = companies.flatMap(company =>
  company.jobs.map(job => {
    const skills = getCompanyJobSkills(job.title);

    return {
      id: job.id,
      title: job.title,
      company: company.name,
      companyId: company.id,
      companyInitial: initialsOf(company.name),
      companyLogoClassName: toneClasses[company.tone],
      verified: company.rating >= 4,
      featured: company.rating >= 4.5,
      location: job.location,
      type: getCompanyJobType(job),
      experience: job.experience,
      salary: job.salary,
      posted: job.posted,
      workMode: job.workMode,
      openings: 1,
      skills,
      description: `${company.name} is hiring a ${job.title} to support ${company.tagline.toLowerCase()}`,
      responsibilities: [
        `Deliver ${job.title.toLowerCase()} work for ${company.industry.toLowerCase()} teams.`,
        `Collaborate with colleagues across ${company.locations.slice(0, 2).join(' and ')} operations.`,
        `Use ${skills.slice(0, 2).join(' and ')} to improve hiring and business workflows.`,
      ],
    };
  })
);

export const allJobs = [...jobs, ...companyJobs];

export const findJobById = (
  jobId: string | undefined,
  options: JobDetailLookupOptions = {}
) => {
  if (!jobId) return undefined;

  if (options.companyId) {
    const companyHasJob = companies
      .find(company => company.id === options.companyId)
      ?.jobs.some(job => job.id === jobId);

    if (companyHasJob) {
      return companyJobs.find(
        job => job.id === jobId && job.companyId === options.companyId
      );
    }
  }

  return allJobs.find(job => job.id === jobId);
};

export const workModes = ['Remote', 'Hybrid', 'On-site'] as const;
export const experienceRanges = [
  '0-2 years',
  '2-5 years',
  '5-10 years',
  '10+ years',
] as const;
