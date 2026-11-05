import { ReactNode, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  AlertTriangle,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MoreVertical,
  Plus,
  Send,
} from 'lucide-react';
import { toast } from 'sonner';

import { FormField, TanStackTable } from '@/components/common';
import Section from '@/components/common/Section';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { shiftWiseAttendanceDepartmentOptions } from '@/data/reusableDropdownData';

type ShiftId = 'morning' | 'general' | 'evening' | 'night';
type AttendanceStatus =
  | 'present'
  | 'late'
  | 'absent'
  | 'leave'
  | 'notStarted'
  | 'completed';
type StatusFilter = 'all' | AttendanceStatus | 'absentOrLeave';

interface EmployeeAttendance {
  id: string;
  name: string;
  role: string;
  department: string;
  employeeId: string;
  shift: ShiftId;
  checkIn: string;
  checkOut: string;
  worked: string;
  status: AttendanceStatus;
  avatar: string;
}

interface ShiftGroup {
  id: ShiftId;
  label: string;
  hours: string;
  employees: EmployeeAttendance[];
}

const shiftInfo: Record<
  ShiftId,
  { label: string; hours: string; color: string }
> = {
  morning: {
    label: 'Morning',
    hours: '6:00 AM – 2:00 PM',
    color: 'bg-accent',
  },
  general: {
    label: 'General',
    hours: '10:00 AM – 6:00 PM',
    color: 'bg-primary',
  },
  evening: {
    label: 'Evening',
    hours: '2:00 PM – 10:00 PM',
    color: 'bg-secondary-foreground',
  },
  night: {
    label: 'Night',
    hours: '10:00 PM – 6:00 AM',
    color: 'bg-muted-foreground',
  },
};

const shiftProgressColors: Record<ShiftId, string> = {
  morning: 'accent-accent-foreground',
  general: 'accent-primary',
  evening: 'accent-secondary-foreground',
  night: 'accent-muted-foreground',
};

const statusInfo: Record<
  AttendanceStatus,
  { label: string; className: string; dotClassName: string }
> = {
  present: {
    label: 'Present',
    className: 'bg-primary/10 text-primary',
    dotClassName: 'bg-primary',
  },
  late: {
    label: 'Late 21 min',
    className: 'bg-accent text-accent-foreground',
    dotClassName: 'bg-accent-foreground',
  },
  absent: {
    label: 'Absent',
    className: 'bg-destructive/10 text-destructive',
    dotClassName: 'bg-destructive',
  },
  leave: {
    label: 'On leave',
    className: 'bg-secondary text-secondary-foreground',
    dotClassName: 'bg-secondary-foreground',
  },
  notStarted: {
    label: 'Not started',
    className: 'bg-muted text-muted-foreground',
    dotClassName: 'bg-muted-foreground',
  },
  completed: {
    label: 'Completed',
    className: 'bg-primary/10 text-primary',
    dotClassName: 'bg-primary',
  },
};

const initialGroups: ShiftGroup[] = [
  {
    id: 'morning',
    label: shiftInfo.morning.label,
    hours: shiftInfo.morning.hours,
    employees: [
      {
        id: 'emp-1021',
        name: 'Riya Sharma',
        role: 'Sales executive',
        department: 'Sales',
        employeeId: 'EMP-1021',
        shift: 'morning',
        checkIn: '06:02 AM',
        checkOut: '—',
        worked: '4h 28m',
        status: 'present',
        avatar: 'bg-primary text-primary-foreground',
      },
      {
        id: 'emp-1034',
        name: 'Aman Verma',
        role: 'Support agent',
        department: 'Customer Support',
        employeeId: 'EMP-1034',
        shift: 'morning',
        checkIn: '06:21 AM',
        checkOut: '—',
        worked: '4h 09m',
        status: 'late',
        avatar: 'bg-secondary text-secondary-foreground',
      },
      {
        id: 'emp-1047',
        name: 'Neha Kapoor',
        role: 'Recruiter',
        department: 'HR & Admin',
        employeeId: 'EMP-1047',
        shift: 'morning',
        checkIn: '—',
        checkOut: '—',
        worked: '—',
        status: 'absent',
        avatar: 'bg-accent text-accent-foreground',
      },
    ],
  },
  {
    id: 'general',
    label: shiftInfo.general.label,
    hours: shiftInfo.general.hours,
    employees: [
      {
        id: 'emp-1052',
        name: 'Pankaj Singh',
        role: 'Accountant',
        department: 'Finance',
        employeeId: 'EMP-1052',
        shift: 'general',
        checkIn: '09:55 AM',
        checkOut: '—',
        worked: '35m',
        status: 'present',
        avatar: 'bg-muted text-muted-foreground',
      },
      {
        id: 'emp-1068',
        name: 'Sana Mirza',
        role: 'HR executive',
        department: 'HR & Admin',
        employeeId: 'EMP-1068',
        shift: 'general',
        checkIn: '—',
        checkOut: '—',
        worked: '—',
        status: 'leave',
        avatar: 'bg-secondary-foreground text-background',
      },
    ],
  },
  {
    id: 'evening',
    label: shiftInfo.evening.label,
    hours: shiftInfo.evening.hours,
    employees: [
      {
        id: 'emp-1073',
        name: 'Deepak Joshi',
        role: 'Support agent',
        department: 'Customer Support',
        employeeId: 'EMP-1073',
        shift: 'evening',
        checkIn: '—',
        checkOut: '—',
        worked: '—',
        status: 'notStarted',
        avatar: 'bg-accent-foreground text-background',
      },
      {
        id: 'emp-1089',
        name: 'Isha Bansal',
        role: 'Sales executive',
        department: 'Sales',
        employeeId: 'EMP-1089',
        shift: 'evening',
        checkIn: '—',
        checkOut: '—',
        worked: '—',
        status: 'notStarted',
        avatar: 'bg-destructive text-destructive-foreground',
      },
    ],
  },
  {
    id: 'night',
    label: shiftInfo.night.label,
    hours: shiftInfo.night.hours,
    employees: [
      {
        id: 'emp-1095',
        name: 'Karan Rao',
        role: 'Security',
        department: 'Operations',
        employeeId: 'EMP-1095',
        shift: 'night',
        checkIn: '10:01 PM (Tue)',
        checkOut: '06:03 AM',
        worked: '8h 02m',
        status: 'completed',
        avatar: 'bg-muted-foreground text-background',
      },
    ],
  },
];

const referenceDate = new Date(2026, 9, 14);
const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const formatFullDate = (date: Date) =>
  new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
const getWeekDays = (date: Date) => {
  const monday = new Date(date);
  monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + index);
    return day;
  });
};

const formatClock = () =>
  new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());

const ShiftWiseAttendencePage = () => {
  const [groups, setGroups] = useState(initialGroups);
  const [selectedDate, setSelectedDate] = useState(referenceDate);
  const [department, setDepartment] = useState('all');
  const [search, setSearch] = useState('');
  const [shiftFilter] = useState<ShiftId | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [attendanceEmployeeId, setAttendanceEmployeeId] = useState('');
  const [expandedShifts, setExpandedShifts] = useState<ShiftId[]>([
    'morning',
    'general',
    'evening',
    'night',
  ]);

  const employees = useMemo(
    () => groups.flatMap(group => group.employees),
    [groups]
  );
  const visibleGroups = useMemo(() => {
    const query = search.trim().toLowerCase();
    return groups
      .filter(group => shiftFilter === 'all' || group.id === shiftFilter)
      .map(group => ({
        ...group,
        employees: group.employees.filter(employee => {
          const matchesSearch =
            !query ||
            `${employee.name} ${employee.employeeId} ${employee.role}`
              .toLowerCase()
              .includes(query);
          const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'absentOrLeave'
              ? employee.status === 'absent' || employee.status === 'leave'
              : employee.status === statusFilter);
          const matchesDepartment =
            department === 'all' || employee.department === department;
          return matchesSearch && matchesStatus && matchesDepartment;
        }),
      }))
      .filter(group => group.employees.length > 0);
  }, [department, groups, search, shiftFilter, statusFilter]);

  const counts = useMemo(
    () => ({
      present: employees.filter(employee => employee.status === 'present')
        .length,
      late: employees.filter(employee => employee.status === 'late').length,
      absent: employees.filter(
        employee => employee.status === 'absent' || employee.status === 'leave'
      ).length,
      notStarted: employees.filter(employee => employee.status === 'notStarted')
        .length,
    }),
    [employees]
  );

  const attendanceRows = useMemo(
    () =>
      visibleGroups.map(group => ({
        ...group,
        checkedIn: group.employees.filter(employee => employee.checkIn !== '—')
          .length,
        attendancePercent: group.employees.length
          ? (group.employees.filter(employee => employee.checkIn !== '—')
              .length /
              group.employees.length) *
            100
          : 0,
      })),
    [visibleGroups]
  );

  const updateEmployee = (
    employeeId: string,
    update: Partial<EmployeeAttendance>
  ) => {
    setGroups(current =>
      current.map(group => ({
        ...group,
        employees: group.employees.map(employee =>
          employee.id === employeeId ? { ...employee, ...update } : employee
        ),
      }))
    );
  };

  const markPresent = (employee: EmployeeAttendance) => {
    updateEmployee(employee.id, {
      checkIn: formatClock(),
      status: 'present',
      worked: 'Just now',
    });
    toast.success(`${employee.name} marked present.`);
  };

  const handleMarkAttendance = () => {
    const employee = employees.find(
      record => record.status === 'absent' || record.status === 'notStarted'
    );
    if (!employee) {
      toast.info('Everyone scheduled has checked in.');
      return;
    }
    setAttendanceEmployeeId(employee.id);
    setAttendanceDialogOpen(true);
  };

  const markAbsent = (employee: EmployeeAttendance) => {
    updateEmployee(employee.id, {
      checkIn: '—',
      status: 'absent',
      worked: '—',
    });
    toast.success(`${employee.name} marked absent.`);
  };

  const sendReminder = (employee: EmployeeAttendance) =>
    toast.success(`Attendance reminder sent to ${employee.name}.`);

  const checkOut = (employee: EmployeeAttendance) => {
    updateEmployee(employee.id, {
      checkOut: formatClock(),
      status: 'completed',
    });
    toast.success(`${employee.name} checked out.`);
  };

  const columns = useMemo<ColumnDef<(typeof attendanceRows)[number]>[]>(
    () => [
      {
        accessorKey: 'label',
        header: 'Employee',
        cell: ({ row }) => {
          const group = row.original;
          return (
            <div className="flex min-w-[220px] items-center gap-3 py-1">
              <span
                className={`h-3 w-3 shrink-0 rounded-full ${shiftInfo[group.id].color}`}
              />
              <span className="font-semibold text-foreground">
                {group.label} shift
              </span>
              <span className="ml-auto text-xs text-muted-foreground">
                {group.hours}
              </span>
            </div>
          );
        },
      },
      {
        id: 'checkIn',
        header: 'Check in',
        cell: ({ row }) => (
          <progress
            className={`h-2 w-full min-w-24 ${shiftProgressColors[row.original.id]}`}
            value={row.original.attendancePercent}
            max={100}
            aria-label={`${row.original.label} shift attendance`}
          />
        ),
      },
      {
        id: 'checkOut',
        header: 'Check out',
        cell: ({ row }) =>
          row.original.id === 'evening' ? (
            <span className="whitespace-nowrap text-muted-foreground">
              Starts in 3h 30m
            </span>
          ) : row.original.id === 'night' ? (
            <span className="text-muted-foreground">Completed</span>
          ) : null,
      },
      {
        id: 'worked',
        header: 'Worked',
        cell: ({ row }) =>
          row.original.id === 'night' ? (
            <span className="whitespace-nowrap font-medium">
              {row.original.checkedIn} of {row.original.employees.length}{' '}
              completed
            </span>
          ) : (
            <span className="whitespace-nowrap font-medium">
              {row.original.checkedIn} of {row.original.employees.length}{' '}
              checked in
            </span>
          ),
      },
      { id: 'status', header: 'Status', cell: () => null },
      {
        id: 'actions',
        header: 'Action',
        enableSorting: false,
        cell: ({ row }) => {
          const isExpanded = expandedShifts.includes(row.original.id);
          return (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${row.original.label} shift`}
              aria-expanded={isExpanded}
              onClick={() =>
                setExpandedShifts(current =>
                  isExpanded
                    ? current.filter(id => id !== row.original.id)
                    : [...current, row.original.id]
                )
              }
            >
              <ChevronDown
                className={`transition-transform ${isExpanded ? '' : '-rotate-90'}`}
              />
            </Button>
          );
        },
      },
    ],
    [expandedShifts]
  );

  const renderEmployees = (row: (typeof attendanceRows)[number]) => (
    <div className="divide-y divide-border">
      {row.employees.map(employee => {
        const status = statusInfo[employee.status];
        const action =
          employee.status === 'present' || employee.status === 'late'
            ? {
                label: 'Check out',
                onClick: () => checkOut(employee),
                variant: 'outline' as const,
              }
            : employee.status === 'absent' || employee.status === 'notStarted'
              ? {
                  label: 'Mark present',
                  onClick: () => markPresent(employee),
                  variant: 'outline' as const,
                }
              : employee.status === 'leave'
                ? {
                    label: 'View leave',
                    onClick: () => toast.info(`${employee.name} is on leave.`),
                    variant: 'outline' as const,
                  }
                : {
                    label: 'View',
                    onClick: () =>
                      toast.info(`${employee.name}'s shift is complete.`),
                    variant: 'outline' as const,
                  };

        return (
          <div
            key={employee.id}
            className="grid grid-cols-1 items-center gap-3 px-4 py-3 text-sm sm:grid-cols-2 lg:grid-cols-7"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${employee.avatar}`}
              >
                {employee.name
                  .split(' ')
                  .map(part => part[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-semibold text-foreground">
                  {employee.name}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {employee.role} · {employee.employeeId}
                </span>
              </span>
            </div>
            <span className="whitespace-nowrap text-muted-foreground">
              {employee.checkIn}
            </span>
            <span className="whitespace-nowrap text-muted-foreground">
              {employee.checkOut}
            </span>
            <span className="whitespace-nowrap text-muted-foreground">
              {employee.worked}
            </span>
            <span
              className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
            >
              <span className={`h-2 w-2 rounded-full ${status.dotClassName}`} />
              {status.label}
            </span>
            <Button
              type="button"
              variant={action.variant}
              size="sm"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`More actions for ${employee.name}`}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {employee.status !== 'absent' &&
                  employee.status !== 'leave' &&
                  employee.status !== 'completed' && (
                    <DropdownMenuItem onSelect={() => markAbsent(employee)}>
                      Mark absent
                    </DropdownMenuItem>
                  )}
                {employee.status === 'absent' && (
                  <DropdownMenuItem onSelect={() => markPresent(employee)}>
                    Mark present
                  </DropdownMenuItem>
                )}
                {employee.status !== 'leave' &&
                  employee.status !== 'completed' && (
                    <DropdownMenuItem onSelect={() => sendReminder(employee)}>
                      Send reminder
                    </DropdownMenuItem>
                  )}
                <DropdownMenuItem
                  onSelect={() =>
                    toast.info(
                      `${employee.name} · ${employee.department} · ${shiftInfo[employee.shift].label} shift`
                    )
                  }
                >
                  View details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      })}
    </div>
  );

  const weekDays = getWeekDays(selectedDate);

  return (
    <>
      <Section
        title="Shift wise attendance"
        menuId="shift-wise-attendence"
        showBreadcrumbs
      >
        <div className="space-y-5 p-4 md:p-0">
          <Card className="flex flex-wrap items-center justify-between gap-4 p-3 md:px-5">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Previous day"
                onClick={() =>
                  setSelectedDate(
                    current =>
                      new Date(
                        current.getFullYear(),
                        current.getMonth(),
                        current.getDate() - 1
                      )
                  )
                }
              >
                <ChevronLeft />
              </Button>
              <div className="min-w-36">
                <p className="text-xs text-muted-foreground">
                  {formatFullDate(selectedDate).split(' ')[0]}
                </p>
                <p className="font-semibold text-foreground">
                  {formatFullDate(selectedDate).replace(/^\S+\s/, '')}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedDate(referenceDate)}
              >
                <CalendarDays /> Today
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Next day"
                onClick={() =>
                  setSelectedDate(
                    current =>
                      new Date(
                        current.getFullYear(),
                        current.getMonth(),
                        current.getDate() + 1
                      )
                  )
                }
              >
                <ChevronRight />
              </Button>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {weekDays.map(day => {
                const isSelected = dateKey(day) === dateKey(selectedDate);
                return (
                  <Button
                    key={dateKey(day)}
                    type="button"
                    variant={isSelected ? 'default' : 'outline'}
                    className="h-14 min-w-16 flex-col gap-0"
                    onClick={() => setSelectedDate(day)}
                  >
                    <span className="text-xs opacity-80">
                      {new Intl.DateTimeFormat('en-US', {
                        weekday: 'short',
                      }).format(day)}
                    </span>
                    <span className="font-semibold">{day.getDate()}</span>
                  </Button>
                );
              })}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Live ·
              updated just now
            </div>
          </Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <FormField
                label="Search employees"
                name="attendance-search"
                value={search}
                onChange={setSearch}
                placeholder="Search name or employee ID"
              />

              <FormField
                label="Department"
                name="attendance-department"
                type="select"
                value={department}
                onChange={setDepartment}
                options={[
                  ...shiftWiseAttendanceDepartmentOptions,
                  ...Array.from(
                    new Set(employees.map(employee => employee.department))
                  ).map(name => ({ label: name, value: name })),
                ]}
              />
            </div>
            <div className="ml-auto grid w-full grid-cols-1 gap-3 sm:w-auto">
              {employees.some(employee => employee.status === 'absent') && (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const employee = employees.find(
                        record => record.status === 'absent'
                      );
                      if (employee) sendReminder(employee);
                    }}
                  >
                    <Send /> Send reminder
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      const employee = employees.find(
                        record => record.status === 'absent'
                      );
                      if (employee) markAbsent(employee);
                    }}
                  >
                    Mark absent
                  </Button>

                  <Button type="button" onClick={handleMarkAttendance}>
                    <Plus /> Mark attendance
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              label="Present"
              count={counts.present}
              total={employees.length}
              color="primary"
              icon={<Check className="h-5 w-5" />}
              active={statusFilter === 'present'}
              onClick={() =>
                setStatusFilter(statusFilter === 'present' ? 'all' : 'present')
              }
            />
            <SummaryCard
              label="Late"
              count={counts.late}
              total={employees.length}
              color="accent"
              icon={<Clock3 className="h-5 w-5" />}
              active={statusFilter === 'late'}
              onClick={() =>
                setStatusFilter(statusFilter === 'late' ? 'all' : 'late')
              }
            />
            <SummaryCard
              label="Absent / on leave"
              count={counts.absent}
              total={employees.length}
              color="destructive"
              icon={<AlertTriangle className="h-5 w-5" />}
              active={statusFilter === 'absentOrLeave'}
              onClick={() =>
                setStatusFilter(
                  statusFilter === 'absentOrLeave' ? 'all' : 'absentOrLeave'
                )
              }
            />
            <SummaryCard
              label="Yet to start"
              count={counts.notStarted}
              total={employees.length}
              color="muted"
              icon={<Clock3 className="h-5 w-5" />}
              active={statusFilter === 'notStarted'}
              onClick={() =>
                setStatusFilter(
                  statusFilter === 'notStarted' ? 'all' : 'notStarted'
                )
              }
            />
          </div>

          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <h2 className="font-semibold text-foreground">
                  Attendance by shift
                </h2>
                <p className="text-sm text-muted-foreground">
                  {employees.length} employees scheduled today
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  setExpandedShifts(current =>
                    current.length === visibleGroups.length
                      ? []
                      : visibleGroups.map(group => group.id)
                  )
                }
              >
                {expandedShifts.length === visibleGroups.length
                  ? 'Collapse shifts'
                  : 'Expand shifts'}{' '}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <TanStackTable
              data={attendanceRows}
              columns={columns}
              showDownload={true}
              enableSearch={false}
              enableSorting={false}
              enablePagination={false}
              hideFooter
              getRowId={row => row.id}
              renderExpandedRow={row => renderEmployees(row.original)}
              isRowExpanded={row => expandedShifts.includes(row.original.id)}
              emptyMessage="No attendance records match these filters."
              footerContent={
                <div className="flex flex-wrap justify-between gap-2 border-t border-border px-5 py-4 text-sm text-muted-foreground">
                  <span>
                    Showing{' '}
                    {visibleGroups.reduce(
                      (total, group) => total + group.employees.length,
                      0
                    )}{' '}
                    of {employees.length} employees
                  </span>
                  <span>
                    Tip: click a card or shift chip to filter the list
                  </span>
                </div>
              }
            />
          </Card>
        </div>
        <Dialog
          open={attendanceDialogOpen}
          onOpenChange={setAttendanceDialogOpen}
        >
          <DialogContent onInteractOutside={event => event.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Mark attendance</DialogTitle>
              <DialogDescription>
                Select an employee to record attendance for{' '}
                {formatFullDate(selectedDate)}.
              </DialogDescription>
            </DialogHeader>
            <FormField
              label="Employee"
              name="attendance-employee"
              type="select"
              value={attendanceEmployeeId}
              onChange={setAttendanceEmployeeId}
              options={employees.map(employee => ({
                label: `${employee.name} · ${employee.employeeId}`,
                value: employee.id,
              }))}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAttendanceDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={!attendanceEmployeeId}
                onClick={() => {
                  const employee = employees.find(
                    record => record.id === attendanceEmployeeId
                  );
                  if (employee) markPresent(employee);
                  setAttendanceDialogOpen(false);
                }}
              >
                Mark present
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>
    </>
  );
};

const SummaryCard = ({
  label,
  count,
  total,
  color,
  icon,
  active,
  onClick,
}: {
  label: string;
  count: number;
  total: number;
  color: 'primary' | 'accent' | 'destructive' | 'muted';
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
}) => {
  const colors = {
    primary: {
      icon: 'bg-primary/10 text-primary',
      bar: 'accent-primary',
    },
    accent: {
      icon: 'bg-accent text-accent-foreground',
      bar: 'accent-accent-foreground',
    },
    destructive: {
      icon: 'bg-destructive/10 text-destructive',
      bar: 'accent-destructive',
    },
    muted: {
      icon: 'bg-muted text-muted-foreground',
      bar: 'accent-muted-foreground',
    },
  }[color];
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <Card
      className={`p-4 transition-colors ${active ? 'border-primary ring-1 ring-primary' : ''}`}
    >
      <Button
        type="button"
        variant="ghost"
        className="h-auto w-full justify-start p-0 text-left hover:bg-transparent"
        aria-pressed={active}
        onClick={onClick}
      >
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors.icon}`}
        >
          {icon}
        </span>
        <span className="ml-3 min-w-0 flex-1">
          <span className="flex items-center justify-between gap-2">
            <span className="truncate text-sm font-medium text-muted-foreground">
              {label}
            </span>
            <span className="whitespace-nowrap text-xs text-muted-foreground">
              {percent}% of {total}
            </span>
          </span>
          <span className="block text-2xl font-bold text-foreground">
            {count}
          </span>
        </span>
      </Button>
      <progress
        className={`mt-3 h-1.5 w-full overflow-hidden rounded-full ${colors.bar}`}
        value={percent}
        max={100}
        aria-label={`${label}: ${percent}% of ${total}`}
      />
    </Card>
  );
};

export default ShiftWiseAttendencePage;
