import { form16FinancialYearOptions } from '@/data/reusableDropdownData';
import type { Form16Record, Stage, Status } from './form16Types';
export const financialYears = form16FinancialYearOptions.map(
  option => option.value
);
const standardDeduction = 75000;
const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
export const quarterNames = [
  'Apr - Jun',
  'Jul - Sep',
  'Oct - Dec',
  'Jan - Mar',
];
export const statusOrder: Record<Status, number> = {
  attention: 0,
  ready: 1,
  generated: 2,
  shared: 3,
};

export const statusStyles: Record<
  Status,
  { label: string; className: string }
> = {
  attention: {
    label: 'Needs attention',
    className: 'bg-destructive/10 text-destructive',
  },
  ready: { label: 'Ready to generate', className: 'bg-muted text-foreground' },
  generated: {
    label: 'Generated',
    className: 'bg-primary/10 text-primary',
  },
  shared: { label: 'Shared', className: 'bg-primary text-primary-foreground' },
};

export const sliceColors: Record<Status, string> = {
  shared: 'text-primary',
  generated: 'text-primary/60',
  ready: 'text-primary/30',
  attention: 'text-destructive',
};

const baseEmployees: Omit<Form16Record, 'fy'>[] = [
  {
    id: 'e1',
    name: 'Sneha Iyer',
    department: 'Marketing',
    pan: '',
    gross: 540000,
    tax: 42300,
    stage: 'none',
  },
  {
    id: 'e2',
    name: 'Pooja Rao',
    department: 'HR',
    pan: 'ABCPR12',
    gross: 480000,
    tax: 36900,
    stage: 'none',
  },
  {
    id: 'e3',
    name: 'Isha Verma',
    department: 'Marketing',
    pan: '',
    gross: 610000,
    tax: 51200,
    stage: 'none',
  },
  {
    id: 'e4',
    name: 'Arjun Rao',
    department: 'Engineering',
    pan: 'AJKPR1234D',
    gross: 1480000,
    tax: 112400,
    stage: 'none',
  },
  {
    id: 'e5',
    name: 'Neha Sharma',
    department: 'Engineering',
    pan: 'CWSPS5678M',
    gross: 1320000,
    tax: 98600,
    stage: 'none',
  },
  {
    id: 'e6',
    name: 'Rahul Menon',
    department: 'Engineering',
    pan: 'RMNPM2345K',
    gross: 1260000,
    tax: 91800,
    stage: 'none',
  },
  {
    id: 'e7',
    name: 'Jay Kapoor',
    department: 'Engineering',
    pan: 'JKRPK3456L',
    gross: 1180000,
    tax: 84500,
    stage: 'none',
  },
  {
    id: 'e8',
    name: 'Priya Nair',
    department: 'Finance',
    pan: 'PNRPN4567A',
    gross: 960000,
    tax: 61200,
    stage: 'none',
  },
  {
    id: 'e9',
    name: 'Ananya Das',
    department: 'Finance',
    pan: 'ADSPD5678B',
    gross: 900000,
    tax: 56400,
    stage: 'none',
  },
  {
    id: 'e10',
    name: 'Amit Lal',
    department: 'Sales',
    pan: 'DLAPL6789E',
    gross: 780000,
    tax: 54200,
    stage: 'generated',
  },
  {
    id: 'e11',
    name: 'Vikram Singh',
    department: 'Sales',
    pan: 'VSGPS7890F',
    gross: 820000,
    tax: 58700,
    stage: 'generated',
  },
  {
    id: 'e12',
    name: 'Meera S.',
    department: 'HR',
    pan: 'MSRPS8901G',
    gross: 700000,
    tax: 44800,
    stage: 'generated',
  },
  {
    id: 'e13',
    name: 'Karan Patel',
    department: 'Sales',
    pan: 'EKRPP9012G',
    gross: 942000,
    tax: 27768,
    stage: 'shared',
  },
  {
    id: 'e14',
    name: 'Dev Malhotra',
    department: 'Operations',
    pan: 'FDVPM0123H',
    gross: 1050000,
    tax: 73900,
    stage: 'shared',
  },
  {
    id: 'e15',
    name: 'Rohan Shah',
    department: 'Operations',
    pan: 'RSHPR1234J',
    gross: 880000,
    tax: 57600,
    stage: 'shared',
  },
  {
    id: 'e16',
    name: 'Kavya Nair',
    department: 'Finance',
    pan: 'KNRPN2345K',
    gross: 840000,
    tax: 53300,
    stage: 'shared',
  },
  {
    id: 'e17',
    name: 'Lakshmi Iyer',
    department: 'HR',
    pan: 'LIRPL3456M',
    gross: 660000,
    tax: 41500,
    stage: 'shared',
  },
  {
    id: 'e18',
    name: 'Nikhil Joshi',
    department: 'Operations',
    pan: 'NJSPJ4567N',
    gross: 720000,
    tax: 46200,
    stage: 'shared',
  },
];

// Sample data. Replace these records with your API data.
export const initialRecords: Form16Record[] = [
  ...baseEmployees.map(employee => ({
    ...employee,
    id: `${employee.id}-2025-26`,
    fy: '2025-26',
  })),
  ...baseEmployees.map(employee => ({
    ...employee,
    id: `${employee.id}-2024-25`,
    fy: '2024-25',
    pan: employee.pan.length === 10 ? employee.pan : 'ZZZPZ0000Z',
    gross: Math.round(employee.gross * 0.92),
    tax: Math.round(employee.tax * 0.9),
    stage: 'shared' as Stage,
  })),
];

export const formatCurrency = (amount: number) =>
  `${amount.toLocaleString('en-IN')}`;

export const isValidPan = (pan: string) => panPattern.test(pan);

export const maskPan = (pan: string) =>
  isValidPan(pan) ? `${pan.slice(0, 5)}****${pan.slice(9)}` : pan;

export const getStatus = (record: Form16Record): Status => {
  if (!isValidPan(record.pan)) return 'attention';
  if (record.stage === 'shared') return 'shared';
  if (record.stage === 'generated') return 'generated';
  return 'ready';
};

export const getQuarters = (tax: number) => {
  const part = Math.floor(tax / 4);

  return [part, part, part, tax - part * 3];
};

export const getPartB = (record: Form16Record) => ({
  gross: record.gross,
  deduction: standardDeduction,
  taxable: Math.max(record.gross - standardDeduction, 0),
  tax: record.tax,
});

const toPdfText = (text: string) =>
  text
    .replace(/[€“€”]/g, '-')
    .replace(/[^\x20-\x7E]/g, '?')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');

const createPdfBlob = (title: string, lines: string[]) => {
  const commands: string[] = [
    `BT /F1 18 Tf 50 800 Td (${toPdfText(title)}) Tj ET`,
  ];
  let y = 765;

  lines.forEach(line => {
    commands.push(`BT /F2 11 Tf 50 ${y} Td (${toPdfText(line)}) Tj ET`);
    y -= 18;
  });

  const stream = commands.join('\n');
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [5 0 R] /Count 1 >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents 6 0 R >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;

  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach(offset => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: 'application/pdf' });
};

export const downloadForm16 = (record: Form16Record) => {
  const partB = getPartB(record);
  const money = (amount: number) => `Rs ${amount.toLocaleString('en-IN')}`;
  const blob = createPdfBlob(`Form 16 - Financial year ${record.fy}`, [
    `Employee: ${record.name} (${record.department})`,
    `PAN: ${record.pan}`,
    '',
    'Part A - Tax deducted by the company',
    ...getQuarters(record.tax).map(
      (amount, index) => `${quarterNames[index]}: ${money(amount)}`
    ),
    `Total tax deducted: ${money(record.tax)}`,
    '',
    'Part B - Salary and tax',
    `Gross salary: ${money(partB.gross)}`,
    `Standard deduction: ${money(partB.deduction)}`,
    `Taxable income: ${money(partB.taxable)}`,
    `Tax to pay: ${money(partB.tax)}`,
    '',
    'This is a sample file. Replace it with the real certificate from your API.',
  ]);
  const downloadUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');

  downloadLink.href = downloadUrl;
  downloadLink.download = `form16-${record.fy}-${record.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
};
