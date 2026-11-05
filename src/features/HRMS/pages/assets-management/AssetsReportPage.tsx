import { type FormEvent, useMemo, useRef, useState } from 'react';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';

import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import {
  assetReportDefinitions,
  initialAssetReportRecords,
  type AssetReportId,
  type AssetReportRange,
  type AssetReportRecord,
  type AssetReportStatus,
} from '@/data/assetReportData';
import {
  assetReportCategoryChartOptions as categoryConfig,
  assetReportCategoryOptions,
  assetReportDepartmentOptions,
  assetReportFormatOptions,
  assetReportFrequencyOptions,
  assetReportLocationOptions,
  assetReportRangeOptions,
  assetReportScheduleOptions,
  assetReportStatusChartOptions as statusConfig,
} from '@/data/reusableDropdownData';
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

type AttentionKind = 'warranty' | 'overdue' | 'unconfirmed' | 'repairs';

type ReportKey = AssetReportId | 'full';
type ChartColor = 'blue' | 'orange' | 'aqua' | 'yellow' | 'pink';

interface PieSlice {
  label: string;
  value: number;
  color: ChartColor;
}

interface ScheduledReport {
  id: string;
  reportKey: ReportKey;
  reportLabel: string;
  frequency: string;
  format: string;
  email: string;
}

const chartColors: Record<ChartColor, { fill: string; swatch: string }> = {
  blue: { fill: 'fill-primary', swatch: 'bg-primary' },
  orange: { fill: 'fill-accent-foreground', swatch: 'bg-accent-foreground' },
  aqua: {
    fill: 'fill-secondary-foreground',
    swatch: 'bg-secondary-foreground',
  },
  yellow: { fill: 'fill-muted-foreground', swatch: 'bg-muted-foreground' },
  pink: { fill: 'fill-destructive', swatch: 'bg-destructive' },
};

const attentionConfig: {
  kind: AttentionKind;
  label: string;
  title: string;
  badgeClass: string;
}[] = [
  {
    kind: 'warranty',
    label: 'Warranties ending in 30 days',
    title: 'Warranties ending in 30 days',
    badgeClass: 'bg-accent text-accent-foreground',
  },
  {
    kind: 'overdue',
    label: 'Returns overdue',
    title: 'Returns overdue',
    badgeClass: 'bg-destructive/10 text-destructive',
  },
  {
    kind: 'unconfirmed',
    label: 'Not confirmed by employees for 7+ days',
    title: 'Not confirmed by employees',
    badgeClass: 'bg-primary/10 text-primary',
  },
  {
    kind: 'repairs',
    label: 'Repairs open for 10+ days',
    title: 'Repairs open for 10+ days',
    badgeClass: 'bg-accent text-accent-foreground',
  },
];

const warrantyWindowDays = 30;
const unconfirmedAfterDays = 7;
const repairAfterDays = 10;
const minEmailLength = 5;

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date.length === 10 ? `${date}T00:00:00` : date));

const formatMoney = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

const formatCompactMoney = (amount: number) => {
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(2)} Cr`;
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(1)} L`;
  return formatMoney(amount);
};

const formatPercent = (value: number, total: number, digits = 1) =>
  total === 0 ? '0%' : `${((value / total) * 100).toFixed(digits)}%`;

const todayIso = () => new Date().toLocaleDateString('en-CA');

const toIso = (date: Date) => date.toLocaleDateString('en-CA');

const daysSince = (date: string) => {
  const today = new Date(`${todayIso()}T00:00:00`).getTime();
  const target = new Date(`${date}T00:00:00`).getTime();
  return Math.round((today - target) / 86_400_000);
};

const getRangeStart = (range: AssetReportRange): string | null => {
  const now = new Date();
  if (range === 'month') {
    return toIso(new Date(now.getFullYear(), now.getMonth(), 1));
  }
  if (range === 'quarter') {
    return toIso(
      new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
    );
  }
  if (range === 'year') return toIso(new Date(now.getFullYear(), 0, 1));
  return null;
};

const isRange = (value: string): value is AssetReportRange =>
  assetReportRangeOptions.some(option => option.value === value);

const getOptionLabel = (
  options: { value: string; label: string }[],
  value: string
) => options.find(option => option.value === value)?.label ?? value;

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isAttention = (asset: AssetReportRecord, kind: AttentionKind) => {
  if (kind === 'warranty') {
    const left = -daysSince(asset.warrantyEnd);
    return (
      asset.status !== 'retired' && left >= 0 && left <= warrantyWindowDays
    );
  }
  if (kind === 'overdue') {
    return (
      asset.status === 'allocated' &&
      asset.returnDueOn !== null &&
      daysSince(asset.returnDueOn) > 0
    );
  }
  if (kind === 'unconfirmed') {
    return (
      asset.status === 'allocated' &&
      asset.confirmedAt === null &&
      asset.allocatedOn !== null &&
      daysSince(asset.allocatedOn) >= unconfirmedAfterDays
    );
  }
  return (
    asset.status === 'repair' &&
    asset.repairSince !== null &&
    daysSince(asset.repairSince) >= repairAfterDays
  );
};

const getAttentionDetail = (asset: AssetReportRecord, kind: AttentionKind) => {
  if (kind === 'warranty')
    return `Warranty ends ${formatDate(asset.warrantyEnd)}`;
  if (kind === 'overdue' && asset.returnDueOn) {
    return `${daysSince(asset.returnDueOn)} days overdue`;
  }
  if (kind === 'unconfirmed' && asset.allocatedOn) {
    return `Given ${daysSince(asset.allocatedOn)} days ago`;
  }
  if (kind === 'repairs' && asset.repairSince) {
    return `In repair for ${daysSince(asset.repairSince)} days`;
  }
  return '';
};

const SummaryStat = ({
  label,
  value,
  help,
  isAlert = false,
}: {
  label: string;
  value: string | number;
  help: string;
  isAlert?: boolean;
}) => (
  <Card className="space-y-1.5 p-5">
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p
      className={`text-3xl font-semibold ${
        isAlert ? 'text-destructive' : 'text-card-foreground'
      }`}
    >
      {value}
    </p>
    <p className="text-sm text-muted-foreground">{help}</p>
  </Card>
);

const polarPoint = (angle: number, radius: number) => ({
  x: 100 + radius * Math.cos(angle),
  y: 100 + radius * Math.sin(angle),
});

const PieChart = ({
  title,
  description,
  slices,
}: {
  title: string;
  description: string;
  slices: PieSlice[];
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  const active = activeIndex === null ? null : slices[activeIndex];

  let startAngle = -Math.PI / 2;
  const paths = slices.map((slice, index) => {
    if (slice.value === 0) return null;
    const sweep = (slice.value / total) * 2 * Math.PI;
    const endAngle = startAngle + sweep;
    const start = polarPoint(startAngle, 98);
    const end = polarPoint(endAngle, 98);
    const largeArc = sweep > Math.PI ? 1 : 0;
    const path = `M100,100 L${start.x},${start.y} A98,98 0 ${largeArc} 1 ${end.x},${end.y} Z`;
    startAngle = endAngle;
    const dim = activeIndex !== null && activeIndex !== index;
    const className = `${chartColors[slice.color].fill} stroke-card transition-opacity ${
      dim ? 'opacity-40' : 'opacity-100'
    }`;
    const shared = {
      className,
      strokeWidth: 3,
      onMouseEnter: () => setActiveIndex(index),
      onMouseLeave: () => setActiveIndex(null),
    };

    return sweep >= 2 * Math.PI - 0.0001 ? (
      <circle key={slice.label} {...shared} cx="100" cy="100" r="98">
        <title>{`${slice.label}: ${slice.value}`}</title>
      </circle>
    ) : (
      <path key={slice.label} {...shared} d={path}>
        <title>{`${slice.label}: ${slice.value} (${formatPercent(slice.value, total)})`}</title>
      </path>
    );
  });

  return (
    <Card className="space-y-5 p-5 sm:p-6">
      <div>
        <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {total === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No assets match these filters.
        </p>
      ) : (
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="w-full max-w-[13.5rem] shrink-0 space-y-2 text-center">
            <svg
              viewBox="0 0 200 200"
              className="h-auto w-full"
              role="img"
              aria-label={`${title}: ${slices
                .map(slice => `${slice.label} ${slice.value}`)
                .join(', ')}`}
            >
              {paths}
            </svg>
            <p
              className="min-h-5 text-sm font-medium text-foreground"
              aria-live="polite"
            >
              {active
                ? `${active.label}: ${active.value} (${formatPercent(active.value, total)})`
                : `${total} assets in total`}
            </p>
          </div>

          <div
            className="w-full min-w-0 flex-1 divide-y divide-border"
            role="list"
          >
            {slices.map((slice, index) => (
              <div key={slice.label} role="listitem">
                <Button
                  type="button"
                  variant="ghost"
                  className={`h-auto w-full justify-start whitespace-normal rounded-md px-2 py-2.5 text-left text-sm font-normal transition-colors ${
                    activeIndex === index ? 'bg-muted' : 'hover:bg-muted/60'
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  onFocus={() => setActiveIndex(index)}
                  onBlur={() => setActiveIndex(null)}
                  onClick={() =>
                    setActiveIndex(current =>
                      current === index ? null : index
                    )
                  }
                >
                  <span
                    className={`h-3.5 w-3.5 shrink-0 rounded ${chartColors[slice.color].swatch}`}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1 text-foreground">
                    {slice.label}
                  </span>
                  <span className="font-semibold text-foreground">
                    {slice.value}
                  </span>
                  <span className="w-14 text-right text-muted-foreground">
                    {formatPercent(slice.value, total)}
                  </span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

const AttentionRow = ({
  count,
  label,
  badgeClass,
  onView,
}: {
  count: number;
  label: string;
  badgeClass: string;
  onView: () => void;
}) => (
  <div className="flex items-center gap-3 py-3">
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-base font-semibold ${badgeClass}`}
    >
      {count}
    </span>
    <p className="min-w-0 flex-1 text-sm text-foreground">{label}</p>
    <Button type="button" size="sm" variant="default" onClick={onView}>
      View
    </Button>
  </div>
);

const AssetsReportPage = () => {
  const [assets] = useState(initialAssetReportRecords);
  const [range, setRange] = useState<AssetReportRange>('all');
  const [department, setDepartment] = useState('all');
  const [category, setCategory] = useState('all');
  const [location, setLocation] = useState('all');

  const [attentionKind, setAttentionKind] = useState<AttentionKind | null>(
    null
  );

  const [schedules, setSchedules] = useState<ScheduledReport[]>([]);
  const scheduleSequence = useRef(0);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleReport, setScheduleReport] = useState('full');
  const [scheduleFrequency, setScheduleFrequency] = useState('Weekly');
  const [scheduleFormat, setScheduleFormat] = useState('PDF');
  const [scheduleEmail, setScheduleEmail] = useState('');

  const hasFilters =
    range !== 'all' ||
    department !== 'all' ||
    category !== 'all' ||
    location !== 'all';

  const filteredAssets = useMemo(() => {
    const start = getRangeStart(range);
    return assets.filter(
      asset =>
        (!start || asset.addedOn >= start) &&
        (department === 'all' || asset.department === department) &&
        (category === 'all' || asset.category === category) &&
        (location === 'all' || asset.location === location)
    );
  }, [assets, range, department, category, location]);

  const total = filteredAssets.length;
  const countStatus = (status: AssetReportStatus) =>
    filteredAssets.filter(asset => asset.status === status).length;
  const allocatedCount = countStatus('allocated');
  const availableCount = countStatus('available');
  const totalWorth = filteredAssets
    .filter(asset => asset.status !== 'retired')
    .reduce((sum, asset) => sum + asset.cost, 0);

  const statusSlices: PieSlice[] = statusConfig.map(item => ({
    label: item.label,
    value: countStatus(item.value),
    color: item.color,
  }));
  const categorySlices: PieSlice[] = categoryConfig.map(item => ({
    label: item.label,
    value: filteredAssets.filter(asset => asset.category === item.value).length,
    color: item.color,
  }));

  const departmentRows = useMemo(() => {
    const counts = new Map<string, number>();
    filteredAssets
      .filter(asset => asset.status === 'allocated')
      .forEach(asset =>
        counts.set(asset.department, (counts.get(asset.department) ?? 0) + 1)
      );
    return [...counts.entries()].sort((first, second) => second[1] - first[1]);
  }, [filteredAssets]);
  const topDepartmentCount = departmentRows[0]?.[1] ?? 0;

  const attentionAssets = useMemo(
    () =>
      Object.fromEntries(
        attentionConfig.map(item => [
          item.kind,
          filteredAssets.filter(asset => isAttention(asset, item.kind)),
        ])
      ) as Record<AttentionKind, AssetReportRecord[]>,
    [filteredAssets]
  );
  const attentionTotal = new Set(
    Object.values(attentionAssets).flatMap(list => list.map(asset => asset.id))
  ).size;
  const activeAttention = attentionConfig.find(
    item => item.kind === attentionKind
  );
  const activeAttentionAssets = attentionKind
    ? attentionAssets[attentionKind]
    : [];

  const clearFilters = () => {
    setRange('all');
    setDepartment('all');
    setCategory('all');
    setLocation('all');
  };

  const openScheduleDialog = () => {
    setScheduleReport('full');
    setScheduleFrequency('Weekly');
    setScheduleFormat('PDF');
    setScheduleEmail('');
    setIsScheduleOpen(true);
  };

  const handleSchedule = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = scheduleEmail.trim().toLowerCase();
    if (email.length < minEmailLength || !isEmail(email)) {
      toast.error('Enter a valid email address, for example name@company.com.');
      return;
    }
    if (
      schedules.some(
        item =>
          item.reportKey === scheduleReport &&
          item.frequency === scheduleFrequency &&
          item.format === scheduleFormat &&
          item.email === email
      )
    ) {
      toast.error('This email is already scheduled for the same report.');
      return;
    }

    scheduleSequence.current += 1;
    const reportLabel = getOptionLabel(
      assetReportScheduleOptions,
      scheduleReport
    );
    const reportKey: ReportKey = assetReportDefinitions.some(
      definition => definition.id === scheduleReport
    )
      ? (scheduleReport as AssetReportId)
      : 'full';

    setSchedules(current => [
      ...current,
      {
        id: `schedule-${scheduleSequence.current}`,
        reportKey,
        reportLabel,
        frequency: scheduleFrequency,
        format: scheduleFormat,
        email,
      },
    ]);
    toast.success(
      `${reportLabel} will be emailed to ${email} ${scheduleFrequency === 'Weekly' ? 'every week' : 'every month'}.`
    );
    setIsScheduleOpen(false);
  };

  return (
    <>
      <Section title="Assets Report" menuId="assets-reports" showBreadcrumbs>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-end gap-3">
            {hasFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 items-end gap-2 sm:grid-cols-2 xl:grid-cols-5">
            <FormField
              label="Date range"
              name="report-range"
              type="select"
              value={range}
              onChange={value => {
                if (isRange(value)) setRange(value);
              }}
              options={assetReportRangeOptions}
            />
            <FormField
              label="Department"
              name="report-department"
              type="select"
              value={department}
              onChange={setDepartment}
              options={assetReportDepartmentOptions}
            />
            <FormField
              label="Category"
              name="report-category"
              type="select"
              value={category}
              onChange={setCategory}
              options={assetReportCategoryOptions}
            />
            <FormField
              label="Location"
              name="report-location"
              type="select"
              value={location}
              onChange={setLocation}
              options={assetReportLocationOptions}
            />
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={openScheduleDialog}
            >
              <Mail className="h-4 w-4" />
              Schedule email
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryStat
              label="Total assets"
              value={total}
              help={`Worth ${formatCompactMoney(totalWorth)}`}
            />
            <SummaryStat
              label="Given to employees"
              value={allocatedCount}
              help={`${formatPercent(allocatedCount, total, 0)} of all assets`}
            />
            <SummaryStat
              label="Ready to give"
              value={availableCount}
              help="In stock now"
            />
            <SummaryStat
              label="Need attention"
              value={attentionTotal}
              help={
                attentionTotal > 0 ? 'See the list below' : 'Nothing to fix'
              }
              isAlert={attentionTotal > 0}
            />
          </div>

          <Section title="Assets overview" contentClassName="space-y-4">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PieChart
                title="Assets by status"
                description={`Where all ${total} assets are right now`}
                slices={statusSlices}
              />
              <PieChart
                title="Assets by category"
                description="What kind of assets you own"
                slices={categorySlices}
              />
            </div>
          </Section>

          <Section title="Who has what" contentClassName="space-y-4">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[3fr_2fr]">
              <Card className="space-y-5 p-5 sm:p-6">
                <div>
                  <h3 className="text-lg font-semibold text-card-foreground">
                    Assets given, by department
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {allocatedCount} assets currently with employees
                  </p>
                </div>
                {departmentRows.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                    No assets are with employees for these filters.
                  </p>
                ) : (
                  <div className="space-y-3.5" role="list">
                    {departmentRows.map(([name, count]) => (
                      <div
                        key={name}
                        className="grid grid-cols-[6.5rem_minmax(0,1fr)_2rem] items-center gap-3 text-sm sm:grid-cols-[8rem_minmax(0,1fr)_2.5rem]"
                        role="listitem"
                      >
                        <span className="truncate text-foreground">{name}</span>
                        <span
                          className="h-4 rounded bg-muted"
                          role="img"
                          aria-label={`${name}: ${count} assets`}
                        >
                          <span
                            className="block h-full rounded bg-primary"
                            style={{
                              width: `${(count / topDepartmentCount) * 100}%`,
                            }}
                          />
                        </span>
                        <span className="text-right font-semibold text-foreground">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card className="p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-card-foreground">
                  Needs your attention
                </h3>
                <p className="text-sm text-muted-foreground">Fix these first</p>
                <div className="mt-2 divide-y divide-border">
                  {attentionConfig.map(item => (
                    <AttentionRow
                      key={item.kind}
                      count={attentionAssets[item.kind].length}
                      label={item.label}
                      badgeClass={item.badgeClass}
                      onView={() => setAttentionKind(item.kind)}
                    />
                  ))}
                </div>
              </Card>
            </div>
          </Section>
        </div>
      </Section>

      <Dialog
        open={Boolean(attentionKind)}
        onOpenChange={open => !open && setAttentionKind(null)}
      >
        <DialogContent
          className="sm:max-w-lg"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{activeAttention?.title}</DialogTitle>
            <DialogDescription>
              {activeAttentionAssets.length}{' '}
              {activeAttentionAssets.length === 1 ? 'asset' : 'assets'} need
              your attention.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[50vh] divide-y divide-border overflow-y-auto rounded-lg border border-border px-3">
            {attentionKind &&
              activeAttentionAssets.map(asset => (
                <div
                  key={asset.id}
                  className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1 py-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{asset.name}</p>
                    <p className="text-muted-foreground">
                      {asset.tag}
                      {asset.holder ? ` · ${asset.holder}` : ''}
                    </p>
                  </div>
                  <p className="font-medium text-foreground">
                    {getAttentionDetail(asset, attentionKind)}
                  </p>
                </div>
              ))}
            {activeAttentionAssets.length === 0 && (
              <p className="p-6 text-center text-sm text-muted-foreground">
                Nothing to fix here. Nice work.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" onClick={() => setAttentionKind(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isScheduleOpen}
        onOpenChange={open => !open && setIsScheduleOpen(false)}
      >
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Schedule email</DialogTitle>
            <DialogDescription>
              Get a report in your inbox on a regular schedule.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSchedule} className="space-y-4">
            <FormField
              label="Report"
              name="schedule-report"
              type="select"
              value={scheduleReport}
              onChange={setScheduleReport}
              options={assetReportScheduleOptions}
              required
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                label="How often"
                name="schedule-frequency"
                type="select"
                value={scheduleFrequency}
                onChange={setScheduleFrequency}
                options={assetReportFrequencyOptions}
                required
              />
              <FormField
                label="File type"
                name="schedule-format"
                type="select"
                value={scheduleFormat}
                onChange={setScheduleFormat}
                options={assetReportFormatOptions}
                required
              />
            </div>
            <FormField
              label="Send to"
              name="schedule-email"
              value={scheduleEmail}
              onChange={setScheduleEmail}
              placeholder="e.g. hr@company.com"
              required
            />

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsScheduleOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Schedule</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssetsReportPage;
