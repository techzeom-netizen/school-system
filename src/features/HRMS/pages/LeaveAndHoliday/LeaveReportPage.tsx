import { type FormEvent, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  AlertTriangle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Info,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { TanStackTable } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  type Anchor,
  type DonutSlice,
  type Employee,
  type ExportFormat,
  type LeaveRecord,
  type LeaveType,
  type Period,
  type ReportRow,
  type ReportTab,
  departmentSliceColors,
  createInitialLeaves,
  downloadBlob,
  downloadCsv,
  exportFormats,
  formatDays,
  formatRange,
  getClashCount,
  getDaysInRange,
  getInitials,
  getLeaveDays,
  getPeriodLabel,
  getRange,
  shiftAnchor,
  typeAllowance,
  typeSliceColors,
  leaveTypeStyles,
  lowBalanceLimit,
  periodOptions,
  tabOptions,
  toIso,
  createPdfBlob,
  employees,
  buildRows,
  yearlyAllowance,
} from './leave-reports/leaveReportData';
import { LeaveBreakdownCard } from './leave-reports/LeaveReportComponents';

const createReportColumns = ({
  onView,
  onReview,
}: {
  onView: (employee: Employee) => void;
  onReview: (employee: Employee) => void;
}): ColumnDef<ReportRow>[] => [
  {
    id: 'employee',
    header: 'Employee',
    accessorFn: row => row.employee.name,
    cell: ({ row }) => (
      <div className="flex min-w-44 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
          {getInitials(row.original.employee.name)}
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-foreground">
            {row.original.employee.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {row.original.employee.department}
          </p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'taken',
    header: 'Taken',
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-foreground">
        {formatDays(row.original.taken)}
      </span>
    ),
  },
  {
    accessorKey: 'balance',
    header: 'Balance left',
    cell: ({ row }) => (
      <div className="flex min-w-44 flex-wrap items-center gap-2">
        <span className="whitespace-nowrap text-sm">
          <span className="font-semibold text-foreground">
            {row.original.balance}
          </span>{' '}
          <span className="text-muted-foreground">
            of {yearlyAllowance} days left
          </span>
        </span>
        {row.original.balance <= lowBalanceLimit && (
          <Badge
            variant="secondary"
            className="border-transparent bg-destructive/10 text-destructive"
          >
            Low
          </Badge>
        )}
      </div>
    ),
  },
  {
    id: 'latest',
    header: 'Latest leave',
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex min-w-48 flex-wrap items-center gap-2 text-sm">
        {row.original.latest ? (
          <span className="text-foreground">
            {row.original.latest.type} ·{' '}
            {formatRange(
              row.original.latest.startDate,
              row.original.latest.endDate
            )}
          </span>
        ) : (
          <span className="text-muted-foreground">No leave yet</span>
        )}
        {row.original.onLeaveToday && (
          <Badge
            variant="secondary"
            className="border-transparent bg-primary/10 text-primary"
          >
            On leave today
          </Badge>
        )}
      </div>
    ),
  },
  {
    id: 'actions',
    header: 'Details',
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          aria-label={`View leave details for ${row.original.employee.name}`}
          onClick={() => onView(row.original.employee)}
        >
          View
        </Button>
        {row.original.pendingCount > 0 && (
          <Button
            type="button"
            size="sm"
            aria-label={`Review leave requests from ${row.original.employee.name}`}
            onClick={() => onReview(row.original.employee)}
          >
            Review
          </Button>
        )}
      </div>
    ),
  },
];

const LeaveReportPage = () => {
  const todayIso = toIso(new Date());
  const [leaves, setLeaves] = useState(createInitialLeaves);
  const [period, setPeriod] = useState<Period>('month');
  const [anchor, setAnchor] = useState<Anchor>(() => {
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  });
  const [department, setDepartment] = useState('all');
  const [tab, setTab] = useState<ReportTab>('everyone');
  const [query] = useState('');
  const [typeFilter, setTypeFilter] = useState<LeaveType | null>(null);

  const [isRequestsOpen, setIsRequestsOpen] = useState(false);
  const [requestsEmployeeId, setRequestsEmployeeId] = useState<string | null>(
    null
  );

  const [detailEmployee, setDetailEmployee] = useState<Employee | null>(null);

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportPeriod, setExportPeriod] = useState<Period>('month');
  const [exportDepartment, setExportDepartment] = useState('all');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('excel');
  const [exportBalance, setExportBalance] = useState(true);
  const [exportPending, setExportPending] = useState(false);

  const departmentOptions = useMemo(
    () => [
      { value: 'all', label: 'All departments' },
      ...[...new Set(employees.map(employee => employee.department))]
        .sort()
        .map(value => ({ value, label: value })),
    ],
    []
  );
  const periodSelectOptions = periodOptions.map(option => ({
    value: option.value,
    label: `${option.label} (${getPeriodLabel(option.value, anchor)})`,
  }));

  const range = useMemo(() => getRange(period, anchor), [anchor, period]);
  const previousRange = useMemo(
    () => getRange(period, shiftAnchor(period, anchor, -1)),
    [anchor, period]
  );
  const periodLabel = getPeriodLabel(period, anchor);

  const scopedEmployees = useMemo(
    () =>
      employees.filter(
        employee => department === 'all' || employee.department === department
      ),
    [department]
  );

  const rows = useMemo(
    () => buildRows(scopedEmployees, range, leaves, todayIso),
    [leaves, range, scopedEmployees, todayIso]
  );

  const tabCounts: Record<ReportTab, number> = {
    everyone: rows.length,
    'low-balance': rows.filter(row => row.balance <= lowBalanceLimit).length,
    'on-leave-today': rows.filter(row => row.onLeaveToday).length,
    pending: rows.filter(row => row.pendingCount > 0).length,
  };

  const visibleRows = useMemo(() => {
    const search = query.trim().toLowerCase();

    return rows.filter(row => {
      const matchesTab =
        tab === 'everyone' ||
        (tab === 'low-balance' && row.balance <= lowBalanceLimit) ||
        (tab === 'on-leave-today' && row.onLeaveToday) ||
        (tab === 'pending' && row.pendingCount > 0);

      return (
        matchesTab &&
        (!typeFilter || row.types.includes(typeFilter)) &&
        (!search || row.employee.name.toLowerCase().includes(search))
      );
    });
  }, [query, rows, tab, typeFilter]);

  const scopedIds = useMemo(
    () => new Set(scopedEmployees.map(employee => employee.id)),
    [scopedEmployees]
  );
  const approvedInScope = useMemo(
    () =>
      leaves.filter(
        leave => leave.status === 'approved' && scopedIds.has(leave.employeeId)
      ),
    [leaves, scopedIds]
  );

  const summary = useMemo(() => {
    const byType = new Map<LeaveType, number>();
    const byDepartment = new Map<string, number>();
    const people = new Set<string>();
    let total = 0;

    approvedInScope.forEach(leave => {
      const days = getDaysInRange(leave, range);
      if (days === 0) return;

      const employee = employees.find(item => item.id === leave.employeeId);

      total += days;
      people.add(leave.employeeId);
      byType.set(leave.type, (byType.get(leave.type) ?? 0) + days);
      if (employee) {
        byDepartment.set(
          employee.department,
          (byDepartment.get(employee.department) ?? 0) + days
        );
      }
    });

    const previousTotal = approvedInScope.reduce(
      (sum, leave) => sum + getDaysInRange(leave, previousRange),
      0
    );

    return { total, byType, byDepartment, people: people.size, previousTotal };
  }, [approvedInScope, previousRange, range]);

  const changePercent =
    summary.previousTotal > 0
      ? Math.round(
          ((summary.total - summary.previousTotal) / summary.previousTotal) *
            100
        )
      : null;
  const changeText =
    changePercent === null
      ? 'No data for the previous period'
      : changePercent === 0
        ? `Same as the previous ${period}`
        : `${Math.abs(changePercent)}% ${changePercent > 0 ? 'more' : 'less'} than the previous ${period}`;

  const typeSlices: DonutSlice[] = (
    ['Casual leave', 'Sick leave', 'Earned leave', 'Half day'] as LeaveType[]
  ).map(type => ({
    label: type,
    value: summary.byType.get(type) ?? 0,
    color: typeSliceColors[type],
  }));
  const departmentSlices: DonutSlice[] = [...summary.byDepartment.entries()]
    .sort((first, second) => second[1] - first[1])
    .map(([label, value], index) => ({
      label,
      value,
      color:
        departmentSliceColors[
          Math.min(index, departmentSliceColors.length - 1)
        ],
    }));
  const topType = [...typeSlices].sort(
    (first, second) => second.value - first.value
  )[0];
  const topDepartment = departmentSlices[0];

  const pendingTotal = leaves.filter(
    leave => leave.status === 'pending' && scopedIds.has(leave.employeeId)
  ).length;

  const openRequests = (employeeId: string | null) => {
    setRequestsEmployeeId(employeeId);
    setIsRequestsOpen(true);
  };

  const closeRequests = () => {
    setIsRequestsOpen(false);
    setRequestsEmployeeId(null);
  };

  const requestList = leaves
    .filter(
      leave =>
        leave.status === 'pending' &&
        scopedIds.has(leave.employeeId) &&
        (!requestsEmployeeId || leave.employeeId === requestsEmployeeId)
    )
    .sort((first, second) => first.startDate.localeCompare(second.startDate));

  const decideRequest = (
    leave: LeaveRecord,
    status: 'approved' | 'rejected'
  ) => {
    const employee = employees.find(item => item.id === leave.employeeId);

    setLeaves(currentLeaves =>
      currentLeaves.map(item =>
        item.id === leave.id ? { ...item, status } : item
      )
    );
    toast.success(`${employee?.name ?? 'Employee'}'s leave ${status}.`);
  };

  const handleTypeSlice = (label: string) => {
    setTypeFilter(current => (current === label ? null : (label as LeaveType)));
  };

  const handleDepartmentSlice = (label: string) => {
    setDepartment(current => (current === label ? 'all' : label));
  };

  const goToToday = () => {
    const now = new Date();

    setAnchor({ year: now.getFullYear(), month: now.getMonth() });
  };

  const reportColumns = useMemo(
    () =>
      createReportColumns({
        onView: setDetailEmployee,
        onReview: employee => openRequests(employee.id),
      }),
    []
  );

  const detailLeaves = detailEmployee
    ? leaves
        .filter(
          leave =>
            leave.employeeId === detailEmployee.id &&
            leave.status === 'approved' &&
            leave.startDate.slice(0, 4) === range.end.slice(0, 4)
        )
        .sort((first, second) =>
          second.startDate.localeCompare(first.startDate)
        )
    : [];
  const detailLeaveColumns = useMemo<ColumnDef<LeaveRecord>[]>(
    () => [
      {
        accessorKey: 'startDate',
        header: 'Dates',
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-foreground">
            {formatRange(row.original.startDate, row.original.endDate)}
          </span>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Leave type',
        cell: ({ row }) => (
          <Badge
            variant="secondary"
            className={cn(
              'border-transparent',
              leaveTypeStyles[row.original.type]
            )}
          >
            {row.original.type}
          </Badge>
        ),
      },
      {
        id: 'days',
        header: 'Days',
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-right font-semibold text-foreground">
            {formatDays(getLeaveDays(row.original))}
          </span>
        ),
      },
    ],
    []
  );
  const detailTaken = detailLeaves.reduce(
    (sum, leave) => sum + getLeaveDays(leave),
    0
  );
  const detailBalanceByType = (
    Object.keys(typeAllowance) as (keyof typeof typeAllowance)[]
  ).map(type => {
    const used = detailLeaves
      .filter(
        leave =>
          leave.type === type ||
          (type === 'Casual leave' && leave.type === 'Half day')
      )
      .reduce((sum, leave) => sum + getLeaveDays(leave), 0);

    return { type, left: Math.max(typeAllowance[type] - used, 0) };
  });

  const changePeriod = (step: number) => {
    setAnchor(current => shiftAnchor(period, current, step));
  };

  const closeExportDialog = () => {
    setIsExportOpen(false);
    setExportPeriod(period);
    setExportDepartment(department);
    setExportFormat('excel');
    setExportBalance(true);
    setExportPending(false);
  };

  const handleExport = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const exportRange = getRange(exportPeriod, anchor);
    const exportScope = employees.filter(
      employee =>
        exportDepartment === 'all' || employee.department === exportDepartment
    );
    const exportRows = buildRows(exportScope, exportRange, leaves, todayIso);
    const exportLabel = getPeriodLabel(exportPeriod, anchor);
    const fileName = `leave-report-${exportLabel.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;

    if (exportFormat === 'pdf') {
      downloadBlob(
        `${fileName}.pdf`,
        createPdfBlob(
          `Leave report - ${exportLabel}`,
          exportRows.map(row =>
            [
              `${row.employee.name} (${row.employee.department})`,
              `Taken: ${row.taken}`,
              exportBalance ? `Balance: ${row.balance}` : '',
              exportPending ? `Waiting: ${row.pendingCount}` : '',
            ]
              .filter(Boolean)
              .join('  |  ')
          )
        )
      );
    } else {
      const header = ['Employee', 'Department', 'Days taken'];

      if (exportBalance) header.push('Balance left');
      if (exportPending) header.push('Waiting requests');

      downloadCsv(`${fileName}.csv`, [
        header,
        ...exportRows.map(row => {
          const line: (string | number)[] = [
            row.employee.name,
            row.employee.department,
            row.taken,
          ];

          if (exportBalance) line.push(row.balance);
          if (exportPending) line.push(row.pendingCount);
          return line;
        }),
      ]);
    }

    toast.success('Leave report downloaded.');
    closeExportDialog();
  };

  const downloadEmployeeLeaves = () => {
    if (!detailEmployee) return;

    downloadCsv(
      `leave-${detailEmployee.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.csv`,
      [
        ['Employee', 'Leave type', 'From', 'To', 'Days'],
        ...detailLeaves.map(leave => [
          detailEmployee.name,
          leave.type,
          leave.startDate,
          leave.endDate,
          getLeaveDays(leave),
        ]),
      ]
    );
  };

  return (
    <>
      <Section title="Leave report" menuId="leave-reports" showBreadcrumbs>
        <div className="space-y-5">
          <div className="flex flex-wrap items-end gap-3">
            <div
              role="group"
              aria-label="Report period"
              className="flex overflow-hidden rounded-lg border border-border"
            >
              {periodOptions.map(option => (
                <Button
                  key={option.value}
                  type="button"
                  variant={period === option.value ? 'default' : 'ghost'}
                  className="rounded-none"
                  aria-pressed={period === option.value}
                  onClick={() => setPeriod(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <div className="flex items-center overflow-hidden rounded-lg border border-border bg-card">
              <Button
                type="button"
                variant="default"
                size="icon"
                aria-label={`Previous ${period}`}
                onClick={() => changePeriod(-1)}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
              <span className="min-w-40 px-3 text-center text-sm font-semibold text-foreground">
                {periodLabel}
              </span>
              <Button
                type="button"
                variant="default"
                size="icon"
                aria-label={`Next ${period}`}
                onClick={() => changePeriod(1)}
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <Button type="button" variant="outline" onClick={goToToday}>
              Today
            </Button>
            <div className="min-w-48 sm:ml-auto">
              <FormField
                label="Show"
                name="report-department"
                type="select"
                value={department}
                onChange={setDepartment}
                options={departmentOptions}
              />
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-primary/10 p-3 text-sm text-foreground">
            <Info
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <span>
              <span className="font-semibold">{periodLabel} at a glance:</span>{' '}
              {summary.people} of {scopedEmployees.length} employees took leave,{' '}
              {summary.total} days in total. {changeText}.
              {topType && topType.value > 0
                ? ` ${topType.label} was used the most.`
                : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Card className="flex items-center gap-3 border-border p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarDays className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">Leave taken</p>
                <p className="text-xl font-semibold text-card-foreground">
                  {summary.total} days
                </p>
                <p className="text-xs text-muted-foreground">{changeText}</p>
              </div>
            </Card>
            <Card className="flex items-center gap-3 border-border p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">
                  People who took leave
                </p>
                <p className="text-xl font-semibold text-card-foreground">
                  {summary.people}
                </p>
                <p className="text-xs text-muted-foreground">
                  out of {scopedEmployees.length} employees
                </p>
              </div>
            </Card>
            <Card className="flex items-center gap-3 border-border p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock3 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">On leave today</p>
                <p className="text-xl font-semibold text-card-foreground">
                  {tabCounts['on-leave-today']}
                </p>
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-xs"
                  onClick={() => setTab('on-leave-today')}
                >
                  See who
                </Button>
              </div>
            </Card>
            <Card className="space-y-2 border-border bg-muted/40 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <AlertTriangle
                  className="h-4 w-4 text-destructive"
                  aria-hidden="true"
                />
                Needs your attention
              </p>
              <div className="flex items-center justify-between gap-2 text-sm">
                <span>{pendingTotal} leave requests are waiting</span>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => openRequests(null)}
                >
                  Review
                </Button>
              </div>
              <div className="flex items-center justify-between gap-2 text-sm">
                <span>
                  {tabCounts['low-balance']} people have {lowBalanceLimit} or
                  fewer days left
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setTab('low-balance')}
                >
                  Show
                </Button>
              </div>
            </Card>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <LeaveBreakdownCard
              title="Which kind of leave?"
              subtitle={`Days taken in ${periodLabel}. Tap a row to filter the table.`}
              slices={typeSlices}
              total={summary.total}
              activeLabel={typeFilter}
              onSliceClick={handleTypeSlice}
              insight={
                topType && topType.value > 0
                  ? `${topType.label} was used the most (${Math.round((topType.value / summary.total) * 100)}%).`
                  : ''
              }
            />
            <LeaveBreakdownCard
              title="Which teams took leave?"
              subtitle={`Days taken in ${periodLabel}. Tap a row to see one team.`}
              slices={departmentSlices}
              total={summary.total}
              activeLabel={department === 'all' ? null : department}
              onSliceClick={handleDepartmentSlice}
              insight={
                topDepartment
                  ? `${topDepartment.label} took the most leave (${Math.round((topDepartment.value / summary.total) * 100)}%).`
                  : ''
              }
            />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">
              Leave by employee
            </h2>
          </div>

          {(typeFilter || department !== 'all') && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted-foreground">Showing:</span>
              {department !== 'all' && (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="rounded-full"
                  aria-label={`Clear ${department} filter`}
                  onClick={() => setDepartment('all')}
                >
                  {department} •
                </Button>
              )}
              {typeFilter && (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="rounded-full"
                  aria-label={`Clear ${typeFilter} filter`}
                  onClick={() => setTypeFilter(null)}
                >
                  {typeFilter} •
                </Button>
              )}
            </div>
          )}

          <TanStackTable
            data={visibleRows}
            columns={reportColumns}
            enableSearch={true}
            showDownload={true}
            enableColumnVisibility={false}
            enablePagination
            pageSize={8}
            pageSizeOptions={[8, 10, 20]}
            getRowId={row => row.employee.id}
            emptyMessage="No employees match these filters."
            customFilters={
              <div className="space-y-3">
                <div
                  role="group"
                  aria-label="Employee filter"
                  className="flex flex-wrap gap-2"
                >
                  {tabOptions.map(option => (
                    <Button
                      key={option.value}
                      type="button"
                      size="lg"
                      className="rounded-md"
                      variant={tab === option.value ? 'default' : 'outline'}
                      aria-pressed={tab === option.value}
                      onClick={() => setTab(option.value)}
                    >
                      {option.label} {tabCounts[option.value]}
                    </Button>
                  ))}
                </div>
              </div>
            }
          />
        </div>
      </Section>

      <Dialog
        open={Boolean(detailEmployee)}
        onOpenChange={open => !open && setDetailEmployee(null)}
      >
        <DialogContent
          className="max-h-[92vh] overflow-y-auto sm:max-w-xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {detailEmployee?.name} · {detailEmployee?.department}
            </DialogTitle>
            <DialogDescription>
              Leave taken in {range.end.slice(0, 4)}
            </DialogDescription>
          </DialogHeader>

          {detailEmployee && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-muted/60 p-3">
                  <p className="text-sm font-medium">Taken this year</p>
                  <p className="text-xl font-semibold ">{detailTaken} days</p>
                  <p className="text-xs font-medium">
                    {detailLeaves.length} leaves
                  </p>
                </div>
                <div className="rounded-lg bg-muted/60 p-3">
                  <p className="text-sm font-medium">Balance left</p>
                  <p className="text-xl font-semibold ">
                    {Math.max(yearlyAllowance - detailTaken, 0)} days
                  </p>
                  <p className="text-xs font-medium">
                    out of {yearlyAllowance} days
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-foreground">
                  Balance by type
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {detailBalanceByType.map(item => (
                    <div
                      key={item.type}
                      className="rounded-lg border border-border p-3"
                    >
                      <p className="text-sm font-medium">{item.type}</p>
                      <p
                        className={cn(
                          'font-semibold',
                          item.left === 0
                            ? 'text-destructive'
                            : 'text-destructive'
                        )}
                      >
                        {item.left} {item.left === 1 ? 'day' : 'days'} left
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  Leaves taken
                </p>
                <TanStackTable
                  data={detailLeaves}
                  columns={detailLeaveColumns}
                  enableSearch={false}
                  enableSorting={false}
                  enablePagination={false}
                  hideFooter
                  getRowId={leave => leave.id}
                  emptyMessage="No leave taken this year."
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:justify-between">
            <Button
              type="button"
              variant="default"
              onClick={downloadEmployeeLeaves}
            >
              Download
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => setDetailEmployee(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isRequestsOpen}
        onOpenChange={open => !open && closeRequests()}
      >
        <DialogContent
          className="max-h-[92vh] overflow-y-auto sm:max-w-xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Leave requests</DialogTitle>
            <DialogDescription>
              {requestList.length === 0
                ? 'Nothing is waiting for you.'
                : `${requestList.length} ${requestList.length === 1 ? 'request is' : 'requests are'} waiting for your decision.`}
            </DialogDescription>
          </DialogHeader>

          {requestList.length === 0 ? (
            <p className="rounded-lg bg-muted/60 p-4 text-center text-sm text-muted-foreground">
              You are all caught up.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {requestList.map(leave => {
                const employee = employees.find(
                  item => item.id === leave.employeeId
                );
                const clash = getClashCount(leave, leaves);

                return (
                  <div key={leave.id} className="space-y-3 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                        {getInitials(employee?.name ?? '?')}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {employee?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {employee?.department} ·{' '}
                          {formatRange(leave.startDate, leave.endDate)} (
                          {formatDays(getLeaveDays(leave))})
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn(
                          'whitespace-nowrap border-transparent',
                          leaveTypeStyles[leave.type]
                        )}
                      >
                        {leave.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {clash === 0
                        ? 'Nobody else is out on these days.'
                        : `${clash} ${clash === 1 ? 'person is' : 'people are'} already out on these days.`}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="xs"
                        variant="success"
                        onClick={() => decideRequest(leave, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button
                        type="button"
                        size="xs"
                        variant="ghost"
                        className="text-destructive hover:text-destructive "
                        onClick={() => decideRequest(leave, 'rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <DialogFooter>
            <Button type="button" onClick={closeRequests}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isExportOpen}
        onOpenChange={open => !open && closeExportDialog()}
      >
        <DialogContent
          className="sm:max-w-lg"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Export leave report</DialogTitle>
            <DialogDescription>Choose what to include.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleExport} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Period"
                name="export-period"
                type="select"
                value={exportPeriod}
                onChange={value => {
                  if (periodOptions.some(option => option.value === value)) {
                    setExportPeriod(value as Period);
                  }
                }}
                options={periodSelectOptions}
              />
              <FormField
                label="Department"
                name="export-department"
                type="select"
                value={exportDepartment}
                onChange={setExportDepartment}
                options={departmentOptions}
              />
              <div className="sm:col-span-2">
                <FormField
                  label="File type"
                  name="export-format"
                  type="radio"
                  value={exportFormat}
                  onChange={value => {
                    if (exportFormats.some(option => option.value === value)) {
                      setExportFormat(value as ExportFormat);
                    }
                  }}
                  options={exportFormats}
                />
              </div>
              <FormField
                label="Include leave balance"
                name="export-balance"
                type="checkbox"
                value={exportBalance}
                onCheckboxChange={setExportBalance}
                className="rounded-lg border border-border bg-muted/40 p-3"
              />
              <FormField
                label="Include waiting requests"
                name="export-pending"
                type="checkbox"
                value={exportPending}
                onCheckboxChange={setExportPending}
                className="rounded-lg border border-border bg-muted/40 p-3"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={closeExportDialog}
              >
                Cancel
              </Button>
              <Button type="submit">
                <Download className="h-4 w-4" aria-hidden="true" />
                Export report
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeaveReportPage;
