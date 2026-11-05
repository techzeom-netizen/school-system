export type LeaveType =
  | 'Casual leave'
  | 'Sick leave'
  | 'Earned leave'
  | 'Half day';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';
export type Period = 'month' | 'quarter' | 'year';
export type ReportTab =
  | 'everyone'
  | 'low-balance'
  | 'on-leave-today'
  | 'pending';
export type ExportFormat = 'excel' | 'pdf';

export interface Employee {
  id: string;
  name: string;
  department: string;
}

export interface LeaveRecord {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
}

export interface Anchor {
  year: number;
  month: number;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface ReportRow {
  employee: Employee;
  taken: number;
  balance: number;
  latest: LeaveRecord | null;
  onLeaveToday: boolean;
  pendingCount: number;
  types: LeaveType[];
}

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

export const yearlyAllowance = 16;
export const lowBalanceLimit = 2;

export const typeAllowance: Record<Exclude<LeaveType, 'Half day'>, number> = {
  'Casual leave': 6,
  'Sick leave': 5,
  'Earned leave': 5,
};

export const employees: Employee[] = [
  { id: 'e1', name: 'Sneha Iyer', department: 'Marketing' },
  { id: 'e2', name: 'Arjun Rao', department: 'Engineering' },
  { id: 'e3', name: 'Neha Sharma', department: 'Engineering' },
  { id: 'e4', name: 'Amit Lal', department: 'Sales' },
  { id: 'e5', name: 'Karan Patel', department: 'Sales' },
  { id: 'e6', name: 'Pooja Rao', department: 'HR' },
  { id: 'e7', name: 'Dev Malhotra', department: 'Operations' },
  { id: 'e8', name: 'Priya Nair', department: 'Finance' },
  { id: 'e9', name: 'Rahul Menon', department: 'Engineering' },
  { id: 'e10', name: 'Ananya Das', department: 'Finance' },
  { id: 'e11', name: 'Meera S.', department: 'HR' },
  { id: 'e12', name: 'Jay Kapoor', department: 'Engineering' },
  { id: 'e13', name: 'Vikram Singh', department: 'Sales' },
  { id: 'e14', name: 'Isha Verma', department: 'Marketing' },
  { id: 'e15', name: 'Siddharth Rao', department: 'Engineering' },
  { id: 'e16', name: 'Lakshmi Iyer', department: 'HR' },
  { id: 'e17', name: 'Nikhil Joshi', department: 'Operations' },
];

export const createLeave = (
  id: string,
  employeeId: string,
  type: LeaveType,
  startDate: string,
  endDate: string,
  status: LeaveStatus = 'approved'
): LeaveRecord => ({ id, employeeId, type, startDate, endDate, status });

export const periodOptions: { value: Period; label: string }[] = [
  { value: 'month', label: 'Month' },
  { value: 'quarter', label: 'Quarter' },
  { value: 'year', label: 'Year' },
];

export const tabOptions: { value: ReportTab; label: string }[] = [
  { value: 'everyone', label: 'Everyone' },
  { value: 'low-balance', label: 'Low balance' },
  { value: 'on-leave-today', label: 'On leave today' },
  { value: 'pending', label: 'Waiting for approval' },
];

export const exportFormats: { value: ExportFormat; label: string }[] = [
  { value: 'excel', label: 'Excel (.xlsx)' },
  { value: 'pdf', label: 'PDF' },
];

export const leaveTypeStyles: Record<LeaveType, string> = {
  'Casual leave': 'bg-primary/10 text-primary',
  'Sick leave': 'bg-destructive/10 text-destructive',
  'Earned leave': 'bg-muted text-foreground',
  'Half day': 'bg-muted text-foreground',
};

export const typeSliceColors: Record<LeaveType, string> = {
  'Casual leave': 'text-primary',
  'Sick leave': 'text-destructive',
  'Earned leave': 'text-primary/50',
  'Half day': 'text-muted-foreground',
};

export const departmentSliceColors = [
  'text-primary',
  'text-primary/80',
  'text-primary/60',
  'text-primary/40',
  'text-primary/25',
  'text-muted-foreground',
];

export const chartCircumference = 2 * Math.PI * 42;

export const toIso = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${date.getFullYear()}-${month}-${day}`;
};

export const fromIso = (iso: string) => new Date(`${iso}T00:00:00`);

export const createInitialLeaves = (): LeaveRecord[] => {
  const now = new Date();
  const year = now.getFullYear();
  const offset = (days: number) =>
    toIso(new Date(year, now.getMonth(), now.getDate() + days));
  const fixed = (month: number, day: number) =>
    toIso(new Date(year, month - 1, day));

  return [
    createLeave('l1', 'e1', 'Half day', offset(0), offset(0)),
    createLeave('l2', 'e1', 'Earned leave', fixed(2, 2), fixed(2, 6)),
    createLeave('l3', 'e1', 'Sick leave', fixed(3, 9), fixed(3, 13)),
    createLeave('l4', 'e1', 'Casual leave', fixed(6, 8), fixed(6, 11)),
    createLeave('l5', 'e2', 'Sick leave', offset(-1), offset(0)),
    createLeave('l6', 'e2', 'Casual leave', fixed(9, 28), fixed(9, 28)),
    createLeave('l7', 'e2', 'Earned leave', fixed(8, 11), fixed(8, 12)),
    createLeave('l8', 'e2', 'Casual leave', fixed(6, 3), fixed(6, 3)),
    createLeave('l9', 'e2', 'Sick leave', fixed(4, 15), fixed(4, 17)),
    createLeave('l10', 'e2', 'Earned leave', fixed(2, 2), fixed(2, 6)),
    createLeave('l11', 'e3', 'Casual leave', offset(-2), offset(1)),
    createLeave('l12', 'e3', 'Earned leave', fixed(3, 2), fixed(3, 4)),
    createLeave('l13', 'e3', 'Sick leave', fixed(7, 6), fixed(7, 8)),
    createLeave('l14', 'e4', 'Casual leave', offset(-9), offset(-8)),
    createLeave('l15', 'e4', 'Earned leave', fixed(8, 3), fixed(8, 7)),
    createLeave('l16', 'e5', 'Casual leave', offset(0), offset(1)),
    createLeave('l17', 'e5', 'Casual leave', fixed(1, 12), fixed(1, 12)),
    createLeave('l18', 'e5', 'Sick leave', fixed(5, 4), fixed(5, 6)),
    createLeave('l19', 'e6', 'Sick leave', offset(-7), offset(-6)),
    createLeave('l20', 'e6', 'Casual leave', fixed(4, 20), fixed(4, 21)),
    createLeave('l21', 'e7', 'Earned leave', offset(0), offset(2)),
    createLeave('l22', 'e7', 'Earned leave', fixed(7, 20), fixed(7, 22)),
    createLeave('l23', 'e8', 'Casual leave', fixed(9, 8), fixed(9, 8)),
    createLeave('l24', 'e9', 'Earned leave', fixed(6, 1), fixed(6, 5)),
    createLeave('l25', 'e9', 'Sick leave', fixed(9, 15), fixed(9, 16)),
    createLeave('l26', 'e10', 'Casual leave', fixed(3, 10), fixed(3, 12)),
    createLeave('l27', 'e10', 'Sick leave', fixed(8, 24), fixed(8, 28)),
    createLeave('l28', 'e11', 'Sick leave', fixed(9, 22), fixed(9, 22)),
    createLeave('l29', 'e11', 'Earned leave', fixed(1, 20), fixed(1, 23)),
    createLeave('l30', 'e11', 'Sick leave', fixed(3, 16), fixed(3, 20)),
    createLeave('l31', 'e11', 'Casual leave', fixed(6, 15), fixed(6, 19)),
    createLeave('l32', 'e12', 'Casual leave', fixed(2, 9), fixed(2, 10)),
    createLeave('l33', 'e14', 'Earned leave', fixed(8, 17), fixed(8, 21)),
    createLeave('l34', 'e9', 'Casual leave', offset(7), offset(8)),
    createLeave('l35', 'e12', 'Earned leave', offset(8), offset(9)),
    createLeave('l36', 'e13', 'Casual leave', offset(7), offset(7)),
    createLeave('l37', 'e14', 'Earned leave', offset(6), offset(10)),
    createLeave('p1', 'e8', 'Casual leave', offset(7), offset(9), 'pending'),
    createLeave('p2', 'e15', 'Sick leave', offset(2), offset(2), 'pending'),
    createLeave('p3', 'e16', 'Earned leave', offset(12), offset(14), 'pending'),
    createLeave('p4', 'e17', 'Casual leave', offset(15), offset(16), 'pending'),
  ];
};

export const formatShort = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(
    fromIso(iso)
  );

export const formatRange = (start: string, end: string) => {
  if (start === end) return formatShort(start);

  const first = fromIso(start);
  const last = fromIso(end);

  if (
    first.getMonth() === last.getMonth() &&
    first.getFullYear() === last.getFullYear()
  ) {
    return `${first.getDate()} - ${formatShort(end)}`;
  }

  return `${formatShort(start)}  ${formatShort(end)}`;
};

export const formatDays = (days: number) =>
  days === 0 ? '' : `${days} ${days === 1 ? 'day' : 'days'}`;

export const getInitials = (name: string) =>
  name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const getDayCount = (start: string, end: string) =>
  Math.round((fromIso(end).getTime() - fromIso(start).getTime()) / 86400000) +
  1;

export const getLeaveDays = (leave: LeaveRecord) =>
  leave.type === 'Half day' ? 0.5 : getDayCount(leave.startDate, leave.endDate);

export const getDaysInRange = (leave: LeaveRecord, range: DateRange) => {
  if (leave.type === 'Half day') {
    return range.start <= leave.startDate && leave.startDate <= range.end
      ? 0.5
      : 0;
  }

  const start = leave.startDate > range.start ? leave.startDate : range.start;
  const end = leave.endDate < range.end ? leave.endDate : range.end;

  return start <= end ? getDayCount(start, end) : 0;
};

export const getRange = (period: Period, anchor: Anchor): DateRange => {
  if (period === 'year') {
    return {
      start: toIso(new Date(anchor.year, 0, 1)),
      end: toIso(new Date(anchor.year, 11, 31)),
    };
  }

  const length = period === 'quarter' ? 3 : 1;
  const startMonth =
    period === 'quarter' ? Math.floor(anchor.month / 3) * 3 : anchor.month;

  return {
    start: toIso(new Date(anchor.year, startMonth, 1)),
    end: toIso(new Date(anchor.year, startMonth + length, 0)),
  };
};

export const shiftAnchor = (
  period: Period,
  anchor: Anchor,
  step: number
): Anchor => {
  const monthStep =
    period === 'month' ? step : period === 'quarter' ? step * 3 : step * 12;
  const next = new Date(anchor.year, anchor.month + monthStep, 1);

  return { year: next.getFullYear(), month: next.getMonth() };
};

export const getPeriodLabel = (period: Period, anchor: Anchor) => {
  if (period === 'year') return String(anchor.year);

  const formatMonth = (monthIndex: number, style: 'long' | 'short') =>
    new Intl.DateTimeFormat('en-GB', { month: style }).format(
      new Date(anchor.year, monthIndex, 1)
    );

  if (period === 'month') {
    return `${formatMonth(anchor.month, 'long')} ${anchor.year}`;
  }

  const startMonth = Math.floor(anchor.month / 3) * 3;

  return `${formatMonth(startMonth, 'short')} ${formatMonth(startMonth + 2, 'short')} ${anchor.year}`;
};

export const isOnLeave = (leave: LeaveRecord, iso: string) =>
  leave.startDate <= iso && iso <= leave.endDate;

export const downloadBlob = (fileName: string, blob: Blob) => {
  const downloadUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');

  downloadLink.href = downloadUrl;
  downloadLink.download = fileName;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
};

export const downloadCsv = (fileName: string, rows: (string | number)[][]) => {
  const csvContent = rows
    .map(row =>
      row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')
    )
    .join('\n');

  downloadBlob(
    fileName,
    new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
  );
};

export const toPdfText = (text: string) =>
  text
    .replace(/[^]/g, '-')
    .replace(/[^\x20-\x7E]/g, '?')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');

export const createPdfBlob = (title: string, lines: string[]) => {
  const linesPerPage = 42;
  const pages: string[][] = [];

  for (let index = 0; index < lines.length; index += linesPerPage) {
    pages.push(lines.slice(index, index + linesPerPage));
  }
  if (pages.length === 0) pages.push([]);

  const pageIds = pages.map((_, index) => 5 + index * 2);
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    `<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];

  pages.forEach((pageLines, index) => {
    const commands: string[] = [];
    let y = 800;

    if (index === 0) {
      commands.push(`BT /F1 18 Tf 50 ${y} Td (${toPdfText(title)}) Tj ET`);
      y -= 30;
    }
    pageLines.forEach(line => {
      commands.push(`BT /F2 10 Tf 50 ${y} Td (${toPdfText(line)}) Tj ET`);
      y -= 16;
    });

    const stream = commands.join('\n');

    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${pageIds[index] + 1} 0 R >>`
    );
    objects.push(
      `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`
    );
  });

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

export const getClashCount = (leave: LeaveRecord, allLeaves: LeaveRecord[]) => {
  let busiest = 0;

  for (
    const day = fromIso(leave.startDate);
    day <= fromIso(leave.endDate);
    day.setDate(day.getDate() + 1)
  ) {
    const iso = toIso(day);

    busiest = Math.max(
      busiest,
      allLeaves.filter(
        other =>
          other.status === 'approved' &&
          other.id !== leave.id &&
          isOnLeave(other, iso)
      ).length
    );
  }

  return busiest;
};

export const buildRows = (
  scope: Employee[],
  reportRange: DateRange,
  allLeaves: LeaveRecord[],
  todayIso: string
): ReportRow[] => {
  const balanceYear = reportRange.end.slice(0, 4);

  return scope
    .map(employee => {
      const own = allLeaves.filter(leave => leave.employeeId === employee.id);
      const approved = own.filter(leave => leave.status === 'approved');
      const yearTaken = approved
        .filter(leave => leave.startDate.slice(0, 4) === balanceYear)
        .reduce((sum, leave) => sum + getLeaveDays(leave), 0);
      const latest =
        approved
          .filter(leave => leave.startDate <= reportRange.end)
          .sort((first, second) =>
            second.startDate.localeCompare(first.startDate)
          )[0] ?? null;

      return {
        employee,
        taken: approved.reduce(
          (sum, leave) => sum + getDaysInRange(leave, reportRange),
          0
        ),
        balance: Math.max(yearlyAllowance - yearTaken, 0),
        latest,
        onLeaveToday: approved.some(leave => isOnLeave(leave, todayIso)),
        pendingCount: own.filter(leave => leave.status === 'pending').length,
        types: [
          ...new Set(
            approved
              .filter(leave => getDaysInRange(leave, reportRange) > 0)
              .map(leave => leave.type)
          ),
        ],
      };
    })
    .sort(
      (first, second) =>
        first.balance - second.balance ||
        first.employee.name.localeCompare(second.employee.name)
    );
};
