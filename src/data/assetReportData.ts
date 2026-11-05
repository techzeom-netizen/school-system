export type AssetReportStatus =
  | 'allocated'
  | 'available'
  | 'repair'
  | 'retired';
export type AssetReportCategory =
  | 'Laptop'
  | 'Mobile phone'
  | 'Monitor'
  | 'Access card'
  | 'Other';
export type AssetReportRange = 'all' | 'month' | 'quarter' | 'year';
export type AssetReportId =
  | 'register'
  | 'employee'
  | 'warranty'
  | 'damage'
  | 'maintenance'
  | 'audit';
export type AssetRetiredReason = 'Lost' | 'Damaged' | 'End of life';

export interface AssetReportRecord {
  id: string;
  tag: string;
  name: string;
  category: AssetReportCategory;
  status: AssetReportStatus;
  department: string;
  location: string;
  holder: string | null;
  cost: number;
  addedOn: string;
  allocatedOn: string | null;
  confirmedAt: string | null;
  returnDueOn: string | null;
  warrantyEnd: string;
  repairSince: string | null;
  repairVendor: string | null;
  maintenanceCost: number;
  retiredReason: AssetRetiredReason | null;
  recoveryAmount: number;
  verifiedOn: string | null;
}

export const assetReportDefinitions: {
  id: AssetReportId;
  title: string;
  description: string;
}[] = [
  {
    id: 'register',
    title: 'Asset register',
    description: 'Every asset with status and holder',
  },
  {
    id: 'employee',
    title: 'Employee-wise assets',
    description: 'What each employee holds',
  },
  {
    id: 'warranty',
    title: 'Warranty expiry',
    description: 'Assets with warranty ending soon',
  },
  {
    id: 'damage',
    title: 'Lost and damaged',
    description: 'Incidents and recovery amounts',
  },
  {
    id: 'maintenance',
    title: 'Repair and maintenance cost',
    description: 'Spend by vendor and category',
  },
  {
    id: 'audit',
    title: 'Physical audit',
    description: 'Assets not yet counted on the floor',
  },
];

const repeatValues = <T>(pairs: [T, number][]): T[] =>
  pairs.flatMap(([value, count]) => Array.from({ length: count }, () => value));

const shuffleValues = <T>(values: T[], seed: number): T[] => {
  const copy = [...values];
  let state = seed;
  for (let index = copy.length - 1; index > 0; index -= 1) {
    state = (state * 1664525 + 1013904223) % 4294967296;
    const swap = state % (index + 1);
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
};

const roundToHundred = (amount: number) => Math.round(amount / 100) * 100;

const offsetDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString('en-CA');
};

const departmentQueue = repeatValues<string>([
  ['Engineering', 68],
  ['Sales', 34],
  ['Operations', 22],
  ['HR', 18],
  ['Finance', 16],
  ['Marketing', 14],
]);

const departmentNames = [
  'Engineering',
  'Sales',
  'Operations',
  'HR',
  'Finance',
  'Marketing',
];

const holderNames = [
  'Amit Deshmukh',
  'Neha Kulkarni',
  'Rohan Iyer',
  'Sneha Patil',
  'Karan Mehta',
  'Divya Nair',
  'Arjun Reddy',
  'Pooja Shah',
  'Vikram Singh',
  'Ananya Rao',
  'Rahul Verma',
  'Isha Gupta',
];

const locationNames = [
  'Bengaluru HQ',
  'Bengaluru HQ',
  'Mumbai office',
  'Delhi office',
];

const itemNames: Record<AssetReportCategory, string[]> = {
  Laptop: [
    'Dell Latitude 5440',
    'HP EliteBook 840',
    'Lenovo ThinkPad T14',
    'MacBook Air M2',
  ],
  'Mobile phone': ['Samsung Galaxy S23', 'iPhone 14', 'OnePlus 11'],
  Monitor: ['Dell 24 inch monitor', 'LG 27 inch monitor'],
  'Access card': ['Office access card'],
  Other: ['Wireless headset', 'Docking station', 'Office chair', 'Printer'],
};

const tagPrefixes: Record<AssetReportCategory, string> = {
  Laptop: 'LAP',
  'Mobile phone': 'MOB',
  Monitor: 'MON',
  'Access card': 'ACC',
  Other: 'OTH',
};

const repairVendors = [
  'Dell Service Centre',
  'Croma Care',
  'Apple Authorised Service',
  'Local repair partner',
];

const buildAssetReportRecords = (): AssetReportRecord[] => {
  const statuses = shuffleValues(
    repeatValues<AssetReportStatus>([
      ['allocated', 172],
      ['available', 41],
      ['repair', 19],
      ['retired', 16],
    ]),
    7
  );
  const categories = shuffleValues(
    repeatValues<AssetReportCategory>([
      ['Laptop', 96],
      ['Mobile phone', 52],
      ['Monitor', 44],
      ['Access card', 38],
      ['Other', 18],
    ]),
    11
  );

  let allocatedCount = 0;
  let repairCount = 0;
  let retiredCount = 0;
  const flagged = new Set<number>();

  const records = statuses.map((status, index): AssetReportRecord => {
    const category = categories[index];
    const names = itemNames[category];
    const costBase: Record<AssetReportCategory, number> = {
      Laptop: 62000 + ((index * 1700) % 58000),
      'Mobile phone': 28000 + ((index * 900) % 42000),
      Monitor: 11000 + ((index * 300) % 12000),
      'Access card': 500,
      Other: 2500 + ((index * 500) % 18000),
    };
    const cost = roundToHundred(costBase[category]);
    const tag = `AST-${tagPrefixes[category]}-${String(index + 1).padStart(5, '0')}`;
    const record: AssetReportRecord = {
      id: tag,
      tag,
      name: names[index % names.length],
      category,
      status,
      department: departmentNames[index % departmentNames.length],
      location: locationNames[index % locationNames.length],
      holder: null,
      cost,
      addedOn: offsetDate(-Math.floor((index * 600) / 248)),
      allocatedOn: null,
      confirmedAt: null,
      returnDueOn: null,
      warrantyEnd: offsetDate(45 + ((index * 37) % 800)),
      repairSince: null,
      repairVendor: null,
      maintenanceCost:
        index % 8 === 3 ? roundToHundred(1500 + ((index * 410) % 7500)) : 0,
      retiredReason: null,
      recoveryAmount: 0,
      verifiedOn: index % 7 === 0 ? null : offsetDate(-(index % 60)),
    };

    if (record.maintenanceCost > 0) {
      record.repairVendor = repairVendors[index % repairVendors.length];
    }

    if (status === 'allocated') {
      const slot = allocatedCount;
      allocatedCount += 1;
      record.department = departmentQueue[slot];
      record.holder = holderNames[index % holderNames.length];
      const given = -(20 + ((index * 7) % 300));
      record.allocatedOn = offsetDate(given);
      record.confirmedAt = `${record.allocatedOn}T10:30:00`;
      if (slot < 3) {
        record.allocatedOn = offsetDate(-(8 + slot * 3));
        record.confirmedAt = null;
        flagged.add(index);
      } else if (slot < 5) {
        record.allocatedOn = offsetDate(-(2 + (slot - 3)));
        record.confirmedAt = null;
        flagged.add(index);
      } else if (slot < 10) {
        record.returnDueOn = offsetDate(-(2 + (slot - 5) * 4));
        flagged.add(index);
      }
    }

    if (status === 'repair') {
      const slot = repairCount;
      repairCount += 1;
      record.repairSince = offsetDate(
        slot < 4 ? -(11 + slot * 6) : -(1 + (slot % 8))
      );
      record.repairVendor = repairVendors[slot % repairVendors.length];
      record.maintenanceCost = roundToHundred(2500 + ((slot * 970) % 9000));
      if (slot < 4) flagged.add(index);
    }

    if (status === 'retired') {
      const slot = retiredCount;
      retiredCount += 1;
      record.verifiedOn = null;
      if (slot < 5) {
        record.retiredReason = 'Lost';
        record.recoveryAmount = roundToHundred(cost * 0.5);
      } else if (slot < 9) {
        record.retiredReason = 'Damaged';
        record.recoveryAmount = roundToHundred(cost * 0.3);
      } else {
        record.retiredReason = 'End of life';
      }
    }

    return record;
  });

  let warrantyMarked = 0;
  records.forEach((record, index) => {
    if (
      warrantyMarked < 12 &&
      record.status !== 'retired' &&
      !flagged.has(index) &&
      index % 9 === 4
    ) {
      record.warrantyEnd = offsetDate(3 + warrantyMarked * 2);
      warrantyMarked += 1;
    }
  });

  return records;
};

export const initialAssetReportRecords: AssetReportRecord[] =
  buildAssetReportRecords();
