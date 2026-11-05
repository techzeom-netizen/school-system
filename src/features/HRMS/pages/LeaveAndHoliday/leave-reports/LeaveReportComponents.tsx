import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  type DonutSlice,
  chartCircumference,
  formatDays,
} from './leaveReportData';
export interface LeaveBreakdownCardProps {
  title: string;
  subtitle: string;
  slices: DonutSlice[];
  total: number;
  insight: string;
  activeLabel: string | null;
  onSliceClick: (label: string) => void;
}

export const LeaveBreakdownCard = ({
  title,
  subtitle,
  slices,
  total,
  insight,
  activeLabel,
  onSliceClick,
}: LeaveBreakdownCardProps) => {
  const visibleSlices = slices.filter(slice => slice.value > 0);
  let offset = 0;

  return (
    <Card className="border-border p-4 sm:p-5">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mb-4 text-sm text-muted-foreground">{subtitle}</p>

      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
        <div
          className="relative mx-auto h-44 w-44"
          role="img"
          aria-label={`${title} ${visibleSlices
            .map(
              slice =>
                `${slice.label} ${Math.round((slice.value / total) * 100)}%`
            )
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
              visibleSlices.map(slice => {
                const length = (chartCircumference * slice.value) / total;
                const circle = (
                  <circle
                    key={slice.label}
                    cx="60"
                    cy="60"
                    r="42"
                    fill="none"
                    className={`stroke-current ${slice.color}`}
                    strokeWidth={activeLabel === slice.label ? '22' : '18'}
                    opacity={
                      activeLabel && activeLabel !== slice.label ? 0.35 : 1
                    }
                    strokeDasharray={`${length} ${chartCircumference}`}
                    strokeDashoffset={-offset}
                  />
                );

                offset += length;
                return circle;
              })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-bold text-foreground">
              {total === 0 ? '0' : formatDays(total)}
            </span>
            <span className="text-xs font-medium">total leave</span>
          </div>
        </div>

        <div className="divide-y divide-border text-sm">
          {visibleSlices.length === 0 ? (
            <p className="py-2 text-muted-foreground">
              No leave was taken in this period.
            </p>
          ) : (
            visibleSlices.map(slice => (
              <Button
                key={slice.label}
                type="button"
                variant="ghost"
                aria-pressed={activeLabel === slice.label}
                aria-label={`Filter by ${slice.label}`}
                onClick={() => onSliceClick(slice.label)}
                className={cn(
                  'flex h-auto w-full items-center justify-between gap-3 rounded-none py-2 text-sm font-normal',
                  activeLabel === slice.label && 'bg-primary/10'
                )}
              >
                <span className="flex min-w-0 flex-1 items-center gap-2 text-left">
                  <span
                    className={cn(
                      'h-2.5 w-2.5 shrink-0 rounded-full bg-current',
                      slice.color
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate font-medium text-foreground">
                    {slice.label}
                  </span>
                </span>
                <span className="text-right text-muted-foreground">
                  {Math.round((slice.value / total) * 100)}%
                </span>
                <span className="text-right font-semibold text-foreground">
                  {slice.value} d
                </span>
              </Button>
            ))
          )}
        </div>
      </div>

      {insight && (
        <div className="mt-4 flex items-center gap-3 rounded-lg bg-muted/60 p-3 text-sm text-foreground">
          <Info className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span>{insight}</span>
        </div>
      )}
    </Card>
  );
};
