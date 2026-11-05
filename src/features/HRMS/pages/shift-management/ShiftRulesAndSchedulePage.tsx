import { type FormEvent, useRef, useState } from 'react';
import { Calendar, Clock, Coffee, Moon, Plus, Sun, Timer } from 'lucide-react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  shiftScheduleDefaultShiftOptions,
  shiftScheduleRepeatWeeksOptions,
} from '@/data/reusableDropdownData';
import RulesTab, { type Rule } from './shiftrule-and-schedule/RulesTab';
import SchedulesTab, {
  type Schedule,
  type ShiftCode,
} from './shiftrule-and-schedule/SchedulesTab';

type PageTab = 'schedules' | 'rules';

interface NewScheduleForm {
  name: string;
  team: string;
  startsOn: string;
  repeatWeeks: string;
  shift: ShiftCode;
}

const pageTabOptions: { label: string; value: PageTab }[] = [
  { label: 'Schedules', value: 'schedules' },
  { label: 'Rules', value: 'rules' },
];

const minTextLength = 3;

const isShiftCode = (value: string): value is ShiftCode =>
  shiftScheduleDefaultShiftOptions.some(option => option.value === value);

const emptyNewScheduleForm: NewScheduleForm = {
  name: '',
  team: '',
  startsOn: '',
  repeatWeeks: '1',
  shift: 'G',
};

const workWeek = (code: ShiftCode): ShiftCode[] => [
  code,
  code,
  code,
  code,
  code,
  'O',
  'O',
];

const makeSchedule = (schedule: Omit<Schedule, 'savedWeeks'>): Schedule => ({
  ...schedule,
  savedWeeks: schedule.weeks,
});

const initialSchedules: Schedule[] = [
  makeSchedule({
    id: 'schedule-1',
    name: 'Support Team Rotation',
    team: 'Customer Support',
    employeeCount: 14,
    startsOn: '2026-10-01',
    weeks: [workWeek('M'), workWeek('A'), workWeek('N'), workWeek('G')],
  }),
  makeSchedule({
    id: 'schedule-2',
    name: 'Office Hours',
    team: 'HQ Office',
    employeeCount: 48,
    startsOn: '2026-01-01',
    weeks: [workWeek('G')],
  }),
  makeSchedule({
    id: 'schedule-3',
    name: 'Weekend Support Roster',
    team: 'Support',
    employeeCount: 6,
    startsOn: '2026-10-03',
    weeks: [
      ['O', 'O', 'O', 'O', 'O', 'W', 'W'],
      ['O', 'O', 'O', 'O', 'O', 'O', 'O'],
    ],
  }),
];

const initialRules: Rule[] = [
  {
    id: 'grace',
    title: 'Grace period',
    icon: Clock,
    before: 'People can arrive up to ',
    after: ' late without being marked late.',
    prefix: '',
    unit: 'min',
    value: 15,
    step: 5,
    min: 0,
    max: 60,
    isOn: true,
    defaultValue: 15,
    defaultOn: true,
  },
  {
    id: 'halfDay',
    title: 'Half day',
    icon: Sun,
    before: 'Mark a half day when someone works less than ',
    after: ' in a day.',
    prefix: '',
    unit: 'hrs',
    value: 4,
    step: 1,
    min: 1,
    max: 8,
    isOn: true,
    defaultValue: 4,
    defaultOn: true,
  },
  {
    id: 'overtime',
    title: 'Overtime',
    icon: Timer,
    before: 'Count overtime once someone works more than ',
    after: ' in a day.',
    prefix: '',
    unit: 'hrs',
    value: 8,
    step: 1,
    min: 6,
    max: 12,
    isOn: true,
    defaultValue: 8,
    defaultOn: true,
  },
  {
    id: 'rest',
    title: 'Minimum rest',
    icon: Coffee,
    before: 'Keep at least ',
    after: ' of rest between two shifts.',
    prefix: '',
    unit: 'hrs',
    value: 11,
    step: 1,
    min: 8,
    max: 16,
    isOn: true,
    defaultValue: 11,
    defaultOn: true,
  },
  {
    id: 'nightAllowance',
    title: 'Night allowance',
    icon: Moon,
    before: 'Pay ',
    after: ' extra for every night shift worked.',
    prefix: '₹',
    unit: '',
    value: 300,
    step: 50,
    min: 0,
    max: 1000,
    isOn: true,
    defaultValue: 300,
    defaultOn: true,
  },
  {
    id: 'daysInRow',
    title: 'Days in a row',
    icon: Calendar,
    before: 'No one works more than ',
    after: ' in a row.',
    prefix: '',
    unit: 'days',
    value: 6,
    step: 1,
    min: 3,
    max: 10,
    isOn: false,
    defaultValue: 6,
    defaultOn: false,
  },
];

const ShiftRulesAndSchedulePage = () => {
  const [tab, setTab] = useState<PageTab>('schedules');
  const [schedules, setSchedules] = useState(initialSchedules);
  const [rules, setRules] = useState(initialRules);
  const [selectedId, setSelectedId] = useState(initialSchedules[0]?.id ?? '');
  const [brush, setBrush] = useState<ShiftCode>('M');
  const [savedId, setSavedId] = useState<string | null>(null);
  const scheduleSequence = useRef(initialSchedules.length);

  const [isNewOpen, setIsNewOpen] = useState(false);
  const [newForm, setNewForm] = useState(emptyNewScheduleForm);

  const selectedSchedule =
    schedules.find(schedule => schedule.id === selectedId) ?? schedules[0];

  const rulesOnCount = rules.filter(rule => rule.isOn).length;

  const tabCounts: Record<PageTab, number> = {
    schedules: schedules.length,
    rules: rulesOnCount,
  };

  const updateNewForm = (changes: Partial<NewScheduleForm>) =>
    setNewForm(current => ({ ...current, ...changes }));

  const updateSelectedWeeks = (
    change: (weeks: ShiftCode[][]) => ShiftCode[][]
  ) => {
    setSavedId(null);
    setSchedules(current =>
      current.map(schedule =>
        schedule.id === selectedId
          ? { ...schedule, weeks: change(schedule.weeks) }
          : schedule
      )
    );
  };

  const handlePaintDay = (weekIndex: number, dayIndex: number) =>
    updateSelectedWeeks(weeks =>
      weeks.map((week, wIndex) =>
        wIndex === weekIndex
          ? week.map((code, dIndex) => (dIndex === dayIndex ? brush : code))
          : week
      )
    );

  const handleAddWeek = () =>
    updateSelectedWeeks(weeks => [...weeks, [...weeks[weeks.length - 1]]]);

  const handleRemoveWeek = () =>
    updateSelectedWeeks(weeks => weeks.slice(0, -1));

  const handleCopyFirstWeek = () =>
    updateSelectedWeeks(weeks => weeks.map(() => [...weeks[0]]));

  const handleSave = () => {
    if (!selectedSchedule) return;
    setSchedules(current =>
      current.map(schedule =>
        schedule.id === selectedId
          ? { ...schedule, savedWeeks: schedule.weeks }
          : schedule
      )
    );
    setSavedId(selectedId);
    toast.success(`${selectedSchedule.name} saved.`);
  };

  const handleUndo = () => {
    setSchedules(current =>
      current.map(schedule =>
        schedule.id === selectedId
          ? { ...schedule, weeks: schedule.savedWeeks }
          : schedule
      )
    );
    setSavedId(null);
  };

  const updateRule = (id: Rule['id'], changes: Partial<Rule>) =>
    setRules(current =>
      current.map(rule => (rule.id === id ? { ...rule, ...changes } : rule))
    );

  const handleStepRule = (rule: Rule, direction: 1 | -1) => {
    const nextValue = rule.value + direction * rule.step;
    updateRule(rule.id, {
      value: Math.min(rule.max, Math.max(rule.min, nextValue)),
    });
  };

  const handleResetRules = () => {
    setRules(current =>
      current.map(rule => ({
        ...rule,
        value: rule.defaultValue,
        isOn: rule.defaultOn,
      }))
    );
    toast.success('Rules reset to the recommended values.');
  };

  const openNewDialog = () => {
    setNewForm(emptyNewScheduleForm);
    setIsNewOpen(true);
  };

  const closeNewDialog = () => setIsNewOpen(false);

  const handleCreateSchedule = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = newForm.name.trim();
    if (name.length < minTextLength) {
      toast.error(
        `Enter a schedule name of at least ${minTextLength} characters.`
      );
      return;
    }
    if (
      schedules.some(item => item.name.toLowerCase() === name.toLowerCase())
    ) {
      toast.error('A schedule with this name already exists.');
      return;
    }
    if (newForm.team.trim().length < minTextLength) {
      toast.error('Enter the team this schedule is for.');
      return;
    }
    if (!newForm.startsOn) {
      toast.error('Pick the date this schedule starts.');
      return;
    }

    scheduleSequence.current += 1;
    const id = `schedule-${scheduleSequence.current}`;
    const weekCount = Number(newForm.repeatWeeks);
    setSchedules(current => [
      ...current,
      makeSchedule({
        id,
        name,
        team: newForm.team.trim(),
        employeeCount: 0,
        startsOn: newForm.startsOn,
        weeks: Array.from({ length: weekCount }, () => workWeek(newForm.shift)),
      }),
    ]);
    setSelectedId(id);
    setTab('schedules');
    toast.success(`${name} created. Assign employees from the roster.`);
    closeNewDialog();
  };

  return (
    <>
      <Section
        title="Shift Rules & Schedules"
        menuId="shift-rules-and-schedules"
        showBreadcrumbs
      >
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              className="flex w-fit max-w-full gap-1 rounded-xl border border-border bg-card p-1"
              role="group"
              aria-label="Choose a view"
            >
              {pageTabOptions.map(option => {
                const isActive = tab === option.value;
                return (
                  <Button
                    key={option.value}
                    type="button"
                    variant={isActive ? 'default' : 'ghost'}
                    aria-pressed={isActive}
                    className="h-11 gap-2.5 px-6"
                    onClick={() => setTab(option.value)}
                  >
                    {option.label}
                    <span
                      className={`rounded-full px-2 text-xs font-semibold ${
                        isActive
                          ? 'bg-primary-foreground/20 text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      {tabCounts[option.value]}
                    </span>
                  </Button>
                );
              })}
            </div>
            <div className="ml-auto grid w-full grid-cols-1 gap-3 sm:w-auto">
              <Button variant="default" onClick={openNewDialog}>
                <Plus className="w-4 h-4" />
                New Schedule
              </Button>
            </div>
          </div>

          {tab === 'schedules' && selectedSchedule && (
            <SchedulesTab
              schedules={schedules}
              selectedSchedule={selectedSchedule}
              rules={rules}
              brush={brush}
              savedId={savedId}
              onSelectSchedule={id => {
                setSelectedId(id);
                setSavedId(null);
              }}
              onBrushChange={setBrush}
              onPaintDay={handlePaintDay}
              onUndo={handleUndo}
              onSave={handleSave}
              onAddWeek={handleAddWeek}
              onRemoveWeek={handleRemoveWeek}
              onCopyFirstWeek={handleCopyFirstWeek}
            />
          )}
          {tab === 'rules' && (
            <RulesTab
              rules={rules}
              rulesOnCount={rulesOnCount}
              onReset={handleResetRules}
              onToggle={rule => updateRule(rule.id, { isOn: !rule.isOn })}
              onStep={handleStepRule}
            />
          )}
        </div>
      </Section>
      <Dialog open={isNewOpen} onOpenChange={open => !open && closeNewDialog()}>
        <DialogContent
          className="sm:max-w-xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>New schedule</DialogTitle>
            <DialogDescription>
              It starts with Monday to Friday on one shift. You can change any
              day afterwards.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSchedule} className="space-y-4">
            <FormField
              label="Schedule name"
              name="schedule-name"
              value={newForm.name}
              onChange={name => updateNewForm({ name })}
              placeholder="e.g. Support Team Rotation"
              required
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                label="Team"
                name="schedule-team"
                value={newForm.team}
                onChange={team => updateNewForm({ team })}
                placeholder="e.g. Customer Support"
                required
              />
              <FormField
                label="Starts on"
                name="schedule-starts-on"
                type="date"
                value={newForm.startsOn}
                onChange={startsOn => updateNewForm({ startsOn })}
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                label="Repeats every"
                name="schedule-repeat"
                type="select"
                value={newForm.repeatWeeks}
                onChange={repeatWeeks => updateNewForm({ repeatWeeks })}
                options={shiftScheduleRepeatWeeksOptions}
                required
              />
              <FormField
                label="Starting shift"
                name="schedule-shift"
                type="select"
                value={newForm.shift}
                onChange={value => {
                  if (isShiftCode(value)) updateNewForm({ shift: value });
                }}
                options={shiftScheduleDefaultShiftOptions}
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={closeNewDialog}
              >
                Cancel
              </Button>
              <Button type="submit">Create schedule</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShiftRulesAndSchedulePage;
