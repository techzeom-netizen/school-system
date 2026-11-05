export type CompanyType =
  | 'Startup'
  | 'MNC'
  | 'Product'
  | 'Services'
  | 'Enterprise';

export type CompanySize =
  | '1-50'
  | '51-200'
  | '201-1000'
  | '1001-5000'
  | '5000+';
export type LogoTone = 'blue' | 'emerald' | 'violet' | 'amber' | 'rose' | 'sky';
export type SortKey = 'relevance' | 'rating' | 'reviews' | 'jobs';

export type RatingBreakdown = {
  culture: number;
  workLife: number;
  management: number;
  compensation: number;
  growth: number;
};

export type CompanyJob = {
  id: string;
  title: string;
  location: string;
  experience: string;
  salary: string;
  posted: string;
  workMode: 'On-site' | 'Hybrid' | 'Remote';
};

export type CompanyReview = {
  id: string;
  rating: number;
  title: string;
  role: string;
  employmentStatus: string;
  date: string;
  pros: string;
  cons: string;
};

export type CompanySalary = {
  id: string;
  role: string;
  average: number;
  min: number;
  max: number;
  reports: number;
};

export type Company = {
  id: string;
  name: string;
  tagline: string;
  about: string;
  industry: string;
  type: CompanyType;
  size: CompanySize;
  hq: string;
  locations: string[];
  founded: number;
  website: string;
  tone: LogoTone;
  rating: number;
  reviewCount: number;
  recommendPercent: number;
  ceoApproval: number;
  breakdown: RatingBreakdown;
  tags: string[];
  perks: string[];
  jobs: CompanyJob[];
  reviews: CompanyReview[];
  salaries: CompanySalary[];
};

export type CompanyFilters = {
  query: string;
  industries: string[];
  types: CompanyType[];
  sizes: CompanySize[];
  location: string;
  minRating: number;
  hiringOnly: boolean;
  followingOnly: boolean;
  sort: SortKey;
};

export const INDUSTRIES = [
  'IT Services',
  'Software Product',
  'Fintech',
  'E-commerce',
  'Healthcare',
  'EdTech',
  'Manufacturing',
  'Consulting',
] as const;

export const COMPANY_TYPES: CompanyType[] = [
  'Startup',
  'MNC',
  'Product',
  'Services',
  'Enterprise',
];

export const COMPANY_SIZES: CompanySize[] = [
  '1-50',
  '51-200',
  '201-1000',
  '1001-5000',
  '5000+',
];

export const LOCATIONS = [
  'Bengaluru',
  'Hyderabad',
  'Pune',
  'Mumbai',
  'Delhi NCR',
  'Chennai',
  'Remote',
] as const;

export const RATING_STEPS = [4, 3.5, 3] as const;

export const toneClasses: Record<LogoTone, string> = {
  blue: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  emerald:
    'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  violet:
    'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800',
  amber:
    'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  rose: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
  sky: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800',
};

export const defaultFilters: CompanyFilters = {
  query: '',
  industries: [],
  types: [],
  sizes: [],
  location: '',
  minRating: 0,
  hiringOnly: false,
  followingOnly: false,
  sort: 'relevance',
};

export const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('');

export const formatCount = (count: number) =>
  count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count.toString();

export const formatLpa = (amount: number) =>
  `${Math.round(amount / 100000)} LPA`;

const makeReviews = (prefix: string): CompanyReview[] => [
  {
    id: `${prefix}-review-1`,
    rating: 4.6,
    title: 'Supportive teams and practical ownership',
    role: 'Software Engineer',
    employmentStatus: 'Current employee',
    date: 'Aug 2026',
    pros: 'Clear goals, helpful managers, and strong peer learning.',
    cons: 'Some releases still need tighter planning.',
  },
  {
    id: `${prefix}-review-2`,
    rating: 4.1,
    title: 'Good growth for people who ask for scope',
    role: 'Product Manager',
    employmentStatus: 'Former employee',
    date: 'Jun 2026',
    pros: 'High trust culture and easy access to leadership.',
    cons: 'Documentation can lag during fast-moving quarters.',
  },
  {
    id: `${prefix}-review-3`,
    rating: 3.8,
    title: 'Balanced work with a few busy cycles',
    role: 'Data Analyst',
    employmentStatus: 'Current employee',
    date: 'Apr 2026',
    pros: 'Flexible work mode and thoughtful benefits.',
    cons: 'Cross-team dependency tracking needs improvement.',
  },
  {
    id: `${prefix}-review-4`,
    rating: 4.3,
    title: 'Managers invest in career paths',
    role: 'Engineering Manager',
    employmentStatus: 'Current employee',
    date: 'Feb 2026',
    pros: 'Transparent promotions and strong technical standards.',
    cons: 'Hiring loops can take longer than expected.',
  },
];

const makeSalaries = (prefix: string, base: number): CompanySalary[] => [
  {
    id: `${prefix}-salary-1`,
    role: 'Software Engineer',
    average: base,
    min: base - 400000,
    max: base + 600000,
    reports: 28,
  },
  {
    id: `${prefix}-salary-2`,
    role: 'Product Manager',
    average: base + 500000,
    min: base,
    max: base + 900000,
    reports: 16,
  },
  {
    id: `${prefix}-salary-3`,
    role: 'Data Analyst',
    average: base - 300000,
    min: base - 700000,
    max: base + 200000,
    reports: 21,
  },
];

// TODO: replace with API.
export const companies: Company[] = [
  {
    id: 'northstar-systems',
    name: 'Northstar Systems',
    tagline: 'Cloud platforms for high-trust operations teams.',
    about:
      'Northstar Systems builds workflow, identity, and observability products for distributed technology teams. Its engineering culture favors durable architecture, steady shipping, and customer-backed product decisions.',
    industry: 'Software Product',
    type: 'Product',
    size: '1001-5000',
    hq: 'Bengaluru',
    locations: ['Bengaluru', 'Hyderabad', 'Remote'],
    founded: 2014,
    website: 'https://example.com/northstar',
    tone: 'blue',
    rating: 4.4,
    reviewCount: 2840,
    recommendPercent: 88,
    ceoApproval: 91,
    breakdown: {
      culture: 4.5,
      workLife: 4.2,
      management: 4.3,
      compensation: 4.1,
      growth: 4.6,
    },
    tags: ['Cloud', 'SaaS', 'Developer tools', 'Hybrid'],
    perks: ['Learning budget', 'ESOPs', 'Health cover', 'Flexible leave'],
    jobs: [
      {
        id: 'job-1',
        title: 'Frontend Engineer',
        location: 'Bengaluru',
        experience: '3-6 yrs',
        salary: '18-28 LPA',
        posted: '2d ago',
        workMode: 'Hybrid',
      },
      {
        id: 'job-2',
        title: 'Platform Engineer',
        location: 'Hyderabad',
        experience: '5-8 yrs',
        salary: '24-36 LPA',
        posted: '4d ago',
        workMode: 'Hybrid',
      },
      {
        id: 'job-3',
        title: 'Product Designer',
        location: 'Remote',
        experience: '4-7 yrs',
        salary: '20-30 LPA',
        posted: '1w ago',
        workMode: 'Remote',
      },
      {
        id: 'job-4',
        title: 'Customer Success Manager',
        location: 'Bengaluru',
        experience: '4-8 yrs',
        salary: '16-24 LPA',
        posted: '1w ago',
        workMode: 'On-site',
      },
    ],
    reviews: makeReviews('northstar'),
    salaries: makeSalaries('northstar', 2400000),
  },
  {
    id: 'bluepeak-digital',
    name: 'Bluepeak Digital',
    tagline: 'Modern IT services for banks and insurers.',
    about:
      'Bluepeak Digital partners with regulated businesses to modernize legacy systems, data platforms, and employee-facing applications.',
    industry: 'IT Services',
    type: 'Services',
    size: '5000+',
    hq: 'Pune',
    locations: ['Pune', 'Mumbai', 'Chennai'],
    founded: 2009,
    website: 'https://example.com/bluepeak',
    tone: 'sky',
    rating: 4.0,
    reviewCount: 1960,
    recommendPercent: 81,
    ceoApproval: 84,
    breakdown: {
      culture: 4,
      workLife: 3.9,
      management: 3.8,
      compensation: 3.9,
      growth: 4.1,
    },
    tags: ['Banking', 'Modernization', 'Delivery', 'Training'],
    perks: ['Certification support', 'Transport', 'Insurance', 'Mentorship'],
    jobs: [
      {
        id: 'job-2',
        title: 'Platform Engineer',
        location: 'Hyderabad',
        experience: '5-8 yrs',
        salary: '24-36 LPA',
        posted: '4d ago',
        workMode: 'Hybrid',
      },
      {
        id: 'job-5',
        title: 'Java Full Stack Developer',
        location: 'Pune',
        experience: '4-7 yrs',
        salary: '14-22 LPA',
        posted: '3d ago',
        workMode: 'Hybrid',
      },
      {
        id: 'job-6',
        title: 'QA Automation Engineer',
        location: 'Chennai',
        experience: '3-5 yrs',
        salary: '10-16 LPA',
        posted: '6d ago',
        workMode: 'On-site',
      },
    ],
    reviews: makeReviews('bluepeak'),
    salaries: makeSalaries('bluepeak', 1700000),
  },
  {
    id: 'mintlane-payments',
    name: 'Mintlane Payments',
    tagline: 'Payment intelligence for growing merchants.',
    about:
      'Mintlane Payments creates risk, reconciliation, and checkout tooling for fast-growing digital commerce teams.',
    industry: 'Fintech',
    type: 'Startup',
    size: '201-1000',
    hq: 'Mumbai',
    locations: ['Mumbai', 'Bengaluru', 'Remote'],
    founded: 2018,
    website: 'https://example.com/mintlane',
    tone: 'emerald',
    rating: 4.5,
    reviewCount: 920,
    recommendPercent: 90,
    ceoApproval: 93,
    breakdown: {
      culture: 4.6,
      workLife: 4,
      management: 4.4,
      compensation: 4.4,
      growth: 4.7,
    },
    tags: ['Payments', 'Risk', 'APIs', 'ESOPs'],
    perks: ['ESOPs', 'Home office setup', 'Wellness wallet', 'Team retreats'],
    jobs: [
      {
        id: 'job-3',
        title: 'Product Designer',
        location: 'Remote',
        experience: '4-7 yrs',
        salary: '20-30 LPA',
        posted: '1w ago',
        workMode: 'Remote',
      },
      {
        id: 'job-7',
        title: 'Risk Analyst',
        location: 'Mumbai',
        experience: '2-5 yrs',
        salary: '12-18 LPA',
        posted: '5d ago',
        workMode: 'Hybrid',
      },
      {
        id: 'job-8',
        title: 'Backend Engineer',
        location: 'Bengaluru',
        experience: '3-6 yrs',
        salary: '22-34 LPA',
        posted: '2d ago',
        workMode: 'Hybrid',
      },
    ],
    reviews: makeReviews('mintlane'),
    salaries: makeSalaries('mintlane', 2600000),
  },
  {
    id: 'cartwave-commerce',
    name: 'Cartwave Commerce',
    tagline: 'Commerce operations for regional retail brands.',
    about:
      'Cartwave Commerce helps brands manage catalog, logistics, and customer journeys across marketplaces and owned channels.',
    industry: 'E-commerce',
    type: 'Enterprise',
    size: '1001-5000',
    hq: 'Delhi NCR',
    locations: ['Delhi NCR', 'Mumbai', 'Bengaluru'],
    founded: 2012,
    website: 'https://example.com/cartwave',
    tone: 'amber',
    rating: 3.9,
    reviewCount: 1480,
    recommendPercent: 76,
    ceoApproval: 79,
    breakdown: {
      culture: 3.8,
      workLife: 3.6,
      management: 3.7,
      compensation: 3.9,
      growth: 4.1,
    },
    tags: ['Retail', 'Logistics', 'Marketplace', 'Scale'],
    perks: [
      'Meal card',
      'Staff discounts',
      'Medical cover',
      'Leadership programs',
    ],
    jobs: [
      {
        id: 'job-1',
        title: 'Frontend Engineer',
        location: 'Bengaluru',
        experience: '3-6 yrs',
        salary: '18-28 LPA',
        posted: '2d ago',
        workMode: 'Hybrid',
      },
      {
        id: 'job-9',
        title: 'Category Manager',
        location: 'Delhi NCR',
        experience: '4-7 yrs',
        salary: '16-24 LPA',
        posted: '1d ago',
        workMode: 'On-site',
      },
      {
        id: 'job-10',
        title: 'Operations Analyst',
        location: 'Mumbai',
        experience: '2-4 yrs',
        salary: '8-12 LPA',
        posted: '1w ago',
        workMode: 'On-site',
      },
    ],
    reviews: makeReviews('cartwave'),
    salaries: makeSalaries('cartwave', 1500000),
  },
  {
    id: 'healbridge-care',
    name: 'Healbridge Care',
    tagline: 'Healthcare software for connected clinics.',
    about:
      'Healbridge Care offers patient engagement, claims, and clinic workflow products for healthcare providers.',
    industry: 'Healthcare',
    type: 'Product',
    size: '201-1000',
    hq: 'Hyderabad',
    locations: ['Hyderabad', 'Chennai', 'Remote'],
    founded: 2016,
    website: 'https://example.com/healbridge',
    tone: 'rose',
    rating: 4.2,
    reviewCount: 740,
    recommendPercent: 84,
    ceoApproval: 86,
    breakdown: {
      culture: 4.3,
      workLife: 4.1,
      management: 4,
      compensation: 3.9,
      growth: 4.3,
    },
    tags: ['HealthTech', 'Patient care', 'HIPAA', 'Remote'],
    perks: [
      'Mental health support',
      'Remote roles',
      'Insurance',
      'Conference budget',
    ],
    jobs: [
      {
        id: 'job-4',
        title: 'Customer Success Manager',
        location: 'Bengaluru',
        experience: '4-8 yrs',
        salary: '16-24 LPA',
        posted: '1w ago',
        workMode: 'On-site',
      },
      {
        id: 'job-11',
        title: 'Implementation Consultant',
        location: 'Hyderabad',
        experience: '3-6 yrs',
        salary: '12-18 LPA',
        posted: '4d ago',
        workMode: 'Hybrid',
      },
      {
        id: 'job-12',
        title: 'React Native Engineer',
        location: 'Remote',
        experience: '4-7 yrs',
        salary: '18-30 LPA',
        posted: '3d ago',
        workMode: 'Remote',
      },
    ],
    reviews: makeReviews('healbridge'),
    salaries: makeSalaries('healbridge', 2100000),
  },
  {
    id: 'learnloom-academy',
    name: 'Learnloom Academy',
    tagline: 'Skill-building platforms for career switchers.',
    about:
      'Learnloom Academy combines cohort learning, assessments, and mentor matching for professionals entering digital roles.',
    industry: 'EdTech',
    type: 'Startup',
    size: '51-200',
    hq: 'Remote',
    locations: ['Remote', 'Bengaluru', 'Delhi NCR'],
    founded: 2020,
    website: 'https://example.com/learnloom',
    tone: 'violet',
    rating: 4.6,
    reviewCount: 360,
    recommendPercent: 92,
    ceoApproval: 94,
    breakdown: {
      culture: 4.7,
      workLife: 4.5,
      management: 4.4,
      compensation: 4.1,
      growth: 4.8,
    },
    tags: ['Learning', 'Remote-first', 'Mentors', 'Content'],
    perks: ['Remote-first', 'Learning days', 'Creator stipend', 'Async work'],
    jobs: [
      {
        id: 'job-13',
        title: 'Learning Experience Designer',
        location: 'Remote',
        experience: '3-6 yrs',
        salary: '14-22 LPA',
        posted: '2d ago',
        workMode: 'Remote',
      },
      {
        id: 'job-14',
        title: 'Growth Marketer',
        location: 'Remote',
        experience: '4-8 yrs',
        salary: '16-26 LPA',
        posted: '5d ago',
        workMode: 'Remote',
      },
      {
        id: 'job-1',
        title: 'Frontend Engineer',
        location: 'Bengaluru',
        experience: '3-6 yrs',
        salary: '18-28 LPA',
        posted: '2d ago',
        workMode: 'Hybrid',
      },
    ],
    reviews: makeReviews('learnloom'),
    salaries: makeSalaries('learnloom', 1900000),
  },
  {
    id: 'forgegrid-industries',
    name: 'Forgegrid Industries',
    tagline: 'Smart manufacturing systems for factories.',
    about:
      'Forgegrid Industries builds planning, quality, and IoT systems for modern manufacturing plants.',
    industry: 'Manufacturing',
    type: 'MNC',
    size: '5000+',
    hq: 'Chennai',
    locations: ['Chennai', 'Pune', 'Delhi NCR'],
    founded: 1998,
    website: 'https://example.com/forgegrid',
    tone: 'amber',
    rating: 3.7,
    reviewCount: 2320,
    recommendPercent: 72,
    ceoApproval: 75,
    breakdown: {
      culture: 3.6,
      workLife: 3.5,
      management: 3.5,
      compensation: 3.7,
      growth: 3.9,
    },
    tags: ['IoT', 'Factories', 'ERP', 'Global'],
    perks: ['Provident fund', 'Transport', 'Shift allowance', 'Skill academy'],
    jobs: [
      {
        id: 'job-15',
        title: 'Industrial IoT Engineer',
        location: 'Chennai',
        experience: '4-8 yrs',
        salary: '14-22 LPA',
        posted: '6d ago',
        workMode: 'On-site',
      },
      {
        id: 'job-6',
        title: 'QA Automation Engineer',
        location: 'Chennai',
        experience: '3-5 yrs',
        salary: '10-16 LPA',
        posted: '6d ago',
        workMode: 'On-site',
      },
      {
        id: 'job-10',
        title: 'Operations Analyst',
        location: 'Mumbai',
        experience: '2-4 yrs',
        salary: '8-12 LPA',
        posted: '1w ago',
        workMode: 'On-site',
      },
    ],
    reviews: makeReviews('forgegrid'),
    salaries: makeSalaries('forgegrid', 1300000),
  },
  {
    id: 'clarion-advisory',
    name: 'Clarion Advisory',
    tagline: 'Business consulting for digital transformation.',
    about:
      'Clarion Advisory works with enterprises on strategy, change management, operating models, and analytics programs.',
    industry: 'Consulting',
    type: 'MNC',
    size: '1001-5000',
    hq: 'Delhi NCR',
    locations: ['Delhi NCR', 'Mumbai', 'Bengaluru', 'Pune'],
    founded: 2005,
    website: 'https://example.com/clarion',
    tone: 'blue',
    rating: 4.1,
    reviewCount: 1680,
    recommendPercent: 80,
    ceoApproval: 83,
    breakdown: {
      culture: 4.1,
      workLife: 3.7,
      management: 4,
      compensation: 4.2,
      growth: 4.4,
    },
    tags: ['Strategy', 'Analytics', 'Enterprise', 'Travel'],
    perks: ['Bonus plan', 'Travel benefits', 'Upskilling', 'Insurance'],
    jobs: [
      {
        id: 'job-16',
        title: 'Strategy Consultant',
        location: 'Delhi NCR',
        experience: '3-6 yrs',
        salary: '18-28 LPA',
        posted: '3d ago',
        workMode: 'Hybrid',
      },
      {
        id: 'job-7',
        title: 'Risk Analyst',
        location: 'Mumbai',
        experience: '2-5 yrs',
        salary: '12-18 LPA',
        posted: '5d ago',
        workMode: 'Hybrid',
      },
      {
        id: 'job-11',
        title: 'Implementation Consultant',
        location: 'Hyderabad',
        experience: '3-6 yrs',
        salary: '12-18 LPA',
        posted: '4d ago',
        workMode: 'Hybrid',
      },
    ],
    reviews: makeReviews('clarion'),
    salaries: makeSalaries('clarion', 2200000),
  },
  {
    id: 'sproutstack-labs',
    name: 'Sproutstack Labs',
    tagline: 'AI workflow tools for small businesses.',
    about:
      'Sproutstack Labs builds automation products that help growing teams handle support, reporting, and internal operations.',
    industry: 'Software Product',
    type: 'Startup',
    size: '1-50',
    hq: 'Bengaluru',
    locations: ['Bengaluru', 'Remote'],
    founded: 2022,
    website: 'https://example.com/sproutstack',
    tone: 'emerald',
    rating: 4.7,
    reviewCount: 118,
    recommendPercent: 95,
    ceoApproval: 96,
    breakdown: {
      culture: 4.8,
      workLife: 4.4,
      management: 4.7,
      compensation: 4.2,
      growth: 4.9,
    },
    tags: ['AI', 'Automation', 'Early-stage', 'Remote'],
    perks: ['ESOPs', 'Remote work', 'Mac setup', 'Founder access'],
    jobs: [
      {
        id: 'job-8',
        title: 'Backend Engineer',
        location: 'Bengaluru',
        experience: '3-6 yrs',
        salary: '22-34 LPA',
        posted: '2d ago',
        workMode: 'Hybrid',
      },
      {
        id: 'job-17',
        title: 'AI Product Engineer',
        location: 'Remote',
        experience: '4-7 yrs',
        salary: '26-40 LPA',
        posted: '1d ago',
        workMode: 'Remote',
      },
      {
        id: 'job-14',
        title: 'Growth Marketer',
        location: 'Remote',
        experience: '4-8 yrs',
        salary: '16-26 LPA',
        posted: '5d ago',
        workMode: 'Remote',
      },
    ],
    reviews: makeReviews('sproutstack'),
    salaries: makeSalaries('sproutstack', 2800000),
  },
  {
    id: 'rivergate-solutions',
    name: 'Rivergate Solutions',
    tagline: 'Enterprise service teams for complex programs.',
    about:
      'Rivergate Solutions runs managed technology, support, and analytics programs for large enterprise customers.',
    industry: 'IT Services',
    type: 'Enterprise',
    size: '5000+',
    hq: 'Hyderabad',
    locations: ['Hyderabad', 'Pune', 'Chennai', 'Remote'],
    founded: 2001,
    website: 'https://example.com/rivergate',
    tone: 'sky',
    rating: 3.8,
    reviewCount: 3120,
    recommendPercent: 74,
    ceoApproval: 78,
    breakdown: {
      culture: 3.8,
      workLife: 3.7,
      management: 3.6,
      compensation: 3.8,
      growth: 3.9,
    },
    tags: ['Managed services', 'Analytics', 'Enterprise', 'Support'],
    perks: [
      'Night shift allowance',
      'Insurance',
      'Training',
      'Internal mobility',
    ],
    jobs: [
      {
        id: 'job-5',
        title: 'Java Full Stack Developer',
        location: 'Pune',
        experience: '4-7 yrs',
        salary: '14-22 LPA',
        posted: '3d ago',
        workMode: 'Hybrid',
      },
      {
        id: 'job-18',
        title: 'Service Delivery Lead',
        location: 'Hyderabad',
        experience: '7-11 yrs',
        salary: '20-30 LPA',
        posted: '1w ago',
        workMode: 'On-site',
      },
      {
        id: 'job-12',
        title: 'React Native Engineer',
        location: 'Remote',
        experience: '4-7 yrs',
        salary: '18-30 LPA',
        posted: '3d ago',
        workMode: 'Remote',
      },
    ],
    reviews: makeReviews('rivergate'),
    salaries: makeSalaries('rivergate', 1600000),
  },
];

export const getCompany = (id: string) =>
  companies.find(company => company.id === id);

export const similarCompanies = (company: Company, limit = 3) =>
  companies
    .filter(
      item =>
        item.id !== company.id &&
        (item.industry === company.industry || item.type === company.type)
    )
    .slice(0, limit);

export const activeFilterCount = (filters: CompanyFilters) =>
  Number(Boolean(filters.query)) +
  filters.industries.length +
  filters.types.length +
  filters.sizes.length +
  Number(Boolean(filters.location)) +
  Number(filters.minRating > 0) +
  Number(filters.hiringOnly) +
  Number(filters.followingOnly);

export const filterCompanies = (
  list: Company[],
  filters: CompanyFilters,
  followingSet: ReadonlySet<string>
) => {
  const query = filters.query.trim().toLowerCase();

  const filtered = list.filter(company => {
    const searchable = [
      company.name,
      company.industry,
      company.hq,
      company.tagline,
      ...company.tags,
    ]
      .join(' ')
      .toLowerCase();

    return (
      (!query || searchable.includes(query)) &&
      (!filters.industries.length ||
        filters.industries.includes(company.industry)) &&
      (!filters.types.length || filters.types.includes(company.type)) &&
      (!filters.sizes.length || filters.sizes.includes(company.size)) &&
      (!filters.location ||
        company.hq === filters.location ||
        company.locations.includes(filters.location)) &&
      (!filters.minRating || company.rating >= filters.minRating) &&
      (!filters.hiringOnly || company.jobs.length > 0) &&
      (!filters.followingOnly || followingSet.has(company.id))
    );
  });

  return [...filtered].sort((a, b) => {
    if (filters.sort === 'rating') return b.rating - a.rating;
    if (filters.sort === 'reviews') return b.reviewCount - a.reviewCount;
    if (filters.sort === 'jobs') return b.jobs.length - a.jobs.length;
    return (
      b.rating * 100 +
      b.reviewCount / 100 -
      (a.rating * 100 + a.reviewCount / 100)
    );
  });
};
