export type PolicyStatus = 'active' | 'draft' | 'archived';

export type StatusFilter = 'all' | PolicyStatus;

export type LeaveTypeId =
  | 'casual'
  | 'sick'
  | 'earned'
  | 'maternity'
  | 'paternity'
  | 'adoption'
  | 'miscarriage'
  | 'sabbatical';

export interface LeaveType {
  id: LeaveTypeId;
  label: string;
  tile: string;
  showWeeks?: boolean;
}

export interface LeavePolicy {
  id: string;
  name: string;
  audience: string;
  status: PolicyStatus;
  days: Partial<Record<LeaveTypeId, number>>;
  hasCompOff: boolean;
  rules: string[];
  employeeCount: number;
  isAddOn: boolean;
  onLeaveNow: number;
}

export interface CommonRules {
  yearStartMonth: string;
  halfDayAllowed: boolean;
  countWeeklyOffs: boolean;
  pastDays: number;
}

export interface PolicyForm {
  name: string;
  audience: string;
  days: Record<LeaveTypeId, string>;
  hasCompOff: boolean;
  rulesText: string;
}

export interface CommonRulesForm {
  yearStartMonth: string;
  halfDayAllowed: boolean;
  countWeeklyOffs: boolean;
  pastDays: string;
}

export interface LeaveTile {
  key: string;
  value: string;
  label: string;
  classes: string;
  isWord: boolean;
}

export interface PolicyCompareRow {
  label: string;
  policyA: string;
  policyB: string;
  changed: boolean;
}

export const statusFilterOptions: { label: string; value: StatusFilter }[] = [
  { label: 'All policies', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Draft', value: 'draft' },
  { label: 'Archived', value: 'archived' },
];

export const monthOptions = [
  { label: 'January', value: '1' },
  { label: 'February', value: '2' },
  { label: 'March', value: '3' },
  { label: 'April', value: '4' },
  { label: 'May', value: '5' },
  { label: 'June', value: '6' },
  { label: 'July', value: '7' },
  { label: 'August', value: '8' },
  { label: 'September', value: '9' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
];

export const leaveTypes: LeaveType[] = [
  { id: 'casual', label: 'Casual leave', tile: 'bg-muted text-foreground' },
  { id: 'sick', label: 'Sick leave', tile: 'bg-muted text-foreground' },
  {
    id: 'earned',
    label: 'Earned leave',
    tile: 'bg-muted text-foreground',
  },
  {
    id: 'maternity',
    label: 'Maternity',
    tile: 'bg-muted text-foreground',
    showWeeks: true,
  },
  {
    id: 'paternity',
    label: 'Paternity',
    tile: 'bg-muted text-foreground',
  },
  {
    id: 'adoption',
    label: 'Adoption',
    tile: 'bg-muted text-foreground',
    showWeeks: true,
  },
  {
    id: 'miscarriage',
    label: 'Miscarriage',
    tile: 'bg-muted text-foreground',
    showWeeks: true,
  },
  {
    id: 'sabbatical',
    label: 'Sabbatical days',
    tile: 'bg-muted text-foreground',
  },
];

export const compOffTileClasses = 'bg-muted text-foreground';

export const coreLeaveIds: LeaveTypeId[] = ['casual', 'sick', 'earned'];

export const leaveTypeCount = leaveTypes.length + 1;

export const statusBadgeClass: Record<PolicyStatus, string> = {
  active: 'bg-primary/10 text-primary',
  draft: 'bg-muted text-muted-foreground',
  archived: 'bg-muted text-muted-foreground',
};

export const statusLabels: Record<PolicyStatus, string> = {
  active: 'Active',
  draft: 'Draft',
  archived: 'Archived',
};

export const maxRulesShown = 3;
export const maxLeaveDays = 365;
export const maxPastDays = 30;
export const minNameLength = 3;

export const emptyPolicyForm: PolicyForm = {
  name: '',
  audience: '',
  days: {
    casual: '',
    sick: '',
    earned: '',
    maternity: '',
    paternity: '',
    adoption: '',
    miscarriage: '',
    sabbatical: '',
  },
  hasCompOff: false,
  rulesText: '',
};

export const initialPolicies: LeavePolicy[] = [
  {
    id: 'policy-1',
    name: 'Standard policy',
    audience: 'Full-time employees Â· All locations',
    status: 'active',
    days: { casual: 12, sick: 8, earned: 15 },
    hasCompOff: true,
    rules: [
      'Leave is added every month',
      'Carry forward up to 10 days',
      'Earned leave can be encashed',
    ],
    employeeCount: 286,
    isAddOn: false,
    onLeaveNow: 0,
  },
  {
    id: 'policy-2',
    name: 'Probation policy',
    audience: 'Employees in their first 6 months',
    status: 'active',
    days: { casual: 6, sick: 4 },
    hasCompOff: false,
    rules: [
      'Leave is added every month',
      'No carry forward',
      'Moves to Standard policy on confirmation',
    ],
    employeeCount: 48,
    isAddOn: false,
    onLeaveNow: 0,
  },
  {
    id: 'policy-3',
    name: 'Trainee and intern policy',
    audience: 'Trainees and interns',
    status: 'active',
    days: { casual: 6, sick: 4 },
    hasCompOff: false,
    rules: [
      'Extra leave is unpaid',
      'Sick leave over 2 days needs a note',
      'No carry forward',
    ],
    employeeCount: 31,
    isAddOn: false,
    onLeaveNow: 0,
  },
  {
    id: 'policy-4',
    name: 'Maternity and parental policy',
    audience: 'Eligible employees after 80 days of service',
    status: 'active',
    days: { maternity: 182, paternity: 10, adoption: 84, miscarriage: 42 },
    hasCompOff: false,
    rules: [
      'Follows the Maternity Benefit Act',
      'Paid by the company',
      'Needs a medical document',
    ],
    employeeCount: 0,
    isAddOn: true,
    onLeaveNow: 3,
  },
  {
    id: 'policy-5',
    name: 'Contract staff policy',
    audience: 'Contract employees',
    status: 'active',
    days: { casual: 6, sick: 6 },
    hasCompOff: false,
    rules: [
      'Extra leave counts as loss of pay',
      'No carry forward',
      'Leave resets every year',
    ],
    employeeCount: 27,
    isAddOn: false,
    onLeaveNow: 0,
  },
  {
    id: 'policy-6',
    name: 'Executive policy',
    audience: 'Management grades M1 to M3',
    status: 'draft',
    days: { casual: 12, sick: 10, earned: 21, sabbatical: 30 },
    hasCompOff: false,
    rules: [
      'Carry forward up to 30 days',
      'Sabbatical after 5 years',
      'Starts on 1 Jan 2027',
    ],
    employeeCount: 0,
    isAddOn: false,
    onLeaveNow: 0,
  },
];

export const initialCommonRules: CommonRules = {
  yearStartMonth: '4',
  halfDayAllowed: true,
  countWeeklyOffs: false,
  pastDays: 7,
};

export const initialUnassignedCount = 34;

export const pluralize = (
  count: number,
  singular: string,
  plural = `${singular}s`
) => (count === 1 ? singular : plural);

export const getMonthName = (month: number) =>
  monthOptions[(month + 11) % 12]?.label ?? '';

export const getLeaveYearText = (startMonth: string) => {
  const start = Number(startMonth);
  return `${getMonthName(start)} to ${getMonthName(start - 1)}`;
};

export const getPastDaysText = (days: number) =>
  days === 0 ? 'Not allowed' : `Up to ${days} ${pluralize(days, 'day')} back`;

export const getYearlyDays = (policy: LeavePolicy) =>
  coreLeaveIds.reduce((total, id) => total + (policy.days[id] ?? 0), 0);

export const getMissingLeaves = (policy: LeavePolicy) => {
  const hasEverydayLeave = coreLeaveIds.some(id => (policy.days[id] ?? 0) > 0);
  if (!hasEverydayLeave) return [];
  const missing: string[] = [];
  if (!policy.days.earned) missing.push('Earned leave');
  if (!policy.hasCompOff) missing.push('Comp-off');
  return missing;
};

export const getTiles = (policy: LeavePolicy): LeaveTile[] => {
  const tiles: LeaveTile[] = [];
  const compOffTile: LeaveTile = {
    key: 'compOff',
    value: 'Comp-off',
    label: 'Added when earned',
    classes: compOffTileClasses,
    isWord: true,
  };

  leaveTypes.forEach(type => {
    const days = policy.days[type.id];
    if (!days) return;
    tiles.push({
      key: type.id,
      value: String(days),
      label: type.showWeeks
        ? `${type.label} (${Math.round(days / 7)} weeks)`
        : type.label,
      classes: type.tile,
      isWord: false,
    });

    if (type.id === 'earned' && policy.hasCompOff) tiles.push(compOffTile);
  });

  if (policy.hasCompOff && !policy.days.earned) tiles.push(compOffTile);
  return tiles;
};

export const policyToForm = (policy: LeavePolicy): PolicyForm => {
  const days = { ...emptyPolicyForm.days };
  leaveTypes.forEach(type => {
    days[type.id] = policy.days[type.id] ? String(policy.days[type.id]) : '';
  });
  return {
    name: policy.name,
    audience: policy.audience,
    days,
    hasCompOff: policy.hasCompOff,
    rulesText: policy.rules.join('\n'),
  };
};

export const parseLeaveDays = (
  days: Record<LeaveTypeId, string>
): Partial<Record<LeaveTypeId, number>> | null => {
  const result: Partial<Record<LeaveTypeId, number>> = {};
  for (const type of leaveTypes) {
    const text = days[type.id].trim();
    if (!text) continue;
    const number = Number(text);
    if (!Number.isInteger(number) || number < 0 || number > maxLeaveDays) {
      return null;
    }
    if (number > 0) result[type.id] = number;
  }
  return result;
};

export const parseRules = (text: string) =>
  text
    .split('\n')
    .map(rule => rule.trim())
    .filter(Boolean);

export const hasAnyLeave = (policy: LeavePolicy) =>
  policy.hasCompOff || Object.keys(policy.days).length > 0;

export const isStatusFilter = (value: string): value is StatusFilter =>
  statusFilterOptions.some(option => option.value === value);
