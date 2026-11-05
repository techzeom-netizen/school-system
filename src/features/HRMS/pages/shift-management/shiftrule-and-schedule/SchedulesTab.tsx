import { AlertTriangle, Check, CheckCircle2, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Rule } from './RulesTab';

export type ShiftCode = 'G' | 'M' | 'A' | 'N' | 'W' | 'O';

export interface Schedule {
  id: string;
  name: string;
  team: string;
  employeeCount: number;
  startsOn: string;
  weeks: ShiftCode[][];
  savedWeeks: ShiftCode[][];
}

interface ShiftType {
  name: string;
  time: string;
  startHour: number;
  endHour: number;
  chip: string;
  dot: string;
}

interface SchedulesTabProps {
  schedules: Schedule[];
  selectedSchedule: Schedule;
  rules: Rule[];
  brush: ShiftCode;
  savedId: string | null;
  onSelectSchedule: (id: string) => void;
  onBrushChange: (code: ShiftCode) => void;
  onPaintDay: (weekIndex: number, dayIndex: number) => void;
  onUndo: () => void;
  onSave: () => void;
  onAddWeek: () => void;
  onRemoveWeek: () => void;
  onCopyFirstWeek: () => void;
}

const shiftTypes: Record<ShiftCode, ShiftType> = {
  G: {
    name: 'General',
    time: '9 AM – 6 PM',
    startHour: 9,
    endHour: 18,
    chip: 'bg-primary/10 text-primary',
    dot: 'bg-primary',
  },
  M: {
    name: 'Morning',
    time: '6 AM – 2 PM',
    startHour: 6,
    endHour: 14,
    chip: 'bg-secondary text-secondary-foreground',
    dot: 'bg-secondary-foreground',
  },
  A: {
    name: 'Afternoon',
    time: '2 PM – 10 PM',
    startHour: 14,
    endHour: 22,
    chip: 'bg-accent text-accent-foreground',
    dot: 'bg-accent-foreground',
  },
  N: {
    name: 'Night',
    time: '10 PM – 6 AM',
    startHour: 22,
    endHour: 30,
    chip: 'bg-primary/15 text-primary',
    dot: 'bg-primary',
  },
  W: {
    name: 'Weekend',
    time: '10 AM – 4 PM',
    startHour: 10,
    endHour: 16,
    chip: 'bg-destructive/10 text-destructive',
    dot: 'bg-destructive',
  },
  O: {
    name: 'Off',
    time: 'Day off',
    startHour: 0,
    endHour: 0,
    chip: 'bg-muted text-muted-foreground',
    dot: 'bg-muted-foreground',
  },
};

const shiftPaletteOrder: ShiftCode[] = ['M', 'A', 'N', 'G', 'W', 'O'];
const maxWeeks = 6;
const maxIssuesShown = 3;
const dayLabels = [
  { short: 'Mon', full: 'Monday' },
  { short: 'Tue', full: 'Tuesday' },
  { short: 'Wed', full: 'Wednesday' },
  { short: 'Thu', full: 'Thursday' },
  { short: 'Fri', full: 'Friday' },
  { short: 'Sat', full: 'Saturday' },
  { short: 'Sun', full: 'Sunday' },
];

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));

const getWeekLabel = (schedule: Schedule, weekIndex: number) =>
  schedule.weeks.length === 1 ? 'Every week' : `Week ${weekIndex + 1}`;

const isDirty = (schedule: Schedule) =>
  JSON.stringify(schedule.weeks) !== JSON.stringify(schedule.savedWeeks);

const getScheduleIssues = (schedule: Schedule, rules: Rule[]): string[] => {
  const issues: string[] = [];
  const days = schedule.weeks.flatMap((week, weekIndex) =>
    week.map((code, dayIndex) => ({ code, weekIndex, dayIndex }))
  );
  const restRule = rules.find(rule => rule.id === 'rest');

  if (restRule?.isOn) {
    days.forEach((current, index) => {
      const next = days[(index + 1) % days.length];
      if (current.code === 'O' || next.code === 'O') return;

      const restHours =
        shiftTypes[next.code].startHour + 24 - shiftTypes[current.code].endHour;
      if (restHours >= restRule.value) return;

      const from = `${schedule.weeks.length > 1 ? `Week ${current.weekIndex + 1} ` : ''}${dayLabels[current.dayIndex].short}`;
      const to = `${schedule.weeks.length > 1 && next.weekIndex !== current.weekIndex ? `Week ${next.weekIndex + 1} ` : ''}${dayLabels[next.dayIndex].short}`;
      issues.push(
        `${from} → ${to}: only ${restHours} hrs of rest between ${shiftTypes[current.code].name} and ${shiftTypes[next.code].name} (minimum ${restRule.value} hrs).`
      );
    });
  }

  const daysRule = rules.find(rule => rule.id === 'daysInRow');
  if (daysRule?.isOn && days.length > 0) {
    let run = 0;
    let longestRun = 0;

    for (let index = 0; index < days.length * 2; index += 1) {
      if (days[index % days.length].code === 'O') run = 0;
      else {
        run += 1;
        longestRun = Math.max(longestRun, run);
      }
    }

    longestRun = Math.min(longestRun, days.length);
    if (longestRun > daysRule.value) {
      issues.push(
        `Someone could work ${longestRun} days in a row (your limit is ${daysRule.value}).`
      );
    }
  }

  return issues;
};

const ScheduleCard = ({
  schedule,
  isSelected,
  issueCount,
  onSelect,
}: {
  schedule: Schedule;
  isSelected: boolean;
  issueCount: number;
  onSelect: () => void;
}) => (
  <Button
    type="button"
    aria-pressed={isSelected}
    onClick={onSelect}
    variant="ghost"
    className={`h-auto w-full flex-col items-stretch justify-start space-y-3 whitespace-normal rounded-2xl border-2 p-5 text-left font-normal transition-colors hover:text-inherit focus-visible:ring-2 focus-visible:ring-primary ${
      isSelected
        ? 'border-primary bg-primary/5 hover:bg-primary/10'
        : 'border-border bg-card hover:bg-muted/40'
    }`}
  >
    <span className="flex items-center gap-3">
      <span className="flex-1 text-base font-semibold text-foreground">
        {schedule.name}
      </span>
      {isDirty(schedule) && (
        <Badge className="border-transparent bg-muted text-muted-foreground">
          Unsaved
        </Badge>
      )}
    </span>
    <span className="block text-sm text-muted-foreground">
      {schedule.team} ·{' '}
      <span className="font-semibold text-foreground">
        {schedule.employeeCount} employees
      </span>
    </span>
    <span className="block text-xs text-muted-foreground">
      {schedule.weeks.length === 1
        ? 'Same every week'
        : `Repeats every ${schedule.weeks.length} weeks`}{' '}
      · starts {formatDate(schedule.startsOn)}
    </span>
    {issueCount === 0 ? (
      <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        Follows your rules
      </span>
    ) : (
      <span className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        {issueCount} to check
      </span>
    )}
  </Button>
);

const ShiftPalette = ({
  selected,
  onSelect,
}: {
  selected: ShiftCode;
  onSelect: (code: ShiftCode) => void;
}) => (
  <div className="flex flex-wrap gap-3" role="group" aria-label="Pick a shift">
    {shiftPaletteOrder.map(code => {
      const shift = shiftTypes[code];
      const isSelected = selected === code;

      return (
        <Button
          key={code}
          type="button"
          variant="ghost"
          aria-pressed={isSelected}
          onClick={() => onSelect(code)}
          className={`flex min-h-14 items-center gap-3 rounded-xl border-2 px-5 text-left hover:text-inherit focus-visible:ring-2 focus-visible:ring-primary ${shift.chip} ${isSelected ? 'border-primary' : 'border-transparent'}`}
        >
          <span className={`h-3 w-3 rounded ${shift.dot}`} aria-hidden="true" />
          <span className="leading-tight">
            <span className="block text-sm font-semibold">{shift.name}</span>
            <span className="block text-xs opacity-80">{shift.time}</span>
          </span>
          {isSelected && <Check className="h-4 w-4" aria-hidden="true" />}
        </Button>
      );
    })}
  </div>
);

const WeekGrid = ({
  schedule,
  brush,
  onPaint,
}: {
  schedule: Schedule;
  brush: ShiftCode;
  onPaint: (weekIndex: number, dayIndex: number) => void;
}) => (
  <div className="overflow-x-auto">
    <div className="min-w-[46rem] space-y-2.5">
      <div className="grid grid-cols-[6rem_repeat(7,minmax(0,1fr))] gap-2.5">
        <span />
        {dayLabels.map(day => (
          <span
            key={day.short}
            className="text-center text-xs font-semibold text-muted-foreground"
          >
            {day.short}
          </span>
        ))}
      </div>
      {schedule.weeks.map((week, weekIndex) => (
        <div
          key={weekIndex}
          className="grid grid-cols-[6rem_repeat(7,minmax(0,1fr))] items-center gap-2.5"
        >
          <span className="text-sm font-medium text-foreground">
            {getWeekLabel(schedule, weekIndex)}
          </span>
          {week.map((code, dayIndex) => (
            <Button
              key={dayLabels[dayIndex].short}
              type="button"
              variant="ghost"
              aria-label={`${getWeekLabel(schedule, weekIndex)}, ${dayLabels[dayIndex].full}: ${shiftTypes[code].name}. Click to set to ${shiftTypes[brush].name}.`}
              onClick={() => onPaint(weekIndex, dayIndex)}
              className={`h-14 rounded-xl text-sm font-semibold hover:text-inherit hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary ${shiftTypes[code].chip}`}
            >
              {shiftTypes[code].name}
            </Button>
          ))}
        </div>
      ))}
    </div>
  </div>
);

const PlanCheck = ({ issues }: { issues: string[] }) => {
  const hasIssues = issues.length > 0;

  return (
    <Card
      className={`space-y-2.5 p-5 ${
        hasIssues
          ? 'border-destructive/30 bg-destructive/10 text-destructive'
          : 'border-primary/30 bg-primary/10 text-primary'
      }`}
    >
      <div className="flex items-center gap-3">
        {hasIssues ? (
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        ) : (
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
        )}
        <p className="text-base font-semibold">
          {hasIssues
            ? `${issues.length} ${issues.length === 1 ? 'thing' : 'things'} to check`
            : 'Looks good'}
        </p>
      </div>
      <p className="text-sm">
        {hasIssues
          ? 'These days break one of your rules. Change a shift above to fix them.'
          : 'This schedule follows your rest and days-in-a-row rules.'}
      </p>
      {issues.slice(0, maxIssuesShown).map(issue => (
        <p key={issue} className="text-sm">
          • {issue}
        </p>
      ))}
      {issues.length > maxIssuesShown && (
        <p className="text-sm">…and {issues.length - maxIssuesShown} more.</p>
      )}
    </Card>
  );
};

const SchedulesTab = ({
  schedules,
  selectedSchedule,
  rules,
  brush,
  savedId,
  onSelectSchedule,
  onBrushChange,
  onPaintDay,
  onUndo,
  onSave,
  onAddWeek,
  onRemoveWeek,
  onCopyFirstWeek,
}: SchedulesTabProps) => {
  const selectedIsDirty = isDirty(selectedSchedule);
  const selectedIssues = getScheduleIssues(selectedSchedule, rules);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
        {schedules.map(schedule => (
          <ScheduleCard
            key={schedule.id}
            schedule={schedule}
            isSelected={schedule.id === selectedSchedule.id}
            issueCount={getScheduleIssues(schedule, rules).length}
            onSelect={() => onSelectSchedule(schedule.id)}
          />
        ))}
      </div>

      <Card className="space-y-8 p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-foreground">
              {selectedSchedule.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              Choose a shift, then click the days it applies to.
            </p>
          </div>
          {selectedIsDirty && (
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-muted/50 py-2 pl-4 pr-2">
              <span className="text-sm font-semibold text-foreground">
                You have unsaved changes
              </span>
              <Button type="button" variant="outline" onClick={onUndo}>
                Undo
              </Button>
              <Button type="button" onClick={onSave}>
                Save changes
              </Button>
            </div>
          )}
          {!selectedIsDirty && savedId === selectedSchedule.id && (
            <span className="text-sm font-semibold text-primary">Saved</span>
          )}
        </div>

        <div className="space-y-4">
          <StepTitle number={1}>Pick a shift</StepTitle>
          <ShiftPalette selected={brush} onSelect={onBrushChange} />
        </div>

        <div className="space-y-4">
          <StepTitle number={2}>Click the days it applies to</StepTitle>
          <WeekGrid
            schedule={selectedSchedule}
            brush={brush}
            onPaint={onPaintDay}
          />
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={selectedSchedule.weeks.length >= maxWeeks}
              onClick={onAddWeek}
            >
              <Plus aria-hidden="true" /> Add a week
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={selectedSchedule.weeks.length <= 1}
              onClick={onRemoveWeek}
            >
              Remove last week
            </Button>
            {selectedSchedule.weeks.length > 1 && (
              <Button type="button" variant="outline" onClick={onCopyFirstWeek}>
                Copy Week 1 to all weeks
              </Button>
            )}
          </div>
        </div>

        <PlanCheck issues={selectedIssues} />
      </Card>
    </div>
  );
};

const StepTitle = ({
  number,
  children,
}: {
  number: number;
  children: string;
}) => (
  <div className="flex items-center gap-3">
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
      {number}
    </span>
    <h4 className="text-base font-semibold text-foreground">{children}</h4>
  </div>
);

export default SchedulesTab;
