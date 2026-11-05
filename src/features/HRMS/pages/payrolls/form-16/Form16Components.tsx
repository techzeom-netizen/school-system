import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DonutSlice } from './form16Types';

const chartCircumference = 2 * Math.PI * 42;
interface StepRowProps {
  number: number;
  warn?: boolean;
  title: string;
  text: string;
  buttonLabel: string;
  disabled: boolean;
  primary?: boolean;
  onClick: () => void;
}

export const StepRow = ({
  number,
  warn,
  title,
  text,
  buttonLabel,
  disabled,
  primary,
  onClick,
}: StepRowProps) => (
  <div className="flex items-center gap-4 py-4">
    <span
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold',
        disabled
          ? 'bg-primary text-primary-foreground'
          : warn
            ? 'bg-destructive/10 text-destructive'
            : 'bg-primary/10 text-primary'
      )}
    >
      {disabled ? <Check className="h-4 w-4" aria-hidden="true" /> : number}
    </span>
    <div className="min-w-0 flex-1">
      <p className="font-semibold text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
    <Button
      type="button"
      variant={primary ? 'default' : 'outline'}
      disabled={disabled}
      onClick={onClick}
    >
      {buttonLabel}
    </Button>
  </div>
);

export const StatusDonut = ({
  slices,
  total,
  centerValue,
  centerLabel,
}: {
  slices: DonutSlice[];
  total: number;
  centerValue: string;
  centerLabel: string;
}) => {
  let offset = 0;

  return (
    <div
      className="relative mx-auto h-44 w-44 shrink-0"
      role="img"
      aria-label={`Form 16 status: ${slices.map(slice => `${slice.label} ${slice.value}`).join(', ')}`}
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
        <span className="text-2xl font-bold text-foreground">
          {centerValue}
        </span>
        <span className="text-xs text-muted-foreground">{centerLabel}</span>
      </div>
    </div>
  );
};
