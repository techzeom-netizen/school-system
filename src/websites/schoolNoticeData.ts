export interface SchoolNotice {
  label: string;
  title: string;
  text: string;
  color: string;
  textColor: string;
  rotation: string;
}

export const announcementItems = [
  {
    label: 'Admissions',
    text: 'Applications for the 2026-27 academic year are now open.',
  },
  {
    label: 'School calendar',
    text: 'Parents can view the term calendar and upcoming activities through the portal.',
  },
  {
    label: 'Campus visit',
    text: 'Book a weekday visit with our admissions office.',
  },
];

export const newsItems = [
  {
    day: '12',
    month: 'NOV',
    dateTime: '2026-11-12',
    title: 'Class 9 team wins district science fair',
    text: 'Our students took first place with a low-cost water purifier.',
  },
  {
    day: '08',
    month: 'NOV',
    dateTime: '2026-11-08',
    title: 'New robotics studio opens',
    text: 'Students from Class 5 onwards can now join the robotics club.',
  },
  {
    day: '29',
    month: 'OCT',
    dateTime: '2026-10-29',
    title: 'Annual sports day highlights',
    text: 'Over 600 students took part across 24 events.',
  },
];

export const upcomingEvents = [
  { title: 'Parent-teacher meeting', date: '14 Nov', dateTime: '2026-11-14' },
  {
    title: "Children's Day celebration",
    date: '14 Nov',
    dateTime: '2026-11-14',
  },
  { title: 'Winter term exams begin', date: '08 Dec', dateTime: '2026-12-08' },
  { title: 'Annual day', date: '20 Dec', dateTime: '2026-12-20' },
  { title: 'Winter break starts', date: '24 Dec', dateTime: '2026-12-24' },
];

export const noticeBoardItems: SchoolNotice[] = [
  {
    label: 'Admissions',
    title: 'Registration is open',
    text: 'Forms for 2027-28 are available at the school office.',
    color: '#fff3b8',
    textColor: '#5f4a00',
    rotation: '-1.2deg',
  },
  {
    label: '14 November',
    title: 'Parent-teacher meeting',
    text: 'Classes VI to X, 9:00 am to 1:00 pm.',
    color: '#d8e4ff',
    textColor: '#233f77',
    rotation: '0.8deg',
  },
  {
    label: '8 December',
    title: 'Winter exams begin',
    text: 'The date sheet will be shared with parents.',
    color: '#d5f3e6',
    textColor: '#18583f',
    rotation: '-0.6deg',
  },
];
