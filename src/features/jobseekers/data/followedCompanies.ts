import { companies, type Company, type CompanyFilters } from './companies';

export type FollowedEntry = {
  companyId: string;
  followedDaysAgo: number;
  alertsOn: boolean;
};

export type FollowedCompany = FollowedEntry & {
  company: Company;
};

export type FollowedQuickFilter = 'all' | 'hiring' | 'new';

// TODO: replace mock with API
export const initialFollowed: FollowedEntry[] = [
  { companyId: 'northstar-systems', followedDaysAgo: 2, alertsOn: true },
  { companyId: 'mintlane-payments', followedDaysAgo: 5, alertsOn: true },
  { companyId: 'cartwave-commerce', followedDaysAgo: 12, alertsOn: false },
  { companyId: 'healbridge-care', followedDaysAgo: 18, alertsOn: true },
  { companyId: 'learnloom-academy', followedDaysAgo: 27, alertsOn: false },
];

const followerCounts: Record<string, number> = {
  'northstar-systems': 48000,
  'bluepeak-digital': 62500,
  'mintlane-payments': 31200,
  'cartwave-commerce': 54900,
  'healbridge-care': 22700,
  'learnloom-academy': 18400,
  'forgegrid-industries': 71300,
  'clarion-advisory': 38600,
  'sproutstack-labs': 9600,
  'rivergate-solutions': 80200,
};

export const followersOf = (id: string) => followerCounts[id] ?? 0;

export const resolveFollowed = (entries: FollowedEntry[]): FollowedCompany[] =>
  entries.flatMap(entry => {
    const company = companies.find(item => item.id === entry.companyId);
    return company ? [{ ...entry, company }] : [];
  });

export const isNewJob = (job: Company['jobs'][number]) => {
  const match = job.posted.match(/^(\d+)d ago$/);
  return Boolean(match && Number(match[1]) <= 2);
};

export const newJobsOf = (company: Company) => company.jobs.filter(isNewJob);

export const filterFollowed = (
  list: FollowedCompany[],
  query: string,
  filters: CompanyFilters,
  quickFilter: FollowedQuickFilter
) => {
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = list.filter(item => {
    const { company } = item;
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
      (!normalizedQuery || searchable.includes(normalizedQuery)) &&
      (!filters.industries.length ||
        filters.industries.includes(company.industry)) &&
      (!filters.types.length || filters.types.includes(company.type)) &&
      (!filters.sizes.length || filters.sizes.includes(company.size)) &&
      (!filters.location ||
        company.hq === filters.location ||
        company.locations.includes(filters.location)) &&
      (!filters.minRating || company.rating >= filters.minRating) &&
      (!filters.hiringOnly || company.jobs.length > 0) &&
      (quickFilter === 'all' ||
        (quickFilter === 'hiring' && company.jobs.length > 0) ||
        (quickFilter === 'new' && newJobsOf(company).length > 0))
    );
  });

  return [...filtered].sort((a, b) => {
    if (filters.sort === 'jobs') {
      return b.company.jobs.length - a.company.jobs.length;
    }
    if (filters.sort === 'rating') return b.company.rating - a.company.rating;
    if (filters.sort === 'reviews') {
      return b.company.reviewCount - a.company.reviewCount;
    }
    return a.followedDaysAgo - b.followedDaysAgo;
  });
};
