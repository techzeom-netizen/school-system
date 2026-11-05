import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import FormField from '@/components/common/FormField';
import TanStackTable from '@/components/common/TanStackTable';
import type { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { attendanceRegularizationTypeOptions } from '@/data/reusableDropdownData';

interface RegularizationRequest {
  id: string;
  date: string;
  type: string;
  reason: string;
  inTime: string;
  outTime: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  appliedOn: string;
}

const initialHistory: RegularizationRequest[] = [
  {
    id: 'REQ001',
    date: '2026-10-01',
    type: 'Missed Punch',
    reason: 'Forgot to punch out',
    inTime: '09:00',
    outTime: '18:00',
    status: 'Approved',
    appliedOn: '2026-10-02',
  },
  {
    id: 'REQ002',
    date: '2026-10-03',
    type: 'Late Arrival',
    reason: 'Traffic jam',
    inTime: '09:40',
    outTime: '18:00',
    status: 'Pending',
    appliedOn: '2026-10-04',
  },
  {
    id: 'REQ003',
    date: '2026-09-28',
    type: 'Early Departure',
    reason: 'Doctor appointment',
    inTime: '09:00',
    outTime: '16:30',
    status: 'Approved',
    appliedOn: '2026-09-29',
  },
];

const defaultForm = {
  date: '',
  type: '',
  reason: '',
  inTime: '',
  outTime: '',
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Approved':
      return 'text-primary bg-primary/10 dark:text-primary dark:bg-primary/10';
    case 'Rejected':
      return 'text-destructive bg-destructive/10 dark:text-destructive dark:bg-destructive/10';
    case 'Pending':
      return 'text-secondary-foreground bg-secondary dark:text-secondary-foreground dark:bg-secondary';
    default:
      return 'text-muted-foreground bg-muted dark:text-foreground dark:bg-muted';
  }
};

const RegularizationTab = () => {
  const [requests, setRequests] =
    useState<RegularizationRequest[]>(initialHistory);
  const [formData, setFormData] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [updatedStatus, setUpdatedStatus] = useState({
    status: '-',
    totalHours: '-',
    overtimeHours: '-',
  });

  const updateField = (field: keyof typeof defaultForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(defaultForm);
    setEditingId(null);
    setUpdatedStatus({ status: '-', totalHours: '-', overtimeHours: '-' });
  };

  const handleRecalculate = () => {
    if (!formData.inTime || !formData.outTime) {
      toast.error('Please enter both In and Out times');
      return;
    }

    const parseTime = (value: string) => {
      const [hours, minutes] = value.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const inMinutes = parseTime(formData.inTime);
    const outMinutes = parseTime(formData.outTime);

    if (inMinutes >= outMinutes) {
      toast.error('Out time must be later than in time');
      return;
    }

    const totalMinutes = outMinutes - inMinutes;
    const overtimeMinutes = Math.max(0, totalMinutes - 8 * 60);
    const totalHours = `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
    const overtimeHours = `${Math.floor(overtimeMinutes / 60)}h ${overtimeMinutes % 60}m`;

    setUpdatedStatus({
      status: 'PRESENT',
      totalHours,
      overtimeHours,
    });
    toast.success('Status recalculated successfully');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedReason = formData.reason.trim();
    if (!formData.date || !formData.type) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (trimmedReason && trimmedReason.length < 3) {
      toast.error('Reason must be at least 3 characters long');
      return;
    }

    if (
      (formData.inTime && !formData.outTime) ||
      (!formData.inTime && formData.outTime)
    ) {
      toast.error('Both in and out times are required together');
      return;
    }

    if (
      formData.inTime &&
      formData.outTime &&
      formData.inTime >= formData.outTime
    ) {
      toast.error('Out time must be later than in time');
      return;
    }

    const payload = {
      id: editingId || `REQ-${Date.now()}`,
      date: formData.date,
      type: formData.type,
      reason: trimmedReason || 'No additional details provided',
      inTime: formData.inTime,
      outTime: formData.outTime,
      status: 'Pending' as const,
      appliedOn: new Date().toISOString().slice(0, 10),
    };

    if (editingId) {
      setRequests(prev =>
        prev.map(item =>
          item.id === editingId ? { ...item, ...payload } : item
        )
      );
      toast.success('Regularization request updated successfully');
    } else {
      setRequests(prev => [payload, ...prev]);
      toast.success('Regularization request submitted successfully');
    }

    resetForm();
  };

  const handleEdit = (request: RegularizationRequest) => {
    setFormData({
      date: request.date,
      type: request.type,
      reason: request.reason,
      inTime: request.inTime,
      outTime: request.outTime,
    });
    setEditingId(request.id);
    if (request.inTime && request.outTime) {
      setUpdatedStatus({
        status: 'PRESENT',
        totalHours: '9h 0m',
        overtimeHours: '1h 0m',
      });
    } else {
      setUpdatedStatus({ status: '-', totalHours: '-', overtimeHours: '-' });
    }
  };

  const handleWithdraw = (request: RegularizationRequest) => {
    setRequests(prev => prev.filter(item => item.id !== request.id));
    toast.success('Request withdrawn successfully.', {
      action: {
        label: 'Undo',
        onClick: () => {
          setRequests(prev => [request, ...prev]);
        },
      },
    });
  };

  const chartData = useMemo(
    () => [
      {
        name: 'Approved',
        value: requests.filter(item => item.status === 'Approved').length,
        color: 'hsl(var(--primary))',
      },
      {
        name: 'Pending',
        value: requests.filter(item => item.status === 'Pending').length,
        color: 'hsl(var(--accent-foreground))',
      },
      {
        name: 'Rejected',
        value: requests.filter(item => item.status === 'Rejected').length,
        color: 'hsl(var(--destructive))',
      },
    ],
    [requests]
  );

  const columns: ColumnDef<RegularizationRequest>[] = useMemo(
    () => [
      { accessorKey: 'id', header: 'Req ID' },
      { accessorKey: 'date', header: 'Date' },
      { accessorKey: 'type', header: 'Type' },
      { accessorKey: 'reason', header: 'Reason' },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-full text-[10px] font-medium ${getStatusBadgeClass(
              row.original.status
            )}`}
          >
            {row.original.status}
          </span>
        ),
      },
      { accessorKey: 'appliedOn', header: 'Applied On' },
      {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => {
          if (row.original.status !== 'Pending') {
            return (
              <span className="text-xs text-muted-foreground dark:text-muted-foreground">
                —
              </span>
            );
          }

          return (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleEdit(row.original)}
                className="h-8 text-xs"
              >
                Edit
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleWithdraw(row.original)}
                className="h-8 text-xs"
              >
                Withdraw
              </Button>
            </div>
          );
        },
      },
    ],
    [requests]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            <FormField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={value => updateField('date', value)}
              required
            />
            <div className="rounded-lg border border-border bg-muted p-3 dark:border-border dark:bg-muted/50 sm:col-span-2 xl:col-span-3">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground mb-1">
                    Status
                  </p>
                  <p className="text-sm font-semibold text-foreground dark:text-foreground">
                    {updatedStatus.status}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground mb-1">
                    Total Hours
                  </p>
                  <p className="text-sm font-semibold text-foreground dark:text-foreground">
                    {updatedStatus.totalHours}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground mb-1">
                    Overtime Hours
                  </p>
                  <p className="text-sm font-semibold text-primary dark:text-primary">
                    {updatedStatus.overtimeHours}
                  </p>
                </div>
              </div>
            </div>
            <FormField
              label="Regularization Type"
              name="type"
              type="select"
              value={formData.type}
              onChange={value => updateField('type', value)}
              options={attendanceRegularizationTypeOptions}
              placeholder="Select Type"
              required
            />
            <FormField
              label="Reason"
              name="reason"
              type="textarea"
              value={formData.reason}
              onChange={value => updateField('reason', value)}
              placeholder="Enter reason here..."
              rows={3}
              className="sm:col-span-2 xl:col-span-3"
            />
            <FormField
              label="In Time"
              name="inTime"
              type="time"
              value={formData.inTime}
              onChange={value => updateField('inTime', value)}
              placeholder="hh:mm"
            />
            <FormField
              label="Out Time"
              name="outTime"
              type="time"
              value={formData.outTime}
              onChange={value => updateField('outTime', value)}
              placeholder="hh:mm"
            />
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted p-3 dark:border-border dark:bg-muted/50 sm:col-span-2 xl:col-span-3">
              <div>
                <p className="text-sm font-medium text-foreground dark:text-foreground mb-1">
                  Updated Status
                </p>
                <div className="flex gap-4 text-xs">
                  <span className="text-muted-foreground dark:text-muted-foreground">
                    Status:{' '}
                    <span className="font-semibold text-foreground dark:text-foreground">
                      {updatedStatus.status}
                    </span>
                  </span>
                  <span className="text-muted-foreground dark:text-muted-foreground">
                    Total:{' '}
                    <span className="font-semibold text-foreground dark:text-foreground">
                      {updatedStatus.totalHours}
                    </span>
                  </span>
                  <span className="text-muted-foreground dark:text-muted-foreground">
                    OT:{' '}
                    <span className="font-semibold text-primary dark:text-primary">
                      {updatedStatus.overtimeHours}
                    </span>
                  </span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRecalculate}
                className="text-xs h-8"
              >
                Recalculate
              </Button>
            </div>
            <div className="flex justify-end gap-3 pt-2 sm:col-span-2 xl:col-span-3">
              <Button
                type="button"
                variant="outline"
                className="px-6"
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-6 bg-primary hover:bg-primary text-primary-foreground"
              >
                {editingId ? 'Update' : 'Apply'}
              </Button>
            </div>
          </form>
        </div>
        <div className="min-w-0 xl:col-span-1">
          <div className="bg-card dark:bg-card p-4 rounded-lg shadow-sm h-full flex flex-col items-center justify-center">
            <h3 className="text-sm font-semibold text-foreground dark:text-foreground mb-4">
              Regularization Stats
            </h3>
            <div className="w-full h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart style={{ outline: 'none' }}>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover) / 0.95)',
                      borderRadius: '8px',
                      border: '1px solid hsl(var(--border))',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {chartData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="text-xs text-muted-foreground dark:text-muted-foreground">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-foreground dark:text-foreground mb-3">
          Request History
        </h3>
        <TanStackTable
          showDownload={true}
          data={requests}
          columns={columns}
          enableSearch={true}
          enableSorting={false}
          enablePagination={true}
          pageSize={5}
          searchPlaceholder="Search requests..."
          emptyMessage="No regularization requests found."
        />
      </div>
    </div>
  );
};

export default RegularizationTab;
