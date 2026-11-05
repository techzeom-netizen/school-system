import { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  FileText,
  XCircle,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TanStackTable from '@/components/common/TanStackTable';
import Section from '@/components/common/Section';
import FormField from '@/components/common/FormField';
import type { ColumnDef } from '@tanstack/react-table';

interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string;
  hr: string;
  status: 'Present' | 'Absent' | 'Leave' | 'Late' | 'Half Day';
  remarks: string;
}

type DayStatus =
  | 'present'
  | 'absent'
  | 'leave'
  | 'late'
  | 'weekend'
  | 'holiday'
  | 'empty';

interface CalendarDay {
  date: number;
  status: DayStatus;
  isCurrentMonth: boolean;
  isSelected?: boolean;
}

const mockTableData: AttendanceRecord[] = [
  {
    id: '1',
    date: '2026-10-01',
    checkIn: '09:00 AM',
    checkOut: '06:00 PM',
    hr: '9h 0m',
    status: 'Present',
    remarks: '-',
  },
  {
    id: '2',
    date: '2026-10-02',
    checkIn: '09:15 AM',
    checkOut: '06:00 PM',
    hr: '8h 45m',
    status: 'Late',
    remarks: 'Traffic delay',
  },
  {
    id: '3',
    date: '2026-10-05',
    checkIn: '09:02 AM',
    checkOut: '06:05 PM',
    hr: '9h 3m',
    status: 'Present',
    remarks: '-',
  },
  {
    id: '4',
    date: '2026-10-06',
    checkIn: '09:00 AM',
    checkOut: '01:00 PM',
    hr: '4h 0m',
    status: 'Half Day',
    remarks: 'Doctor appointment',
  },
  {
    id: '5',
    date: '2026-10-07',
    checkIn: '-',
    checkOut: '-',
    hr: '0h 0m',
    status: 'Leave',
    remarks: 'Sick Leave',
  },
  {
    id: '6',
    date: '2026-10-08',
    checkIn: '10:00 AM',
    checkOut: '-',
    hr: '0h 0m',
    status: 'Present',
    remarks: 'Checked In',
  },
];

const MyAttendence = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1));
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-30');
  const [activeFilter, setActiveFilter] = useState('Last month');

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: CalendarDay[] = [];

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        date: daysInPrevMonth - i,
        status: 'weekend',
        isCurrentMonth: false,
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      let status: DayStatus = 'present';
      const dayOfWeek = new Date(year, month, i).getDay();

      const isFuture =
        year > todayYear ||
        (year === todayYear && month > todayMonth) ||
        (year === todayYear && month === todayMonth && i > todayDate);

      if (isFuture) {
        status = 'empty';
      } else {
        if (dayOfWeek === 0 || dayOfWeek === 6) status = 'weekend';
        else if (i === 2) status = 'late';
        else if (i === 5) status = 'absent';
        else if (i === 20) status = 'holiday';
        else if (i === 7) status = 'leave';
      }

      days.push({
        date: i,
        status,
        isCurrentMonth: true,
        isSelected: i === 8 && month === 9 && year === 2026,
      });
    }

    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({ date: i, status: 'weekend', isCurrentMonth: false });
    }

    return days;
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const currentMonthName = currentDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const columns: ColumnDef<AttendanceRecord>[] = useMemo(
    () => [
      { accessorKey: 'date', header: 'Date' },
      { accessorKey: 'checkIn', header: 'Check In' },
      { accessorKey: 'checkOut', header: 'Check Out' },
      { accessorKey: 'hr', header: 'Hr' },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;

          let colorClass =
            'text-muted-foreground bg-muted dark:text-foreground dark:bg-muted';
          if (status === 'Present')
            colorClass =
              'text-primary bg-primary/10 dark:text-primary dark:bg-primary/10';
          if (status === 'Absent')
            colorClass =
              'text-destructive bg-destructive/10 dark:text-destructive dark:bg-destructive/10';
          if (status === 'Late')
            colorClass =
              'text-secondary-foreground bg-secondary dark:text-secondary-foreground dark:bg-secondary';
          if (status === 'Leave')
            colorClass =
              'text-primary bg-primary/10 dark:text-primary dark:bg-primary/10';
          if (status === 'Half Day')
            colorClass =
              'text-secondary-foreground bg-secondary dark:text-secondary-foreground dark:bg-secondary';

          return (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${colorClass}`}
            >
              {status}
            </span>
          );
        },
      },
      { accessorKey: 'remarks', header: 'Remarks' },
    ],
    []
  );

  const statusCards = [
    {
      label: 'Not checked in',
      value: '0',
      subtitle: 'Today',
      icon: Clock,
      color: 'text-primary dark:text-primary',
      bg: 'bg-primary/10 dark:bg-primary/10',
      border: 'border-primary/30 dark:border-primary/30',
    },
    {
      label: 'Present',
      value: '1',
      subtitle: '',
      icon: CheckCircle2,
      color: 'text-primary dark:text-primary',
      bg: 'bg-primary/10 dark:bg-primary/10',
      border: 'border-primary/30 dark:border-primary/30',
    },
    {
      label: 'On leave',
      value: '0',
      subtitle: '0 full - 0 half',
      icon: FileText,
      color: 'text-primary dark:text-primary',
      bg: 'bg-primary/10 dark:bg-primary/10',
      border: 'border-primary/30 dark:border-primary/30',
    },
    {
      label: 'Absent',
      value: '0',
      subtitle: '',
      icon: XCircle,
      color: 'text-destructive dark:text-destructive',
      bg: 'bg-destructive/10 dark:bg-destructive/10',
      border: 'border-destructive/30 dark:border-destructive/30',
    },
    {
      label: 'Late',
      value: '0',
      subtitle: '',
      icon: AlertCircle,
      color: 'text-secondary-foreground dark:text-secondary-foreground',
      bg: 'bg-secondary dark:bg-secondary',
      border: 'border-border dark:border-border',
    },
    {
      label: 'Avg hours',
      value: '0.0h',
      subtitle: '',
      icon: TrendingUp,
      color: 'text-primary dark:text-primary',
      bg: 'bg-primary/10 dark:bg-primary/10',
      border: 'border-primary/30 dark:border-primary/30',
    },
  ];

  const getStatusColor = (status: DayStatus) => {
    switch (status) {
      case 'present':
        return 'bg-primary/10 text-primary border-primary/30 dark:bg-primary/10 dark:text-primary dark:border-primary/30';
      case 'absent':
        return 'bg-destructive/10 text-destructive border-destructive/30 dark:bg-destructive/10 dark:text-destructive dark:border-destructive/30';
      case 'leave':
        return 'bg-primary/10 text-primary border-primary/30 dark:bg-primary/10 dark:text-primary dark:border-primary/30';
      case 'late':
        return 'bg-secondary text-secondary-foreground border-border dark:bg-secondary dark:text-secondary-foreground dark:border-border';
      case 'holiday':
        return 'bg-secondary text-secondary-foreground border-border dark:bg-secondary dark:text-secondary-foreground dark:border-border';
      case 'weekend':
        return 'bg-muted text-muted-foreground dark:bg-muted/50 dark:text-muted-foreground';
      case 'empty':
        return 'bg-card text-foreground dark:bg-card dark:text-foreground';
      default:
        return 'bg-card text-foreground dark:bg-card dark:text-foreground';
    }
  };

  return (
    <>
      <Section title="My Attendance" menuId="my-attendeance" showBreadcrumbs>
        <div className="w-full space-y-6 p-3 sm:p-4 lg:p-6">
          <div className="grid w-full grid-cols-1 items-stretch gap-4 sm:gap-6 lg:grid-cols-2">
            <div className="min-w-0">
              <Card className="h-full overflow-hidden rounded-xl border border-border bg-card shadow-sm dark:border-border dark:bg-card">
                <div className="p-4 sm:p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <Button
                      variant="default"
                      size="icon"
                      className="h-8 w-8 dark:border-border dark:text-foreground"
                      onClick={handlePrevMonth}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="font-semibold text-foreground dark:text-foreground">
                      {currentMonthName}
                    </span>
                    <Button
                      variant="default"
                      size="icon"
                      className="h-8 w-8 dark:border-border dark:text-foreground"
                      onClick={handleNextMonth}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  {/* Calendar Grid */}
                  <div className="mb-1 grid grid-cols-7 gap-1.5 text-center">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                      day => (
                        <div
                          key={day}
                          className="py-1 text-xs font-medium text-muted-foreground dark:text-muted-foreground"
                        >
                          {day}
                        </div>
                      )
                    )}
                    {calendarDays.map((day, idx) => (
                      <div
                        key={idx}
                        className={`
                        relative flex h-10 flex-col items-center justify-center rounded-md border text-sm transition-colors hover:border-border dark:hover:border-border
                        ${!day.isCurrentMonth ? 'opacity-30' : ''}
                        ${day.isSelected ? 'ring-2 ring-primary/30 ring-offset-1 ring-offset-background border-transparent z-10' : ''}
                        ${getStatusColor(day.status)}
                      `}
                      >
                        <span>{day.date}</span>
                        {day.status === 'present' && (
                          <span className="text-[8px] font-bold mt-0.5">P</span>
                        )}
                        {day.status === 'absent' && (
                          <span className="text-[8px] font-bold mt-0.5">A</span>
                        )}
                        {day.status === 'late' && (
                          <span className="text-[8px] font-bold mt-0.5">H</span>
                        )}
                        {day.status === 'leave' && (
                          <span className="text-[8px] font-bold mt-0.5">L</span>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Legend */}
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground dark:text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>{' '}
                      Present
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-destructive"></span>{' '}
                      Absent
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>{' '}
                      Leave
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>{' '}
                      Late
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-muted dark:bg-muted"></span>{' '}
                      Weekend
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>{' '}
                      Holiday
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex min-w-0 flex-col gap-4">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {statusCards.map((card, idx) => (
                  <div
                    key={idx}
                    className={`flex min-h-28 flex-col items-center justify-center rounded-lg border p-3 text-center transition-shadow hover:shadow-sm ${card.border} ${card.bg}`}
                  >
                    <card.icon className={`${card.color} mb-2`} size={18} />
                    <span
                      className={`text-lg font-bold ${card.color} leading-none`}
                    >
                      {card.value}
                    </span>
                    <span className={`mt-1 text-xs font-medium ${card.color}`}>
                      {card.label}
                    </span>
                    {card.subtitle && (
                      <span className="mt-1 text-[10px] text-muted-foreground dark:text-muted-foreground">
                        {card.subtitle}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-border bg-card p-4 shadow-sm dark:border-border dark:bg-card">
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="min-w-0">
                      <FormField
                        label="Start date"
                        name="attendance-start-date"
                        type="date"
                        value={startDate}
                        onChange={setStartDate}
                        className="text-xs"
                      />
                    </div>
                    <div className="min-w-0">
                      <FormField
                        label="End date"
                        name="attendance-end-date"
                        type="date"
                        value={endDate}
                        onChange={setEndDate}
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-start gap-2">
                    {['Today', 'This week', 'This month', 'Last month'].map(
                      filter => (
                        <Button
                          key={filter}
                          variant={
                            activeFilter === filter ? 'default' : 'outline'
                          }
                          size="sm"
                          onClick={() => setActiveFilter(filter)}
                          className="h-8 px-3 text-xs"
                        >
                          {filter}
                        </Button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <TanStackTable<AttendanceRecord>
              data={mockTableData}
              columns={columns}
              enableSearch={true}
              enableSorting={false}
              enableColumnVisibility={true}
              enablePagination={true}
              showDownload={true}
              searchPlaceholder="Search records..."
              pageSize={10}
              emptyMessage="No attendance records found for this period."
            />
          </div>
        </div>
      </Section>
    </>
  );
};

export default MyAttendence;
