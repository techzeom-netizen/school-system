export type PayslipStatus = 'ready' | 'fix' | 'sent';
export type FixReason = 'bank' | 'attendance' | 'pan';

export interface PayslipRecord {
  id: string;
  name: string;
  department: string;
  month: string;
  gross: number;
  tds: number;
  status: PayslipStatus;
  fixReason: FixReason | null;
  sentOn: string | null;
}

export interface FixForm {
  account: string;
  ifsc: string;
  pan: string;
  checked: boolean;
}

export const visibleCount = 6;

export const fixReasons: Record<FixReason, { label: string; hint: string }> = {
  bank: {
    label: 'Bank account is missing',
    hint: 'Add it to send the payslip',
  },
  attendance: {
    label: 'Attendance is not approved',
    hint: 'Check it to send the payslip',
  },
  pan: { label: 'PAN is missing', hint: 'Add it to send the payslip' },
};

export const todayIso = () => new Date().toLocaleDateString('en-CA');

const toDate = (iso: string) => new Date(`${iso}T00:00:00`);

export const formatDate = (iso: string | null) =>
  iso
    ? toDate(iso).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';

export const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString('en-IN')}`;

export const formatMonth = (key: string) =>
  new Date(`${key}-01T00:00:00`).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });

export const getLines = (record: PayslipRecord) => {
  const basic = Math.round(record.gross * 0.4);
  const hra = Math.round(basic * 0.5);
  const special = record.gross - basic - hra;
  const pf = Math.round((basic * 12) / 100);
  const professionalTax = 200;
  const deductions = pf + professionalTax + record.tds;

  return {
    earnings: [
      { label: 'Basic pay', amount: basic },
      { label: 'House rent (HRA)', amount: hra },
      { label: 'Special allowance', amount: special },
    ],
    deductionLines: [
      { label: 'Provident fund (PF)', amount: pf },
      { label: 'Professional tax', amount: professionalTax },
      { label: 'Income tax', amount: record.tds },
    ],
    gross: record.gross,
    deductions,
    net: record.gross - deductions,
  };
};

export const getNet = (record: PayslipRecord) => getLines(record).net;

export const buildPayslipCsv = (record: PayslipRecord) => {
  const lines = getLines(record);
  const rows: [string, string | number][] = [
    ['Employee', record.name],
    ['Department', record.department],
    ['Month', formatMonth(record.month)],
    ...lines.earnings.map(
      item => [item.label, item.amount] as [string, number]
    ),
    ['Total pay', lines.gross],
    ...lines.deductionLines.map(
      item => [item.label, -item.amount] as [string, number]
    ),
    ['Total deductions', -lines.deductions],
    ['Take-home pay', lines.net],
  ];

  return rows
    .map(([label, value]) =>
      [label, value]
        .map(item => `"${String(item).replace(/"/g, '""')}"`)
        .join(',')
    )
    .join('\n');
};

export const downloadFile = (content: string, fileName: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
};
