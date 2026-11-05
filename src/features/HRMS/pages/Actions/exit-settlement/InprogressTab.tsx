import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import FormField from '@/components/common/FormField';
import { TanStackTable } from '@/components/common';
import {
  exitProgressFilterOptions,
  type ExitRecord,
} from '@/data/reusableDropdownData';
import { Button } from '@/components/ui/button';
import { EmployeeCell, StageBadge } from './exitSettlementShared';
import {
  describeDaysLeft,
  formatDate,
  getPendingText,
} from './exitSettlementUtils';

export type ProgressFilter = 'all' | 'notice' | 'clearance';

interface InprogressTabProps {
  records: ExitRecord[];
  filter: ProgressFilter;
  onFilterChange: (filter: ProgressFilter) => void;
  onStartClearance: (record: ExitRecord) => void;
  onOpenChecklist: (record: ExitRecord) => void;
}

const InprogressTab = ({
  records,
  filter,
  onFilterChange,
  onStartClearance,
  onOpenChecklist,
}: InprogressTabProps) => {
  const columns = useMemo<ColumnDef<ExitRecord>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Employee',
        cell: ({ row }) => <EmployeeCell record={row.original} />,
      },
      {
        accessorKey: 'lastWorkingDay',
        header: 'Last working day',
        cell: ({ row }) => (
          <div className="whitespace-nowrap">
            <p className="font-medium text-foreground">
              {formatDate(row.original.lastWorkingDay)}
            </p>
            <p className="text-xs text-muted-foreground">
              {describeDaysLeft(row.original.lastWorkingDay)}
            </p>
          </div>
        ),
      },
      {
        accessorKey: 'stage',
        header: 'Step',
        cell: ({ row }) => <StageBadge stage={row.original.stage} />,
      },
      {
        id: 'pending',
        header: 'What is pending',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {getPendingText(row.original)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: ({ row }) =>
          row.original.stage === 'notice' ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onStartClearance(row.original)}
            >
              Start clearance
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={() => onOpenChecklist(row.original)}
            >
              Open checklist
            </Button>
          ),
      },
    ],
    [onOpenChecklist, onStartClearance]
  );

  return (
    <TanStackTable
      data={records}
      columns={columns}
      enableSearch={false}
      showDownload={true}
      enablePagination
      pageSize={8}
      pageSizeOptions={[8, 10, 20]}
      getRowId={record => record.id}
      emptyMessage="No one is in this step right now."
      customFilters={
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-40">
            <FormField
              label="Step"
              name="exit-progress-filter"
              type="select"
              value={filter}
              onChange={value => {
                if (
                  value === 'all' ||
                  value === 'notice' ||
                  value === 'clearance'
                ) {
                  onFilterChange(value);
                }
              }}
              options={exitProgressFilterOptions}
            />
          </div>
        </div>
      }
    />
  );
};

export default InprogressTab;
