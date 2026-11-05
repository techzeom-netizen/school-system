import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Download,
  Star,
  Ticket,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import Section from '@/components/common/Section';
import FormField from '@/components/common/FormField';
import DataChart from '@/components/common/DataChart';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Period = 'This month' | 'This quarter' | 'This year';
type ReportTab = 'Overview' | 'Topics' | 'Response time';
type StatusKey = 'Resolved' | 'Closed' | 'Open' | 'In progress';
type PriorityKey = 'High' | 'Medium' | 'Low';

type PeriodData = {
  status: Record<StatusKey, number>;
  satisfaction: number;
  avgResolveDays: number;
  deltas: {
    total: number;
    resolved: number;
    resolveTime: number;
    satisfaction: number;
  };
  topics: Array<{ name: string; count: number }>;
  response: Array<{
    priority: PriorityKey;
    count: number;
    avgFirstResponseHours: number;
    targetHours: number;
  }>;
};

type ActivityItem = {
  id: string;
  subject: string;
  detail: string;
  status: StatusKey;
  at: string;
};

const periods: Period[] = ['This month', 'This quarter', 'This year'];
const reportTabs: ReportTab[] = ['Overview', 'Topics', 'Response time'];
const statusOrder: StatusKey[] = ['Resolved', 'Closed', 'Open', 'In progress'];

const periodOptions = periods.map(period => ({ value: period, label: period }));

const statusColor: Record<StatusKey, { chart: string; dot: string }> = {
  Resolved: { chart: 'hsl(var(--primary))', dot: 'bg-primary' },
  Closed: {
    chart: 'hsl(var(--muted-foreground))',
    dot: 'bg-muted-foreground',
  },
  Open: {
    chart: 'hsl(var(--secondary-foreground))',
    dot: 'bg-secondary-foreground',
  },
  'In progress': {
    chart: 'hsl(var(--accent-foreground))',
    dot: 'bg-accent-foreground',
  },
};

const priorityDot: Record<PriorityKey, string> = {
  High: 'bg-destructive',
  Medium: 'bg-accent-foreground',
  Low: 'bg-muted-foreground',
};

const reportData: Record<Period, PeriodData> = {
  'This month': {
    status: { Resolved: 7, Closed: 2, Open: 2, 'In progress': 1 },
    satisfaction: 4.5,
    avgResolveDays: 1.6,
    deltas: { total: -8, resolved: 5, resolveTime: -12, satisfaction: 2 },
    topics: [
      { name: 'Payroll', count: 4 },
      { name: 'IT Support', count: 3 },
      { name: 'Leave', count: 2 },
      { name: 'Attendance', count: 2 },
      { name: 'Admin', count: 1 },
      { name: 'Other', count: 0 },
    ],
    response: [
      {
        priority: 'High',
        count: 3,
        avgFirstResponseHours: 2.8,
        targetHours: 4,
      },
      {
        priority: 'Medium',
        count: 6,
        avgFirstResponseHours: 7.1,
        targetHours: 8,
      },
      { priority: 'Low', count: 3, avgFirstResponseHours: 26, targetHours: 24 },
    ],
  },
  'This quarter': {
    status: { Resolved: 18, Closed: 5, Open: 3, 'In progress': 1 },
    satisfaction: 4.7,
    avgResolveDays: 2.1,
    deltas: { total: 6, resolved: 11, resolveTime: 4, satisfaction: 4 },
    topics: [
      { name: 'Payroll', count: 8 },
      { name: 'IT Support', count: 6 },
      { name: 'Leave', count: 5 },
      { name: 'Attendance', count: 4 },
      { name: 'Admin', count: 3 },
      { name: 'Other', count: 1 },
    ],
    response: [
      {
        priority: 'High',
        count: 8,
        avgFirstResponseHours: 3.5,
        targetHours: 4,
      },
      {
        priority: 'Medium',
        count: 13,
        avgFirstResponseHours: 6.9,
        targetHours: 8,
      },
      { priority: 'Low', count: 6, avgFirstResponseHours: 22, targetHours: 24 },
    ],
  },
  'This year': {
    status: { Resolved: 31, Closed: 8, Open: 5, 'In progress': 4 },
    satisfaction: 4.6,
    avgResolveDays: 1.8,
    deltas: { total: 12, resolved: 18, resolveTime: -9, satisfaction: 3 },
    topics: [
      { name: 'Payroll', count: 14 },
      { name: 'IT Support', count: 11 },
      { name: 'Leave', count: 9 },
      { name: 'Attendance', count: 7 },
      { name: 'Admin', count: 4 },
      { name: 'Other', count: 3 },
    ],
    response: [
      {
        priority: 'High',
        count: 15,
        avgFirstResponseHours: 3.2,
        targetHours: 4,
      },
      {
        priority: 'Medium',
        count: 22,
        avgFirstResponseHours: 6.5,
        targetHours: 8,
      },
      {
        priority: 'Low',
        count: 11,
        avgFirstResponseHours: 20,
        targetHours: 24,
      },
    ],
  },
};

const ago = (days: number, hour: number, minute: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

const recentActivity: ActivityItem[] = [
  {
    id: 'a1',
    subject: 'Payslip shows wrong deductions',
    detail: 'New ticket raised',
    status: 'Open',
    at: ago(1, 10, 20),
  },
  {
    id: 'a2',
    subject: 'Laptop not connecting to VPN',
    detail: 'Rahul (IT) is working on it',
    status: 'In progress',
    at: ago(2, 11, 30),
  },
  {
    id: 'a3',
    subject: 'Update bank account details',
    detail: 'Resolved by Priya (HR)',
    status: 'Resolved',
    at: ago(6, 16, 45),
  },
  {
    id: 'a4',
    subject: 'ID card replacement',
    detail: 'Resolved by Kiran (Admin)',
    status: 'Resolved',
    at: ago(11, 14, 10),
  },
];

const formatShortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

const formatHours = (hours: number) =>
  hours >= 24 ? `${(hours / 24).toFixed(1)} days` : `${hours} hrs`;

const percentOf = (value: number, total: number) =>
  total === 0 ? 0 : Math.round((value / total) * 100);

type KpiCardProps = {
  label: string;
  value: string;
  suffix?: string;
  icon: LucideIcon;
  iconClass: string;
  delta: number;
  lowerIsBetter?: boolean;
  valueClass?: string;
};

const KpiCard = ({
  label,
  value,
  suffix,
  icon: Icon,
  iconClass,
  delta,
  lowerIsBetter = false,
  valueClass = 'text-foreground',
}: KpiCardProps) => {
  const isGood = lowerIsBetter ? delta <= 0 : delta >= 0;
  const DeltaIcon = delta >= 0 ? TrendingUp : TrendingDown;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-background to-muted/40 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconClass}`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
            isGood
              ? 'bg-primary/10 text-primary'
              : 'bg-destructive/10 text-destructive'
          }`}
          title="Compared with the previous period"
        >
          <DeltaIcon className="h-3 w-3" aria-hidden="true" />
          {Math.abs(delta)}%
        </span>
      </div>

      <p className={`mt-4 text-3xl font-bold tracking-tight ${valueClass}`}>
        {value}
        {suffix && (
          <span className="ml-1 text-base font-medium text-muted-foreground">
            {suffix}
          </span>
        )}
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
};

const HelpdeskReportPage = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>('Overview');
  const [period, setPeriod] = useState<Period>('This year');

  const data = reportData[period];

  const total = useMemo(
    () => statusOrder.reduce((sum, status) => sum + data.status[status], 0),
    [data]
  );
  const resolvedTotal = data.status.Resolved + data.status.Closed;
  const resolutionRate = percentOf(resolvedTotal, total);

  const maxTopicCount = Math.max(...data.topics.map(topic => topic.count), 1);

  const handleDownload = () => {
    const rows: string[][] = [
      ['Helpdesk report', period],
      [],
      ['Metric', 'Value'],
      ['Total tickets', String(total)],
      ['Resolved (incl. closed)', String(resolvedTotal)],
      ['Average time to resolve (days)', String(data.avgResolveDays)],
      ['Satisfaction (out of 5)', String(data.satisfaction)],
      [],
      ['Status', 'Tickets', 'Share'],
      ...statusOrder.map(status => [
        status,
        String(data.status[status]),
        `${percentOf(data.status[status], total)}%`,
      ]),
      [],
      ['Topic', 'Tickets'],
      ...data.topics.map(topic => [topic.name, String(topic.count)]),
      [],
      ['Priority', 'Tickets', 'Avg first response (hrs)', 'Target (hrs)'],
      ...data.response.map(item => [
        item.priority,
        String(item.count),
        String(item.avgFirstResponseHours),
        String(item.targetHours),
      ]),
    ];

    const csv = rows
      .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const url = URL.createObjectURL(
      new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = `helpdesk-report-${period.toLowerCase().replace(/\s+/g, '-')}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success('Report downloaded.');
  };

  return (
    <>
      <Section
        title="Helpdesk Reports"
        menuId="helpdesk-reports"
        showBreadcrumbs
      >
        <div className="mb-5 flex flex-col gap-3  lg:flex-row lg:items-end lg:justify-between">
          <div
            role="tablist"
            aria-label="Report sections"
            className="flex gap-1"
          >
            {reportTabs.map(tab => {
              const selected = activeTab === tab;
              return (
                <Button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveTab(tab)}
                  variant="ghost"
                  className={`relative h-auto shrink-0 rounded-md px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary ${
                    selected
                      ? 'font-semibold text-primary after:absolute after:inset-x-3 after:-bottom-3 after:h-0.5 after:rounded-full '
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </Button>
              );
            })}
          </div>

          <div className="flex w-full items-end gap-2 sm:w-auto">
            <div className="min-w-40 flex-1 sm:flex-none">
              <FormField
                label="Period"
                name="report-period"
                type="select"
                value={period}
                onChange={value => setPeriod(value as Period)}
                options={periodOptions}
              />
            </div>
            <Button type="button" variant="default" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
          <KpiCard
            label="Total tickets"
            value={String(total)}
            icon={Ticket}
            iconClass="bg-primary/10 text-primary"
            delta={data.deltas.total}
          />
          <KpiCard
            label={`Resolved · ${resolutionRate}% rate`}
            value={String(resolvedTotal)}
            icon={CheckCircle2}
            iconClass="bg-primary/10 text-primary"
            delta={data.deltas.resolved}
            valueClass="text-primary"
          />
          <KpiCard
            label="Average time to resolve"
            value={String(data.avgResolveDays)}
            suffix="days"
            icon={Clock}
            iconClass="bg-accent text-accent-foreground"
            delta={data.deltas.resolveTime}
            lowerIsBetter
          />
          <KpiCard
            label="Satisfaction"
            value={data.satisfaction.toFixed(1)}
            suffix="/ 5"
            icon={Star}
            iconClass="bg-secondary text-secondary-foreground"
            delta={data.deltas.satisfaction}
          />
        </div>

        {activeTab === 'Overview' && (
          <div role="tabpanel" className="grid gap-3 lg:grid-cols-2">
            <DataChart
              title="Tickets by status"
              subtitle={`Status breakdown · ${period.toLowerCase()}`}
              data={statusOrder.map(status => ({
                label: `${status} · ${percentOf(data.status[status], total)}%`,
                value: data.status[status],
                color: statusColor[status].chart,
              }))}
              type="pie"
              height={260}
              showValues
            />

            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                Recent activity
              </h3>

              <div
                className="relative space-y-4 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-px before:bg-border"
                role="list"
              >
                {recentActivity.map(item => (
                  <div
                    key={item.id}
                    className="relative flex items-start justify-between gap-3 pl-6"
                    role="listitem"
                  >
                    <span
                      className={`absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full ring-4 ring-card ${statusColor[item.status].dot}`}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {item.subject}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatShortDate(item.at)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Topics' && (
          <div
            role="tabpanel"
            className="rounded-xl border border-border bg-muted/20 p-4"
          >
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-foreground">
                Tickets by topic
              </h3>
              <p className="text-xs text-muted-foreground">
                Where most requests come from · {period.toLowerCase()}
              </p>
            </div>

            <div className="space-y-4" role="list">
              {data.topics.map((topic, index) => (
                <div key={topic.name} role="listitem">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {topic.name}
                      {index === 0 && topic.count > 0 && (
                        <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                          Most requested
                        </span>
                      )}
                    </span>
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {topic.count}
                      </span>{' '}
                      · {percentOf(topic.count, total)}%
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary transition-all duration-500"
                      style={{
                        width: `${(topic.count / maxTopicCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Response time' && (
          <div role="tabpanel" className="grid gap-4 md:grid-cols-3">
            {data.response.map(item => {
              const withinTarget =
                item.avgFirstResponseHours <= item.targetHours;
              const ratio = Math.min(
                (item.avgFirstResponseHours / item.targetHours) * 100,
                100
              );

              return (
                <div
                  key={item.priority}
                  className="rounded-xl border border-border bg-gradient-to-br from-background to-muted/40 p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${priorityDot[item.priority]}`}
                        aria-hidden="true"
                      />
                      {item.priority} priority
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        withinTarget
                          ? 'bg-primary/10 text-primary'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {withinTarget ? 'Within target' : 'Over target'}
                    </span>
                  </div>

                  <p className="mt-4 text-3xl font-bold tracking-tight text-foreground">
                    {formatHours(item.avgFirstResponseHours)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Avg first response
                  </p>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        withinTarget ? 'bg-primary' : 'bg-destructive'
                      }`}
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>Target {formatHours(item.targetHours)}</span>
                    <span>{item.count} tickets</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>
    </>
  );
};

export default HelpdeskReportPage;
