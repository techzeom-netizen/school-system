import { Download, type LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { DonutSlice, PayrollReport } from './payrollReportTypes';

const chartCircumference = 2 * Math.PI * 42;
export const SummaryCard = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) => (
  <Card className="min-w-0 space-y-1 rounded-xl border-border p-4">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="break-words text-2xl font-bold text-card-foreground">
      {value}
    </p>
    <p className="text-xs text-muted-foreground">{hint}</p>
  </Card>
);

export const MetricCard = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon?: LucideIcon;
}) => (
  <Card className="min-w-0 rounded-lg border-border p-4">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="mt-1 flex min-w-0 items-center gap-2 break-words text-xl font-semibold text-card-foreground">
      {Icon && (
        <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
      )}
      {value}
    </p>
  </Card>
);

export const DonutChart = ({
  slices,
  centerValue,
  centerLabel,
  label,
  formatValue,
}: {
  slices: DonutSlice[];
  centerValue: string;
  centerLabel: string;
  label: string;
  formatValue: (value: number) => string;
}) => {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  let offset = 0;

  return (
    <div
      className="relative mx-auto h-44 w-44 shrink-0"
      role="img"
      aria-label={`${label}: ${slices
        .map(slice => `${slice.label} ${formatValue(slice.value)}`)
        .join(', ')}`}
    >
      <svg
        className="h-full w-full -rotate-90"
        viewBox="0 0 120 120"
        aria-hidden="true"
      >
        <circle
          cx="60"
          cy="60"
          r="42"
          fill="none"
          className="stroke-muted"
          strokeWidth="18"
        />
        {total > 0 &&
          slices
            .filter(slice => slice.value > 0)
            .map(slice => {
              const length = (chartCircumference * slice.value) / total;
              const circle = (
                <circle
                  key={slice.label}
                  cx="60"
                  cy="60"
                  r="42"
                  fill="none"
                  className={`stroke-current ${slice.color}`}
                  strokeWidth="18"
                  strokeDasharray={`${length} ${chartCircumference}`}
                  strokeDashoffset={-offset}
                />
              );

              offset += length;
              return circle;
            })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xl font-bold text-card-foreground">
          {centerValue}
        </span>
        <span className="text-xs text-muted-foreground">{centerLabel}</span>
      </div>
    </div>
  );
};

export const DonutLegend = ({
  slices,
  formatValue,
}: {
  slices: DonutSlice[];
  formatValue: (value: number) => string;
}) => {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);

  return (
    <div className="min-w-0 divide-y divide-border text-sm">
      {slices.map(slice => (
        <div
          key={slice.label}
          className="flex items-center justify-between gap-3 py-2"
        >
          <span className="flex min-w-0 items-center gap-2">
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full bg-current ${slice.color}`}
              aria-hidden="true"
            />
            <span className="truncate">{slice.label}</span>
          </span>
          <span className="whitespace-nowrap font-semibold text-card-foreground">
            {formatValue(slice.value)}
            <span className="ml-2 font-normal text-muted-foreground">
              {total === 0
                ? '0%'
                : `${Math.round((slice.value / total) * 100)}%`}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
};

export const ReportCard = ({
  report,
  onView,
  onDownload,
}: {
  report: PayrollReport;
  onView: () => void;
  onDownload: () => void;
}) => {
  const Icon = report.icon;

  return (
    <Card className="flex flex-col gap-4 rounded-xl border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${report.iconClass}`}
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <Badge variant="secondary" className="bg-muted text-muted-foreground">
          {report.category}
        </Badge>
      </div>

      <div className="min-w-0">
        <h3 className="font-semibold text-card-foreground">{report.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {report.description}
        </p>
      </div>

      <div className="mt-auto flex gap-2.5">
        <Button type="button" className="flex-1" onClick={onView}>
          View report
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Download ${report.name}`}
          onClick={onDownload}
        >
          <Download className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </Card>
  );
};
