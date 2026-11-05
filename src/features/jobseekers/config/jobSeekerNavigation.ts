import type { User } from '@/types';

export type JobSeekerNavItem = {
  label: string;
  to: string;
};

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const getJobSeekerProfilePath = (user?: Partial<User> | null) => {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ');
  const slug = slugify(fullName);

  return slug ? `/jobseekers/${slug}` : '/jobseekers';
};

export const getJobSeekerHeaderLinks = (
  authenticated: boolean,
  _user?: Partial<User> | null
): JobSeekerNavItem[] => [
  {
    label: 'Find Jobs',
    to: authenticated ? '/jobseekers' : '/jobs',
  },
  {
    label: 'Companies',
    to: authenticated ? '/jobseekers/companies' : '/companies',
  },
  {
    label: 'Profile',
    to: '/jobseekers/my-profile',
  },
];

export const getJobSeekerLogoPath = (
  authenticated: boolean,
  user?: Partial<User> | null
) => (authenticated ? getJobSeekerProfilePath(user) : '/');
