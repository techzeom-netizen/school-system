export type PersonalDetails = {
  fullName: string;
  email: string;
  emailVerified: boolean;
  mobile: string;
  mobileVerified: boolean;
  alternateMobile: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  currentLocation: string;
  hometown: string;
  experienceYears: string;
  experienceMonths: string;
  currentRole: string;
  company: string;
  currentSalary: string;
  workAuthorization: string;
  differentlyAbled: boolean;
  careerBreak: boolean;
};

export type OnlineLinks = {
  linkedin: string;
  github: string;
  portfolio: string;
  other: string;
};

export type ContactPreferences = {
  allowRecruiters: boolean;
  methods: string[];
  bestTime: string;
  language: string;
};

export type PrivacySettings = {
  visibility: 'all' | 'applied' | 'hidden';
  photoVisibility: string;
  contactVisibility: string;
  hideCurrentEmployer: boolean;
  blockedCompanies: string[];
};

export type DeviceSession = {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
};

export type SecuritySettings = {
  twoStep: boolean;
  passwordChangedAt: string;
  sessions: DeviceSession[];
};

export type ProfileValidationErrors = Partial<
  Record<
    keyof PersonalDetails | 'links' | 'password' | 'blockedCompany',
    string
  >
>;

export const initialPersonalDetails: PersonalDetails = {
  fullName: 'Navneet R',
  email: 'navneet.r@zeksta.com',
  emailVerified: true,
  mobile: '9876543210',
  mobileVerified: false,
  alternateMobile: '',
  dateOfBirth: '1998-03-14',
  gender: 'Male',
  maritalStatus: 'Single',
  currentLocation: 'Bengaluru, Karnataka',
  hometown: 'Mysuru',
  experienceYears: '3',
  experienceMonths: '6',
  currentRole: 'Frontend Developer',
  company: 'Zeksta',
  currentSalary: '1200000',
  workAuthorization: 'Indian citizen',
  differentlyAbled: false,
  careerBreak: false,
};

export const initialOnlineLinks: OnlineLinks = {
  linkedin: 'https://www.linkedin.com/in/navneet-r',
  github: '',
  portfolio: '',
  other: '',
};

export const initialContactPreferences: ContactPreferences = {
  allowRecruiters: true,
  methods: ['Email', 'Phone call'],
  bestTime: 'Evening 4-8',
  language: 'English',
};

export const initialPrivacySettings: PrivacySettings = {
  visibility: 'all',
  hideCurrentEmployer: true,
  photoVisibility: 'Recruiters only',
  contactVisibility: 'Only companies I apply to',
  blockedCompanies: ['Acme Staffing'],
};

export const initialSecuritySettings: SecuritySettings = {
  twoStep: false,
  passwordChangedAt: '2026-03-02',
  sessions: [
    {
      id: 'chrome-win',
      device: 'Chrome on Windows',
      location: 'Bengaluru, India',
      lastActive: 'Active now',
      current: true,
    },
    {
      id: 'safari-iphone',
      device: 'Safari on iPhone',
      location: 'Mysuru, India',
      lastActive: '2 days ago',
      current: false,
    },
    {
      id: 'firefox-linux',
      device: 'Firefox on Linux',
      location: 'Hyderabad, India',
      lastActive: '8 days ago',
      current: false,
    },
  ],
};

export const initialLastUpdated = new Date('2026-06-20T09:00:00');

export const formatDate = (date: Date | string) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));

export const getMonthsSince = (date: Date) => {
  const now = new Date();
  return Math.max(
    0,
    (now.getFullYear() - date.getFullYear()) * 12 +
      now.getMonth() -
      date.getMonth()
  );
};

export const getDaysSince = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  return Math.max(0, Math.floor(diff / 86400000));
};

export const formatSalary = (salary: string) =>
  Number(salary || 0).toLocaleString('en-IN');

export const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const isHttpUrl = (value: string) => {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export const isAtLeastAge = (date: string, age: number) => {
  if (!date) return false;
  const birthDate = new Date(date);
  const today = new Date();
  const cutoff = new Date(
    today.getFullYear() - age,
    today.getMonth(),
    today.getDate()
  );
  return birthDate <= cutoff;
};
