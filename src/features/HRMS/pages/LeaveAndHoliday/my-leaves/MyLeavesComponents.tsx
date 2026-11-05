import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  type DayPart,
  type LeaveRequest,
  type LeaveType,
  type LeaveTypeId,
  type RequestCheck,
  addDays,
  dayPartOptions,
  findLeaveType,
  formatDate,
  formatDays,
  getLeftDays,
  getRequestOn,
  holidays,
  isHoliday,
  isWeekend,
  lastMonthOffset,
  leaveTypes,
  managerName,
  pastDaysAllowed,
  pluralize,
  quickReasons,
  teamLeave,
  toIso,
  todayIso,
  weekdayLabels,
} from './myLeavesData';
export const BalanceCard = ({
  leaveType,
  left,
  pending,
  isSelected,
  onSelect,
}: {
  leaveType: LeaveType;
  left: number;
  pending: number;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  return (
    <Button
      type="button"
      variant="ghost"
      aria-pressed={isSelected}
      onClick={onSelect}
      className={`h-auto w-full justify-start whitespace-normal rounded-2xl border-2 p-5 text-left transition-colors hover:bg-muted/40 ${
        isSelected ? 'border-primary' : 'border-border'
      }`}
    >
      <span className="space-y-0.5">
        <span className="block font-semibold text-foreground">
          {leaveType.label}
        </span>
        <span className="block text-sm text-muted-foreground">
          {formatDays(left)} of {leaveType.total} days left
        </span>
        <span
          className={`block text-xs font-semibold ${
            pending > 0 ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          {pending > 0
            ? `${formatDays(pending)} ${pluralize(pending, 'day')} pending`
            : left <= 0
              ? 'All used'
              : 'None pending'}
        </span>
      </span>
    </Button>
  );
};

export const LeaveCalendar = ({
  monthOffset,
  selectedStart,
  selectedEnd,
  requests,
  onPickDay,
  onChangeMonth,
}: {
  monthOffset: number;
  selectedStart: string | null;
  selectedEnd: string | null;
  requests: LeaveRequest[];
  onPickDay: (iso: string) => void;
  onChangeMonth: (direction: 1 | -1) => void;
}) => {
  const today = todayIso();
  const oldestPickable = addDays(today, -pastDaysAllowed);
  const now = new Date();
  const monthStart = new Date(
    now.getFullYear(),
    now.getMonth() + monthOffset,
    1
  );
  const daysInMonth = new Date(
    monthStart.getFullYear(),
    monthStart.getMonth() + 1,
    0
  ).getDate();
  const leadingBlanks = (monthStart.getDay() + 6) % 7;
  const rangeEnd = selectedEnd ?? selectedStart;

  const getDayStyle = (iso: string) => {
    const request = getRequestOn(iso, requests);
    const isOff = isWeekend(iso) || isHoliday(iso);
    const isSelected =
      selectedStart !== null &&
      rangeEnd !== null &&
      iso >= selectedStart &&
      iso <= rangeEnd;

    if (isSelected && iso >= oldestPickable) {
      const mark =
        iso === selectedStart ? 'Start' : iso === rangeEnd ? 'End' : '';
      return {
        classes: 'border-primary bg-primary text-primary-foreground',
        mark,
      };
    }
    if (request && !isOff) {
      return request.status === 'approved'
        ? {
            classes: 'border-primary/30 bg-primary/10 text-primary',
            mark: 'My leave',
          }
        : {
            classes: 'border-border bg-muted text-muted-foreground',
            mark: 'Pending',
          };
    }
    if (isHoliday(iso)) {
      return {
        classes: 'border-destructive/30 bg-destructive/10 text-destructive',
        mark: 'Holiday',
      };
    }
    if (isWeekend(iso)) {
      return {
        classes: 'border-border bg-muted text-muted-foreground',
        mark: '',
      };
    }
    return {
      classes: 'border-border bg-card text-foreground',
      mark: iso === today ? 'Today' : '',
    };
  };

  const legend = [
    { label: 'Selected', classes: 'border-primary bg-primary' },
    { label: 'My leave', classes: 'border-primary/30 bg-primary/10' },
    { label: 'Pending', classes: 'border-border bg-muted' },
    { label: 'Holiday', classes: 'border-destructive/30 bg-destructive/10' },
    { label: 'Weekend', classes: 'border-border bg-muted' },
    { label: 'Teammate off', classes: 'border-primary bg-primary' },
  ];

  return (
    <Card className="min-w-0 flex-1 basis-[34rem] space-y-5 p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-foreground">
            {new Intl.DateTimeFormat('en-GB', {
              month: 'long',
              year: 'numeric',
            }).format(monthStart)}
          </h3>
          <p className="text-sm text-muted-foreground">
            Pick the first and last day of your leave.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="default"
            className="h-9 w-9"
            aria-label="Previous month"
            disabled={monthOffset === 0}
            onClick={() => onChangeMonth(-1)}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="default"
            className="h-9 w-9"
            aria-label="Next month"
            disabled={monthOffset === lastMonthOffset}
            onClick={() => onChangeMonth(1)}
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {weekdayLabels.map(label => (
          <span key={label} className="pb-1 text-center text-xs font-semibold ">
            {label}
          </span>
        ))}
        {Array.from({ length: leadingBlanks }, (_, index) => (
          <span key={`blank-${index}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const iso = toIso(
            new Date(monthStart.getFullYear(), monthStart.getMonth(), index + 1)
          );
          const { classes, mark } = getDayStyle(iso);
          const isTooOld = iso < oldestPickable;
          const hasTeamOff =
            !isWeekend(iso) && teamLeave.some(item => item.date === iso);

          return (
            <Button
              key={iso}
              type="button"
              variant="ghost"
              disabled={isTooOld}
              aria-label={`${formatDate(iso, {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}${hasTeamOff ? ', teammates off' : ''}`}
              onClick={() => onPickDay(iso)}
              className={`relative h-14 w-full flex-col gap-0 rounded-xl border-2 p-0 text-sm font-semibold transition-opacity ${classes} ${
                iso === today ? 'ring-2 ring-primary ring-offset-1' : ''
              } ${
                isTooOld
                  ? 'opacity-40'
                  : iso < today
                    ? 'opacity-75 hover:opacity-100'
                    : 'hover:opacity-80'
              }`}
            >
              {hasTeamOff && (
                <span
                  className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary"
                  aria-hidden="true"
                />
              )}
              <span>{index + 1}</span>
              <span className="min-h-3 text-[10px] font-semibold leading-none">
                {mark}
              </span>
            </Button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4">
        {legend.map(item => (
          <span
            key={item.label}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <span
              className={`h-3.5 w-3.5 rounded border-2 ${item.classes}`}
              aria-hidden="true"
            />
            {item.label}
          </span>
        ))}
      </div>
    </Card>
  );
};

const PanelTitle = ({ children }: { children: ReactNode }) => (
  <p className="text-sm font-semibold text-foreground">{children}</p>
);

export const RequestPanel = ({
  selectedStart,
  selectedEnd,
  check,
  type,
  part,
  reason,
  requests,
  justSent,
  onTypeChange,
  onPartChange,
  onReasonChange,
  onSend,
  onClear,
}: {
  selectedStart: string | null;
  selectedEnd: string | null;
  check: RequestCheck | null;
  type: LeaveTypeId;
  part: DayPart;
  reason: string;
  requests: LeaveRequest[];
  justSent: boolean;
  onTypeChange: (type: LeaveTypeId) => void;
  onPartChange: (part: DayPart) => void;
  onReasonChange: (reason: string) => void;
  onSend: () => void;
  onClear: () => void;
}) => {
  const leaveType = findLeaveType(type);
  const left = getLeftDays(leaveType, requests);

  const rangeText = !selectedStart
    ? ''
    : selectedEnd && selectedEnd !== selectedStart
      ? `${formatDate(selectedStart, {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        })} â†’ ${formatDate(selectedEnd, {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        })}`
      : formatDate(selectedStart, {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        });

  const skipped = check
    ? [
        check.weekendDays > 0 &&
          `${check.weekendDays} weekend ${pluralize(check.weekendDays, 'day')}`,
        check.holidayDays > 0 &&
          `${check.holidayDays} ${pluralize(check.holidayDays, 'holiday')}`,
      ].filter(Boolean)
    : [];

  return (
    <Card className="space-y-5 p-6">
      <h3 className="text-xl font-semibold text-foreground">Request leave</h3>

      {justSent && !selectedStart && (
        <p className="rounded-xl border border-primary/30 bg-primary/10 p-3.5 text-sm text-foreground">
          <span className="font-semibold">Request sent.</span> {managerName}{' '}
          will be notified. You can see it under My requests.
        </p>
      )}

      {!selectedStart && !justSent && (
        <div role="list" className="space-y-3.5 text-sm text-muted-foreground">
          {[
            'Click the first day of your leave.',
            'Click the last day. For one day, click it twice.',
            'Choose the type of leave and send.',
          ].map((step, index) => (
            <div key={step} role="listitem" className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {index + 1}
              </span>
              {step}
            </div>
          ))}
        </div>
      )}

      {selectedStart && (
        <div className="space-y-5">
          <div className="space-y-1 rounded-xl bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">{rangeText}</p>
            <p className="text-2xl font-semibold text-foreground">
              {check
                ? `${formatDays(check.days)} working ${pluralize(check.days, 'day')}`
                : 'Pick the last day'}
            </p>
            {check && (
              <p className="text-sm text-muted-foreground">
                {skipped.length > 0
                  ? `${skipped.join(' and ')} skipped`
                  : 'No weekends or holidays in between'}
              </p>
            )}
          </div>

          <div className="space-y-2.5">
            <PanelTitle>Type of leave</PanelTitle>
            <div className="grid grid-cols-2 gap-2.5">
              {leaveTypes.map(item => {
                const isSelected = item.id === type;
                return (
                  <Button
                    key={item.id}
                    type="button"
                    variant="ghost"
                    aria-pressed={isSelected}
                    onClick={() => onTypeChange(item.id)}
                    className={`h-auto w-full flex-col items-start space-y-0.5 whitespace-normal rounded-xl border-2 bg-muted px-3.5 py-3 text-left text-foreground ${isSelected ? 'border-primary' : 'border-transparent'}`}
                  >
                    <span className="block text-sm font-semibold">
                      {item.label}
                    </span>
                    <span className="block text-xs">
                      {formatDays(getLeftDays(item, requests))} days left
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>

          {check?.canHalfDay && (
            <div className="space-y-2.5">
              <PanelTitle>Full day or half day?</PanelTitle>
              <div className="flex gap-2">
                {dayPartOptions.map(option => (
                  <Button
                    key={option.value}
                    type="button"
                    variant="outline"
                    aria-pressed={part === option.value}
                    className={`h-11 flex-1 ${
                      part === option.value
                        ? 'border-primary bg-primary/5 text-foreground'
                        : ''
                    }`}
                    onClick={() => onPartChange(option.value as DayPart)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2.5">
            <PanelTitle>Reason (optional)</PanelTitle>
            <div className="flex flex-wrap gap-2">
              {quickReasons.map(item => (
                <Button
                  key={item}
                  type="button"
                  size="sm"
                  variant="outline"
                  aria-pressed={reason === item}
                  className={`rounded-full ${
                    reason === item
                      ? 'border-primary bg-primary/5 text-foreground'
                      : ''
                  }`}
                  onClick={() => onReasonChange(reason === item ? '' : item)}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>

          {check && check.teamOff.length > 0 && (
            <p className="flex items-start gap-3 rounded-xl bg-muted p-3.5 text-sm text-foreground">
              <Users className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                <span className="font-semibold">Heads-up:</span>{' '}
                {check.teamOff.join(' and ')}{' '}
                {check.teamOff.length === 1 ? 'is' : 'are'} also off on some of
                these days.
              </span>
            </p>
          )}

          <p
            className={`rounded-xl p-3.5 text-sm font-semibold ${
              !check
                ? 'bg-muted/50 text-muted-foreground'
                : check.error
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-primary/10 text-foreground'
            }`}
          >
            {!check
              ? 'Now click the last day. For a single day, click the same day again.'
              : (check.error ??
                `You will have ${formatDays(
                  left - check.days
                )} ${leaveType.label.toLowerCase()} days left after this.`)}
          </p>

          <div className="flex gap-2.5">
            <Button
              type="button"
              className="h-11 flex-1"
              disabled={!check || check.error !== null}
              onClick={onSend}
            >
              Send request
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11"
              onClick={onClear}
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export const UpcomingHolidays = () => {
  const today = todayIso();
  const upcoming = holidays
    .filter(holiday => holiday.date >= today)
    .slice(0, 3);

  return (
    <Card className="space-y-4 p-6">
      <h3 className="text-lg font-semibold text-foreground">
        Coming up: holidays
      </h3>
      <div className="space-y-3.5">
        {upcoming.map(holiday => {
          const daysAway = Math.round(
            (new Date(`${holiday.date}T00:00:00`).getTime() -
              new Date(`${today}T00:00:00`).getTime()) /
              86_400_000
          );
          return (
            <div key={holiday.date} className="flex items-center gap-3.5">
              <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-muted leading-tight text-foreground">
                <span className="text-base font-semibold">
                  {formatDate(holiday.date, { day: 'numeric' })}
                </span>
                <span className="text-[11px] font-semibold">
                  {formatDate(holiday.date, { month: 'short' })}
                </span>
              </span>
              <div>
                <p className="font-semibold text-foreground">{holiday.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(holiday.date, { weekday: 'long' })} in {daysAway}{' '}
                  {pluralize(daysAway, 'day')}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
