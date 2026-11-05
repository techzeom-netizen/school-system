import { type FormEvent, useMemo, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  shiftMasterColorOptions,
  shiftMasterFilterOptions,
  shiftMasterTimeOptions,
} from '@/data/reusableDropdownData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type ShiftColor = 'primary' | 'secondary' | 'accent' | 'muted' | 'destructive';

type ShiftFilter = 'all' | 'active' | 'inactive';

interface ShiftItem {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  graceMinutes: number;
  workingDays: boolean[];
  employeeCount: number;
  employeeInitials: string[];
  color: ShiftColor;
  isActive: boolean;
}

const shiftColorStyles: Record<
  ShiftColor,
  { bg: string; stroke: string; tint: string; chip: string }
> = {
  primary: {
    bg: 'bg-primary',
    stroke: 'stroke-primary',
    tint: 'bg-primary/10',
    chip: 'bg-primary/10 text-primary',
  },
  secondary: {
    bg: 'bg-secondary-foreground',
    stroke: 'stroke-secondary-foreground',
    tint: 'bg-secondary',
    chip: 'bg-secondary text-secondary-foreground',
  },
  accent: {
    bg: 'bg-accent-foreground',
    stroke: 'stroke-accent-foreground',
    tint: 'bg-accent',
    chip: 'bg-accent text-accent-foreground',
  },
  muted: {
    bg: 'bg-muted-foreground',
    stroke: 'stroke-muted-foreground',
    tint: 'bg-muted',
    chip: 'bg-muted text-foreground',
  },
  destructive: {
    bg: 'bg-destructive',
    stroke: 'stroke-destructive',
    tint: 'bg-destructive/10',
    chip: 'bg-destructive/10 text-destructive',
  },
};

const shiftWeekDays = [
  { short: 'M', label: 'Monday' },
  { short: 'T', label: 'Tuesday' },
  { short: 'W', label: 'Wednesday' },
  { short: 'T', label: 'Thursday' },
  { short: 'F', label: 'Friday' },
  { short: 'S', label: 'Saturday' },
  { short: 'S', label: 'Sunday' },
];

const shiftTimelineTicks = ['12 AM', '6 AM', '12 PM', '6 PM', '12 AM'];

const initialShifts: ShiftItem[] = [
  {
    id: 'shift-1',
    name: 'General Shift',
    startTime: '09:00',
    endTime: '18:00',
    breakMinutes: 60,
    graceMinutes: 15,
    workingDays: [true, true, true, true, true, false, false],
    employeeCount: 48,
    employeeInitials: ['AM', 'PN', 'RI'],
    color: 'primary',
    isActive: true,
  },
  {
    id: 'shift-2',
    name: 'Morning Shift',
    startTime: '06:00',
    endTime: '14:00',
    breakMinutes: 30,
    graceMinutes: 10,
    workingDays: [true, true, true, true, true, true, false],
    employeeCount: 22,
    employeeInitials: ['KR', 'SR', 'NK'],
    color: 'secondary',
    isActive: true,
  },
  {
    id: 'shift-3',
    name: 'Afternoon Shift',
    startTime: '14:00',
    endTime: '22:00',
    breakMinutes: 30,
    graceMinutes: 10,
    workingDays: [true, true, true, true, true, true, false],
    employeeCount: 18,
    employeeInitials: ['IV', 'AD', 'MJ'],
    color: 'accent',
    isActive: true,
  },
  {
    id: 'shift-4',
    name: 'Night Shift',
    startTime: '22:00',
    endTime: '06:00',
    breakMinutes: 45,
    graceMinutes: 15,
    workingDays: [true, true, true, true, true, false, false],
    employeeCount: 12,
    employeeInitials: ['VS', 'RP', 'TM'],
    color: 'muted',
    isActive: true,
  },
  {
    id: 'shift-5',
    name: 'Weekend Support',
    startTime: '10:00',
    endTime: '16:00',
    breakMinutes: 30,
    graceMinutes: 10,
    workingDays: [false, false, false, false, false, true, true],
    employeeCount: 6,
    employeeInitials: ['LS', 'MK', 'DN'],
    color: 'destructive',
    isActive: true,
  },
  {
    id: 'shift-6',
    name: 'Half Day Shift',
    startTime: '09:00',
    endTime: '13:00',
    breakMinutes: 0,
    graceMinutes: 10,
    workingDays: [true, true, true, true, true, false, false],
    employeeCount: 0,
    employeeInitials: [],
    color: 'primary',
    isActive: false,
  },
];

interface ShiftForm {
  name: string;
  startTime: string;
  endTime: string;
  breakMinutes: string;
  graceMinutes: string;
  workingDays: boolean[];
  color: ShiftColor;
}

const emptyForm: ShiftForm = {
  name: '',
  startTime: '09:00',
  endTime: '18:00',
  breakMinutes: '60',
  graceMinutes: '15',
  workingDays: [true, true, true, true, true, false, false],
  color: 'primary',
};

const MINUTES_IN_DAY = 24 * 60;
const minNameLength = 3;
const maxGraceMinutes = 120;

const DONUT_RADIUS = 70;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;
const DONUT_SEGMENT_GAP = 3;

const pluralize = (count: number, singular: string, plural = `${singular}s`) =>
  count === 1 ? singular : plural;

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const formatTime = (time: string) => {
  const minutes = toMinutes(time);
  const hours = Math.floor(minutes / 60);
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const paddedMinutes = String(minutes % 60).padStart(2, '0');
  return `${hour12}:${paddedMinutes} ${hours >= 12 ? 'PM' : 'AM'}`;
};

const formatTimeRange = (shift: ShiftItem) =>
  `${formatTime(shift.startTime)} – ${formatTime(shift.endTime)}`;

const getShiftMinutes = (startTime: string, endTime: string) =>
  (toMinutes(endTime) - toMinutes(startTime) + MINUTES_IN_DAY) % MINUTES_IN_DAY;

const isOvernight = (shift: ShiftItem) =>
  toMinutes(shift.endTime) <= toMinutes(shift.startTime);

const formatDuration = (shift: ShiftItem) => {
  const hours = getShiftMinutes(shift.startTime, shift.endTime) / 60;
  const length = Number.isInteger(hours)
    ? `${hours} hrs`
    : `${hours.toFixed(1)} hrs`;
  const breakText =
    shift.breakMinutes > 0 ? `${shift.breakMinutes} min break` : 'no break';
  return `${length} · ${breakText} · ${shift.graceMinutes} min grace`;
};

const getTimelineBars = (shift: ShiftItem) => {
  const start = toMinutes(shift.startTime);
  const end = toMinutes(shift.endTime);
  const toBar = (from: number, to: number) => ({
    left: (from / MINUTES_IN_DAY) * 100,
    width: ((to - from) / MINUTES_IN_DAY) * 100,
  });
  return end > start
    ? [toBar(start, end)]
    : [toBar(start, MINUTES_IN_DAY), toBar(0, end)];
};

const parseWholeNumber = (value: string): number | null => {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  const number = Number(trimmed);
  return Number.isInteger(number) && number >= 0 ? number : null;
};

const isShiftColor = (value: string): value is ShiftColor =>
  shiftMasterColorOptions.some(option => option.value === value);

const isShiftFilter = (value: string): value is ShiftFilter =>
  shiftMasterFilterOptions.some(option => option.value === value);

const ShiftSwitch = ({
  isOn,
  label,
  onToggle,
}: {
  isOn: boolean;
  label: string;
  onToggle: () => void;
}) => (
  <Button
    type="button"
    role="switch"
    aria-checked={isOn}
    aria-label={label}
    variant="ghost"
    onClick={onToggle}
    className={`relative h-auto w-auto  rounded-full transition-colors hover:text-inherit focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
      isOn
        ? 'bg-primary hover:bg-primary/90'
        : 'bg-muted-foreground/30 hover:bg-muted-foreground/40'
    }`}
  >
    <span
      className={`absolute -left-0.5 top-0.5 h-3 w-3 rounded-full bg-background shadow transition-transform ${
        isOn ? 'translate-x-5' : ''
      }`}
    />
  </Button>
);

const ShiftDonutChart = ({
  shifts,
  selectedId,
  onSelect,
}: {
  shifts: ShiftItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}) => {
  const totalEmployees = shifts.reduce(
    (total, shift) => total + shift.employeeCount,
    0
  );
  const selectedShift = shifts.find(shift => shift.id === selectedId);

  if (shifts.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Turn on a shift that has employees to see it here.
      </p>
    );
  }

  let coveredShare = 0;
  const slices = shifts.map(shift => {
    const share = shift.employeeCount / totalEmployees;
    const gap = shifts.length > 1 ? DONUT_SEGMENT_GAP : 0;
    const length = Math.max(share * DONUT_CIRCUMFERENCE - gap, 0);
    const offset = -coveredShare * DONUT_CIRCUMFERENCE;
    coveredShare += share;
    return { shift, share, length, offset };
  });

  const centerValue = selectedShift?.employeeCount ?? totalEmployees;
  const centerLabel = selectedShift
    ? `in ${selectedShift.name} (${Math.round(
        (selectedShift.employeeCount / totalEmployees) * 100
      )}%)`
    : `employees on ${shifts.length} active ${pluralize(shifts.length, 'shift')}`;

  return (
    <div className="flex flex-wrap items-center gap-8">
      <div className="relative h-48 w-48 shrink-0">
        <svg
          viewBox="0 0 200 200"
          className="h-full w-full -rotate-90"
          role="img"
          aria-label={`Employees by shift: ${shifts
            .map(shift => `${shift.name} ${shift.employeeCount}`)
            .join(', ')}`}
        >
          <circle
            cx="100"
            cy="100"
            r={DONUT_RADIUS}
            fill="none"
            strokeWidth={22}
            className="stroke-muted"
          />
          {slices.map(({ shift, length, offset }) => (
            <circle
              key={shift.id}
              cx="100"
              cy="100"
              r={DONUT_RADIUS}
              fill="none"
              strokeWidth={shift.id === selectedId ? 30 : 22}
              strokeDasharray={`${length} ${DONUT_CIRCUMFERENCE - length}`}
              strokeDashoffset={offset}
              className={`transition-all ${shiftColorStyles[shift.color].stroke}`}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center">
          <span className="text-4xl font-semibold text-foreground">
            {centerValue}
          </span>
          <span className="text-xs text-muted-foreground">{centerLabel}</span>
        </div>
      </div>

      <div className="min-w-56 flex-1 space-y-1.5">
        {slices.map(({ shift, share }) => (
          <Button
            key={shift.id}
            type="button"
            variant="ghost"
            aria-pressed={shift.id === selectedId}
            onClick={() => onSelect(shift.id)}
            className={`grid h-auto w-full grid-cols-[0.75rem_minmax(0,1fr)_auto_2.75rem] items-center justify-normal gap-3 whitespace-normal rounded-xl px-3 py-2.5 text-left text-sm font-normal transition-colors hover:bg-muted/50 ${
              shift.id === selectedId ? shiftColorStyles[shift.color].tint : ''
            }`}
          >
            <span
              className={`h-3 w-3 rounded ${shiftColorStyles[shift.color].bg}`}
              aria-hidden="true"
            />
            <span className="font-medium text-foreground">{shift.name}</span>
            <span className="font-semibold text-foreground">
              {shift.employeeCount}
            </span>
            <span className="text-right text-xs text-muted-foreground">
              {Math.round(share * 100)}%
            </span>
          </Button>
        ))}
        <p className="px-3 pt-1.5 text-xs text-muted-foreground">
          Click a shift to see its share.
        </p>
      </div>
    </div>
  );
};

const ShiftTimeline = ({
  shifts,
  selectedId,
}: {
  shifts: ShiftItem[];
  selectedId: string;
}) => (
  <div className="space-y-1">
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:gap-4">
      <span className="hidden sm:block" />
      <div className="flex justify-between text-xs font-medium text-muted-foreground sm:col-span-3">
        {shiftTimelineTicks.map((tick, index) => (
          <span key={`${tick}-${index}`}>{tick}</span>
        ))}
      </div>
    </div>

    {shifts.map(shift => (
      <div
        key={shift.id}
        className="grid grid-cols-1 items-center gap-2 py-1.5 sm:grid-cols-4 sm:gap-4"
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={`h-3 w-3 shrink-0 rounded ${
              shift.isActive
                ? shiftColorStyles[shift.color].bg
                : 'bg-muted-foreground/30'
            }`}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p
              className={`text-sm ${
                shift.id === selectedId ? 'font-semibold' : 'font-medium'
              } ${shift.isActive ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              {shift.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatTimeRange(shift)}
            </p>
          </div>
        </div>

        <div className="relative h-7 rounded-lg bg-muted/50 sm:col-span-3">
          {[25, 50, 75].map(position => (
            <span
              key={position}
              className="absolute inset-y-0 w-px bg-border"
              style={{ left: `${position}%` }}
              aria-hidden="true"
            />
          ))}
          {getTimelineBars(shift).map((bar, index) => (
            <span
              key={index}
              className={`absolute inset-y-1 rounded-md ${
                shift.isActive
                  ? shiftColorStyles[shift.color].bg
                  : 'bg-muted-foreground/30'
              } ${
                shift.id === selectedId
                  ? 'ring-2 ring-primary ring-offset-1'
                  : ''
              }`}
              style={{ left: `${bar.left}%`, width: `${bar.width}%` }}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
);

const ShiftCard = ({
  shift,
  isSelected,
  onSelect,
  onToggle,
  onEdit,
}: {
  shift: ShiftItem;
  isSelected: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onEdit: () => void;
}) => {
  const colorStyle = shiftColorStyles[shift.color];
  const workedDays = shiftWeekDays
    .filter((_, index) => shift.workingDays[index])
    .map(day => day.label);

  return (
    <Card
      className={`space-y-5 p-6 ${
        isSelected ? 'border-primary ring-1 ring-primary' : 'border-border'
      } ${shift.isActive ? '' : 'opacity-75'}`}
    >
      <Button
        type="button"
        variant="ghost"
        aria-pressed={isSelected}
        onClick={onSelect}
        className="h-auto w-full flex-col items-stretch justify-start space-y-2 whitespace-normal rounded-lg p-0 text-left font-normal hover:bg-transparent hover:text-inherit"
      >
        <span className="flex items-center gap-2.5">
          <span
            className={`h-3 w-3 rounded ${colorStyle.bg}`}
            aria-hidden="true"
          />
          <span className="flex-1 text-lg font-semibold text-foreground">
            {shift.name}
          </span>
          {isOvernight(shift) && (
            <Badge className="border-transparent bg-accent text-accent-foreground">
              Overnight
            </Badge>
          )}
        </span>
        <span className="block text-2xl font-semibold text-foreground">
          {formatTimeRange(shift)}
        </span>
        <span className="block text-sm text-muted-foreground">
          {formatDuration(shift)}
        </span>
      </Button>

      <div
        className="flex gap-2"
        role="img"
        aria-label={`Works on ${workedDays.join(', ')}`}
      >
        {shiftWeekDays.map((day, index) => (
          <span
            key={day.label}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${
              shift.workingDays[index]
                ? colorStyle.chip
                : 'text-muted-foreground'
            }`}
          >
            {day.short}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3 text-sm">
        {shift.employeeInitials.length > 0 && (
          <div className="flex">
            {shift.employeeInitials.map(initials => (
              <span
                key={initials}
                className={`-mr-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background text-[10px] font-semibold ${colorStyle.chip}`}
                aria-hidden="true"
              >
                {initials}
              </span>
            ))}
          </div>
        )}
        <span
          className={`font-semibold text-foreground ${
            shift.employeeInitials.length > 0 ? 'ml-2' : ''
          }`}
        >
          {shift.employeeCount === 0
            ? 'No employees yet'
            : `${shift.employeeCount} employees`}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border pt-5">
        <div className="flex items-center gap-3">
          <ShiftSwitch
            isOn={shift.isActive}
            label={`${shift.name} is active`}
            onToggle={onToggle}
          />
          <span
            className={`text-sm font-medium ${
              shift.isActive ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            {shift.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        <Button type="button" variant="outline" onClick={onEdit}>
          Edit shift
        </Button>
      </div>
    </Card>
  );
};

const ShiftMasterPage = () => {
  const [shifts, setShifts] = useState(initialShifts);
  const [filter, setFilter] = useState<ShiftFilter>('all');
  const [selectedId, setSelectedId] = useState(initialShifts[0]?.id ?? '');
  const shiftSequence = useRef(initialShifts.length);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ShiftForm>(emptyForm);

  const [deactivateId, setDeactivateId] = useState<string | null>(null);
  const deactivateShift =
    shifts.find(shift => shift.id === deactivateId) ?? null;

  const activeShifts = shifts.filter(shift => shift.isActive);
  const chartShifts = activeShifts.filter(shift => shift.employeeCount > 0);
  const coveredEmployees = activeShifts.reduce(
    (total, shift) => total + shift.employeeCount,
    0
  );

  const filterCounts: Record<ShiftFilter, number> = {
    all: shifts.length,
    active: activeShifts.length,
    inactive: shifts.length - activeShifts.length,
  };

  const visibleShifts = useMemo(
    () =>
      shifts.filter(shift => {
        if (filter === 'active') return shift.isActive;
        if (filter === 'inactive') return !shift.isActive;
        return true;
      }),
    [shifts, filter]
  );

  const summaryLine =
    activeShifts.length === 0
      ? 'No active shifts yet. Add one to get started.'
      : `${activeShifts.length} active ${pluralize(activeShifts.length, 'shift')} ${
          activeShifts.length === 1 ? 'covers' : 'cover'
        } ${coveredEmployees} ${pluralize(coveredEmployees, 'employee')}.`;

  const updateForm = (changes: Partial<ShiftForm>) =>
    setForm(current => ({ ...current, ...changes }));

  const updateWorkingDay = (index: number, isWorking: boolean) =>
    updateForm({
      workingDays: form.workingDays.map((value, dayIndex) =>
        dayIndex === index ? isWorking : value
      ),
    });

  const updateShift = (id: string, changes: Partial<ShiftItem>) =>
    setShifts(current =>
      current.map(shift => (shift.id === id ? { ...shift, ...changes } : shift))
    );

  const openAddDialog = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  };

  const openEditDialog = (shift: ShiftItem) => {
    setEditingId(shift.id);
    setForm({
      name: shift.name,
      startTime: shift.startTime,
      endTime: shift.endTime,
      breakMinutes: String(shift.breakMinutes),
      graceMinutes: String(shift.graceMinutes),
      workingDays: [...shift.workingDays],
      color: shift.color,
    });
    setIsFormOpen(true);
  };

  const closeFormDialog = () => setIsFormOpen(false);

  const setShiftActive = (shift: ShiftItem, isActive: boolean) => {
    updateShift(shift.id, { isActive });
    toast.success(`${shift.name} is now ${isActive ? 'active' : 'inactive'}.`);
  };

  const handleToggle = (shift: ShiftItem) => {
    if (shift.isActive && shift.employeeCount > 0) {
      setDeactivateId(shift.id);
      return;
    }
    setShiftActive(shift, !shift.isActive);
  };

  const handleConfirmDeactivate = () => {
    if (!deactivateShift) return;
    setShiftActive(deactivateShift, false);
    setDeactivateId(null);
  };

  const handleSaveShift = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = form.name.trim();
    if (name.length < minNameLength) {
      toast.error(
        `Enter a shift name of at least ${minNameLength} characters.`
      );
      return;
    }
    const nameTaken = shifts.some(
      shift =>
        shift.id !== editingId &&
        shift.name.toLowerCase() === name.toLowerCase()
    );
    if (nameTaken) {
      toast.error('A shift with this name already exists.');
      return;
    }
    if (form.startTime === form.endTime) {
      toast.error('The shift must end at a different time than it starts.');
      return;
    }

    const breakMinutes = parseWholeNumber(form.breakMinutes);
    if (breakMinutes === null) {
      toast.error(
        'Enter the break as a whole number of minutes, for example 30.'
      );
      return;
    }
    if (breakMinutes >= getShiftMinutes(form.startTime, form.endTime)) {
      toast.error('The break must be shorter than the shift.');
      return;
    }
    const graceMinutes = parseWholeNumber(form.graceMinutes);
    if (graceMinutes === null || graceMinutes > maxGraceMinutes) {
      toast.error(
        `Enter the grace period as minutes between 0 and ${maxGraceMinutes}.`
      );
      return;
    }
    if (!form.workingDays.some(Boolean)) {
      toast.error('Pick at least one working day.');
      return;
    }

    const details = {
      name,
      startTime: form.startTime,
      endTime: form.endTime,
      breakMinutes,
      graceMinutes,
      workingDays: form.workingDays,
      color: form.color,
    };

    if (editingId) {
      updateShift(editingId, details);
      toast.success(`${name} updated.`);
    } else {
      shiftSequence.current += 1;
      const id = `shift-${shiftSequence.current}`;
      setShifts(current => [
        ...current,
        {
          id,
          ...details,
          employeeCount: 0,
          employeeInitials: [],
          isActive: true,
        },
      ]);
      setSelectedId(id);
      setFilter('all');
      toast.success(`${name} added. Assign employees from the roster.`);
    }
    closeFormDialog();
  };

  return (
    <>
      <div className="flex justify-end"></div>
      <Section title="Shift Master" menuId="shift-master" showBreadcrumbs>
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">{summaryLine}</p>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card className="space-y-6 p-6">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-foreground">
                  Employees by shift
                </h3>
                <p className="text-sm text-muted-foreground">
                  See how your team is split across active shifts.
                </p>
              </div>
              <ShiftDonutChart
                shifts={chartShifts}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </Card>

            <Card className="space-y-6 p-6">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-foreground">
                  Your day at a glance
                </h3>
                <p className="text-sm text-muted-foreground">
                  See when each shift runs across 24 hours.
                </p>
              </div>
              <ShiftTimeline shifts={shifts} selectedId={selectedId} />
            </Card>
          </div>

          <Section title="Your shifts" contentClassName="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div
                className="flex w-fit max-w-full gap-1 rounded-xl border border-border bg-card p-1"
                role="group"
              >
                {shiftMasterFilterOptions.map(option => {
                  if (!isShiftFilter(option.value)) return null;
                  const value = option.value;
                  const isActive = filter === value;
                  return (
                    <Button
                      key={value}
                      type="button"
                      variant={isActive ? 'default' : 'ghost'}
                      aria-pressed={isActive}
                      className="h-10 gap-2 px-4"
                      onClick={() => setFilter(value)}
                    >
                      {option.label}
                      <span
                        className={`rounded-full px-2 text-xs font-semibold ${
                          isActive
                            ? 'bg-primary-foreground/20 text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        {filterCounts[value]}
                      </span>
                    </Button>
                  );
                })}
              </div>
              <div className="ml-auto grid w-full grid-cols-1 gap-3 sm:w-auto">
                <Button variant="default" onClick={openAddDialog}>
                  <Plus className="w-4 h-4" />
                  Add Shift
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visibleShifts.map(shift => (
                <ShiftCard
                  key={shift.id}
                  shift={shift}
                  isSelected={shift.id === selectedId}
                  onSelect={() => setSelectedId(shift.id)}
                  onToggle={() => handleToggle(shift)}
                  onEdit={() => openEditDialog(shift)}
                />
              ))}
            </div>
            {visibleShifts.length === 0 && (
              <Card className="border-2 border-dashed bg-transparent p-10 text-center text-sm text-muted-foreground shadow-none">
                No shifts to show here.
              </Card>
            )}
          </Section>
        </div>
      </Section>

      <Dialog
        open={isFormOpen}
        onOpenChange={open => !open && closeFormDialog()}
      >
        <DialogContent
          className="sm:max-w-xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit shift' : 'Add shift'}</DialogTitle>
            <DialogDescription>
              Set the timings and working days. Employees are assigned from the
              shift roster.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveShift} className="space-y-4">
            <FormField
              label="Shift name"
              name="shift-name"
              value={form.name}
              onChange={name => updateForm({ name })}
              placeholder="e.g. General Shift"
              required
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                label="Starts at"
                name="shift-start"
                type="select"
                value={form.startTime}
                onChange={startTime => updateForm({ startTime })}
                options={shiftMasterTimeOptions}
                required
              />
              <FormField
                label="Ends at"
                name="shift-end"
                type="select"
                value={form.endTime}
                onChange={endTime => updateForm({ endTime })}
                options={shiftMasterTimeOptions}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                label="Break (minutes)"
                name="shift-break"
                value={form.breakMinutes}
                onChange={breakMinutes => updateForm({ breakMinutes })}
                placeholder="e.g. 30"
              />
              <FormField
                label="Grace period (minutes)"
                name="shift-grace"
                value={form.graceMinutes}
                onChange={graceMinutes => updateForm({ graceMinutes })}
                placeholder="e.g. 15"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Working days
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {shiftWeekDays.map((day, index) => (
                  <FormField
                    key={day.label}
                    label={day.label}
                    name={`shift-day-${index}`}
                    type="checkbox"
                    value={form.workingDays[index]}
                    onCheckboxChange={checked =>
                      updateWorkingDay(index, checked)
                    }
                    className="rounded-lg bg-muted/40 p-2"
                  />
                ))}
              </div>
            </div>

            <FormField
              label="Colour"
              name="shift-color"
              type="select"
              value={form.color}
              onChange={value => {
                if (isShiftColor(value)) updateForm({ color: value });
              }}
              options={shiftMasterColorOptions}
              required
            />

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={closeFormDialog}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingId ? 'Save changes' : 'Add shift'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(deactivateShift)}
        onOpenChange={open => !open && setDeactivateId(null)}
      >
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Turn off {deactivateShift?.name}?</DialogTitle>
            <DialogDescription>
              {deactivateShift?.employeeCount} employees are on this shift. They
              stay assigned, but the shift is hidden from the roster until you
              turn it on again.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="default"
              onClick={() => setDeactivateId(null)}
            >
              Keep it active
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDeactivate}
            >
              Turn off shift
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShiftMasterPage;
