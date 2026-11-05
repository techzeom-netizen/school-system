import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  MapPin,
  LogOut,
  LogIn,
  CalendarPlus,
  Clock3,
  ShieldCheck,
  Laptop,
  ChevronRight,
  Coffee,
  Flag,
  Briefcase,
} from 'lucide-react';
import Section from '@/components/common/Section';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';

type AttendanceStatus = 'Checked In' | 'Checked Out';

const SHIFT_MS = 9 * 60 * 60 * 1000;
const LEAVE_TOTAL = 24;
const LEAVE_LEFT = 14.5;
const ON_TIME = 98.1;

const quickActions = [
  {
    label: 'Apply regularization',
    hint: 'Fix attendance records',
    icon: CalendarPlus,
    href: '#',
  },
  {
    label: 'My attendance',
    hint: 'View time log',
    icon: Clock3,
    href: '#',
  },
  {
    label: 'Attendance requests',
    hint: 'Track approvals',
    icon: Briefcase,
    href: '#',
  },
];

const pad = (n: number) => String(n).padStart(2, '0');
const fmtClock = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
};
const fmtHM = (d: Date) =>
  d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

const formatDateString = (d: Date) => {
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const Dial = ({
  progress,
  seconds,
  active,
  children,
}: {
  progress: number;
  seconds: number;
  active: boolean;
  children: React.ReactNode;
}) => {
  const R = 118;
  const C = 2 * Math.PI * R;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[150px] xl:max-w-[170px]">
      <svg
        viewBox="0 0 280 280"
        className="absolute inset-0 h-full w-full -rotate-90"
      >
        {Array.from({ length: 60 }).map((_, i) => (
          <line
            key={i}
            x1="140"
            y1="6"
            x2="140"
            y2={i % 5 === 0 ? 14 : 10}
            strokeWidth={i % 5 === 0 ? 1.6 : 1}
            strokeLinecap="round"
            transform={`rotate(${i * 6} 140 140)`}
            className="stroke-border dark:stroke-border"
          />
        ))}
        <circle
          cx="140"
          cy="140"
          r={R - 14}
          fill="none"
          strokeWidth="14"
          className="stroke-border dark:stroke-border"
        />
        <circle
          cx="140"
          cy="140"
          r={R - 14}
          fill="none"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${(C - 88) * Math.min(1, progress)} ${C}`}
          className={`transition-all duration-700 ${
            active
              ? 'stroke-border dark:stroke-border'
              : 'stroke-border dark:stroke-border'
          }`}
        />
        <g
          style={{
            transform: `rotate(${seconds * 6}deg)`,
            transformOrigin: '140px 140px',
          }}
        >
          <circle
            cx="140"
            cy="6"
            r="3.5"
            className={
              active
                ? 'fill-foreground dark:fill-foreground'
                : 'fill-muted-foreground dark:fill-muted-foreground'
            }
          />
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
};

const TimeClock = () => {
  const [now, setNow] = useState<Date>(new Date());
  const [status, setStatus] = useState<AttendanceStatus>('Checked In');
  const [checkInAt, setCheckInAt] = useState<Date>(
    new Date(Date.now() - (3 * 60 + 42) * 60 * 1000)
  );
  const [checkOutAt, setCheckOutAt] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isIn = status === 'Checked In';
  const elapsed =
    (isIn ? now : (checkOutAt ?? now)).getTime() - checkInAt.getTime();
  const progress = Math.min(1.25, elapsed / SHIFT_MS);
  const expectedOut = new Date(checkInAt.getTime() + SHIFT_MS);

  const hour = now.getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const dateLabel = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const liveTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const handleClockToggle = () => {
    setIsLoading(true);
    setTimeout(() => {
      const ts = new Date();
      if (isIn) {
        setStatus('Checked Out');
        setCheckOutAt(ts);
      } else {
        setStatus('Checked In');
        setCheckInAt(ts);
        setCheckOutAt(null);
      }
      setIsLoading(false);
    }, 800);
  };

  const todayIdx = (now.getDay() + 6) % 7;
  const maxH = 10;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - todayIdx);

  const weekData = Array.from({ length: 7 }, (_, index) => {
    const currentDate = new Date(weekStart);
    currentDate.setDate(weekStart.getDate() + index);
    const hours = [8.6, 9.2, 7.4, 8.9, 4.1, 0, 0][index] ?? 0;

    return {
      dayFull: currentDate.toLocaleDateString('en-US', { weekday: 'long' }),
      dateFormatted: formatDateString(currentDate),
      hours,
    };
  });

  return (
    <>
      <Section title="Time Clock" menuId="time-clock" showBreadcrumbs>
        <div
          className="h-screen w-full overflow-hidden bg-background px-0 py-3 text-foreground antialiased transition-colors duration-300 dark:bg-background dark:text-foreground"
          style={{
            fontFamily:
              "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
          }}
        >
          <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'); .tnum{font-variant-numeric:tabular-nums}`}</style>

          <div className="flex h-full w-full flex-col justify-between px-2 sm:px-4">
            {/* Header */}
            <header className="flex flex-shrink-0 items-end justify-between px-1">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground dark:text-muted-foreground">
                  <CalendarDays
                    size={14}
                    className="text-primary dark:text-primary"
                  />
                  {dateLabel}
                </p>
                <h1 className="mt-0.5 text-xl font-extrabold tracking-tight sm:text-2xl">
                  {greeting}
                </h1>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm dark:border-border dark:bg-card dark:text-foreground">
                <Laptop size={14} className="text-primary dark:text-primary" />
                <span className="tnum">{liveTime}</span>
              </div>
            </header>

            {/* Dashboard Main Grid Layout */}
            <div className="grid flex-1 grid-cols-1 gap-3 py-2 lg:grid-cols-12">
              {/* Top Left: Main Clock Block */}
              <Card className="flex flex-col justify-between rounded-xl p-3 shadow-sm backdrop-blur-sm lg:col-span-4 xl:col-span-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs uppercase">
                    Today's attendance
                  </CardTitle>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${
                      isIn
                        ? 'bg-primary/10 text-primary ring-primary/30 dark:bg-primary/10 dark:text-primary dark:ring-primary/30'
                        : 'bg-muted text-muted-foreground ring-ring dark:bg-muted/80 dark:text-foreground dark:ring-ring'
                    }`}
                  >
                    <span className="relative flex h-1.5 w-1.5">
                      {isIn && (
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                      )}
                      <span
                        className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                          isIn ? 'bg-primary dark:bg-primary' : 'bg-muted'
                        }`}
                      />
                    </span>
                    {status}
                  </span>
                </div>

                <div className="my-auto py-1">
                  <Dial
                    progress={progress}
                    seconds={now.getSeconds()}
                    active={isIn}
                  >
                    <p className="text-[10px] font-medium text-muted-foreground dark:text-muted-foreground">
                      {isIn ? 'Checked in for' : 'Worked today'}
                    </p>
                    <p className="tnum text-xl font-extrabold tracking-tight xl:text-2xl">
                      {fmtClock(elapsed)}
                    </p>
                    <p className="tnum text-[10px] text-muted-foreground dark:text-muted-foreground">
                      {Math.min(100, Math.round(progress * 100))}% of 9h
                    </p>
                  </Dial>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-3 divide-x divide-border rounded-lg bg-muted py-1.5 text-center">
                    <div>
                      <p className="text-[10px] text-muted-foreground dark:text-muted-foreground">
                        In
                      </p>
                      <p className="tnum text-[11px] font-bold text-foreground dark:text-foreground">
                        {fmtHM(checkInAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground dark:text-muted-foreground">
                        Out
                      </p>
                      <p className="tnum text-[11px] font-bold text-foreground dark:text-foreground">
                        {fmtHM(isIn ? expectedOut : (checkOutAt ?? now))}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground dark:text-muted-foreground">
                        Now
                      </p>
                      <p className="tnum text-[11px] font-bold text-foreground dark:text-foreground">
                        {liveTime.split(' ')[0]}
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="default"
                    onClick={handleClockToggle}
                    disabled={isLoading}
                    className={`flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition focus:outline-none active:scale-[0.99] disabled:opacity-70 ${
                      isIn
                        ? 'bg-muted text-foreground hover:bg-muted/80'
                        : 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90'
                    }`}
                  >
                    {isLoading ? (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current/40 border-t-current" />
                    ) : isIn ? (
                      <>
                        <LogOut size={14} /> Check out
                      </>
                    ) : (
                      <>
                        <LogIn size={14} /> Check in
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground dark:text-muted-foreground">
                    <span className="flex items-center gap-1 text-primary dark:text-primary">
                      <MapPin size={12} /> Verified
                    </span>
                    <a
                      href="#"
                      className="flex items-center gap-0.5 hover:underline"
                    >
                      <ShieldCheck size={12} /> Consent
                    </a>
                  </div>
                </div>
              </Card>

              {/* Top Right: Weekly Bar Graph Block */}
              <Card className="flex flex-col justify-between rounded-xl p-4 shadow-sm backdrop-blur-sm lg:col-span-8 xl:col-span-9">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xs uppercase">
                      Hours logged this week
                    </CardTitle>
                    <p className="text-[11px] text-muted-foreground dark:text-muted-foreground">
                      Daily target: 8 hours
                    </p>
                  </div>
                  <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary dark:bg-primary/10 dark:text-primary">
                    Avg: 7.6 hrs/day
                  </span>
                </div>

                <div className="relative my-auto h-36 w-full pt-4">
                  <div
                    className="absolute inset-x-0 border-t border-dashed border-border dark:border-border"
                    style={{ bottom: `${(8 / maxH) * 100}%` }}
                  >
                    <span className="absolute -top-2.5 right-0 text-[9px] font-semibold text-muted-foreground">
                      8h Target
                    </span>
                  </div>

                  <div className="relative flex h-full items-end gap-3 sm:gap-6">
                    {weekData.map((day, index) => {
                      const isToday = index === todayIdx;
                      const h = isToday
                        ? Math.max(day.hours, elapsed / 3600000)
                        : day.hours;

                      return (
                        <div
                          key={day.dateFormatted}
                          className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
                        >
                          <span className="tnum text-[11px] font-bold text-muted-foreground dark:text-foreground">
                            {h > 0 ? h.toFixed(1) : '-'}
                          </span>
                          {/* Consistent Green color for all bars in both Light & Dark modes */}
                          <div
                            className={`w-full rounded-t-md transition-all duration-500 ${
                              h === 0
                                ? 'bg-primary/10 dark:bg-primary/10'
                                : 'bg-primary dark:bg-primary hover:bg-primary dark:hover:bg-primary'
                            }`}
                            style={{
                              height: `${Math.max(4, (h / maxH) * 100)}%`,
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* X-Axis labels with Full Day Name and DD-MM-YYYY format */}
                <div className="flex gap-3 sm:gap-6 border-t border-border pt-2 dark:border-border">
                  {weekData.map(day => (
                    <div key={day.dateFormatted} className="flex-1 text-center">
                      <div className="text-[11px] font-semibold text-foreground dark:text-foreground truncate">
                        {day.dayFull}
                      </div>
                      <div className="text-[10px] text-muted-foreground dark:text-muted-foreground tnum">
                        {day.dateFormatted}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 gap-3 lg:col-span-12 lg:grid-cols-12">
                {/* Today's Timeline */}
                <Card className="rounded-xl p-3 shadow-sm backdrop-blur-sm lg:col-span-5">
                  <CardTitle className="text-xs uppercase">
                    Today's timeline
                  </CardTitle>
                  <ol className="relative mt-2.5 space-y-2.5 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-0.8rem)] before:w-px before:bg-muted dark:before:bg-muted">
                    {[
                      {
                        icon: LogIn,
                        title: 'Checked in',
                        time: fmtHM(checkInAt),
                        done: true,
                      },
                      {
                        icon: Coffee,
                        title: 'Lunch break',
                        time: '1:00 PM',
                        done: now.getHours() >= 13,
                      },
                      {
                        icon: Flag,
                        title: isIn ? 'Expected check out' : 'Checked out',
                        time: fmtHM(isIn ? expectedOut : (checkOutAt ?? now)),
                        done: !isIn,
                      },
                    ].map(item => (
                      <li
                        key={item.title}
                        className="relative flex items-center gap-2.5"
                      >
                        <span
                          className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-background ${
                            item.done
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <item.icon size={12} />
                        </span>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-foreground dark:text-foreground">
                            {item.title}
                          </p>
                        </div>
                        <span className="tnum text-[11px] text-muted-foreground dark:text-muted-foreground">
                          {item.time}
                        </span>
                      </li>
                    ))}
                  </ol>
                </Card>

                {/* Leave Balance & Metrics */}
                <div className="grid grid-cols-2 gap-3 lg:col-span-4">
                  <Card className="flex flex-col justify-between rounded-xl p-3 shadow-sm backdrop-blur-sm">
                    <CardTitle className="text-xs uppercase">
                      Leave left
                    </CardTitle>
                    <div>
                      <p className="text-xl font-extrabold tracking-tight text-foreground dark:text-foreground">
                        {LEAVE_LEFT}
                        <span className="ml-1 text-xs font-medium text-muted-foreground dark:text-muted-foreground">
                          / {LEAVE_TOTAL}d
                        </span>
                      </p>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted dark:bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${(LEAVE_LEFT / LEAVE_TOTAL) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="flex flex-col justify-between rounded-xl p-3 shadow-sm backdrop-blur-sm">
                    <CardTitle className="text-xs uppercase">
                      On-time rate
                    </CardTitle>
                    <div>
                      <p className="text-xl font-extrabold tracking-tight text-primary dark:text-primary">
                        {ON_TIME}%
                      </p>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted dark:bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${ON_TIME}%` }}
                        />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card className="flex flex-col justify-between rounded-xl p-2 shadow-sm backdrop-blur-sm lg:col-span-3">
                  <div className="px-2 pt-1">
                    <CardTitle className="text-xs uppercase">
                      Quick actions
                    </CardTitle>
                  </div>
                  <ul className="space-y-1">
                    {quickActions.map(action => (
                      <li key={action.label}>
                        <a
                          href={action.href}
                          className="group flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-muted/80"
                        >
                          <span className="flex h-6 w-6 items-center justify-center rounded bg-muted text-muted-foreground transition group-hover:bg-primary group-hover:text-primary-foreground">
                            <action.icon size={12} />
                          </span>
                          <span className="flex-1 truncate">
                            <span className="block text-xs font-medium text-foreground dark:text-foreground">
                              {action.label}
                            </span>
                          </span>
                          <ChevronRight
                            size={12}
                            className="text-muted-foreground transition group-hover:translate-x-0.5"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default TimeClock;
