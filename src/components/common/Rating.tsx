import { Star } from 'lucide-react';

type StarsProps = {
  value: number;
  className?: string;
};

export const Stars = ({ value, className = '' }: StarsProps) => {
  const width = `${Math.max(0, Math.min(100, (value / 5) * 100))}%`;

  return (
    <span className={`relative inline-flex ${className}`} aria-hidden="true">
      <span className="flex text-slate-200">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className="h-4 w-4 fill-current" />
        ))}
      </span>
      <span
        className="absolute inset-y-0 left-0 flex overflow-hidden text-amber-400"
        style={{ width }}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className="h-4 w-4 shrink-0 fill-current" />
        ))}
      </span>
    </span>
  );
};

export const RatingPill = ({ value }: { value: number }) => {
  const tone =
    value >= 4
      ? 'bg-emerald-50 text-emerald-700'
      : value >= 3.5
        ? 'bg-amber-50 text-amber-700'
        : 'bg-orange-50 text-orange-700';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${tone}`}
    >
      {value.toFixed(1)}
      <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
    </span>
  );
};

export const RatingBar = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => {
  const percent = Math.max(0, Math.min(100, (value / 5) * 100));

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">{value.toFixed(1)}</span>
      </div>
      <div
        role="progressbar"
        aria-label={`${label} rating`}
        aria-valuemin={0}
        aria-valuemax={5}
        aria-valuenow={value}
        className="h-2 rounded-full bg-slate-100"
      >
        <div
          className="h-2 rounded-full bg-blue-600"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
