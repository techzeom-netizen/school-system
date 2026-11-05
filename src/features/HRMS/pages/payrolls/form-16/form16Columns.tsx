import type { ColumnDef } from '@tanstack/react-table';
import { ArrowDownToLine, Eye, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Form16Record } from './form16Types';
import {
  downloadForm16,
  formatCurrency,
  getStatus,
  isValidPan,
  maskPan,
  statusStyles,
} from './form16Data';
export const createForm16Columns = ({
  onFix,
  onGenerate,
  onShare,
  onPreview,
}: {
  onFix: (record: Form16Record) => void;
  onGenerate: (record: Form16Record) => void;
  onShare: (record: Form16Record) => void;
  onPreview: (record: Form16Record) => void;
}): ColumnDef<Form16Record>[] => [
  {
    accessorKey: 'name',
    header: 'Employee',
    cell: ({ row }) => (
      <div className="flex min-w-44 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
          {row.original.name
            .split(' ')
            .map(part => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.department}
          </p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'pan',
    header: 'PAN',
    cell: ({ row }) =>
      isValidPan(row.original.pan) ? (
        <span className="whitespace-nowrap font-mono text-sm">
          {maskPan(row.original.pan)}
        </span>
      ) : (
        <span className="whitespace-nowrap text-sm font-semibold text-destructive">
          {row.original.pan ? row.original.pan : 'Missing'}
        </span>
      ),
  },
  {
    accessorKey: 'tax',
    header: 'Tax deducted',
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-foreground">
        {formatCurrency(row.original.tax)}
      </span>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    enableSorting: false,
    cell: ({ row }) => {
      const status = getStatus(row.original);
      const label =
        status === 'attention'
          ? row.original.pan
            ? 'PAN looks wrong'
            : 'PAN missing'
          : statusStyles[status].label;

      return (
        <Badge
          variant="secondary"
          className={cn(
            'whitespace-nowrap border-transparent',
            statusStyles[status].className
          )}
        >
          {label}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Action',
    enableSorting: false,
    cell: ({ row }) => {
      const record = row.original;
      const status = getStatus(record);

      return (
        <div className="flex items-center gap-2">
          {status === 'attention' && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onFix(record)}
            >
              Fix details
            </Button>
          )}
          {status === 'ready' && (
            <Button type="button" size="sm" onClick={() => onGenerate(record)}>
              Generate
            </Button>
          )}
          {status === 'generated' && (
            <Button type="button" size="sm" onClick={() => onShare(record)}>
              <Send className="h-4 w-4" aria-hidden="true" />
              Share
            </Button>
          )}
          {status === 'shared' && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => downloadForm16(record)}
            >
              <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
              Download
            </Button>
          )}
          {status !== 'attention' && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label={`Preview Form 16 for ${record.name}`}
              onClick={() => onPreview(record)}
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      );
    },
  },
];
