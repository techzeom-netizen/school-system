import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import FormField from '@/components/common/FormField';
import TanStackTable from '@/components/common/TanStackTable';
import type { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { attendanceWorkFromHomeTypeOptions } from '@/data/reusableDropdownData';

interface WFHRequest {
  id: string;
  startDate: string;
  endDate: string;
  type: string;
  reason: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  appliedOn: string;
}

const initialHistory: WFHRequest[] = [
  {
    id: 'WFH001',
    startDate: '2026-10-01',
    endDate: '2026-10-01',
    type: 'Full Day',
    reason: 'Need to focus on project delivery',
    status: 'Approved',
    appliedOn: '2026-09-30',
  },
  {
    id: 'WFH002',
    startDate: '2026-10-04',
    endDate: '2026-10-05',
    type: 'Multiple Days',
    reason: 'Home office setup and client follow-up',
    status: 'Pending',
    appliedOn: '2026-10-03',
  },
  {
    id: 'WFH003',
    startDate: '2026-09-29',
    endDate: '2026-09-29',
    type: 'Half Day',
    reason: 'House maintenance visit',
    status: 'Approved',
    appliedOn: '2026-09-28',
  },
];

const defaultForm = {
  startDate: '',
  endDate: '',
  type: '',
  reason: '',
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

const WFHTab = () => {
  const [requests, setRequests] = useState<WFHRequest[]>(initialHistory);
  const [formData, setFormData] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const updateField = (field: keyof typeof defaultForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(defaultForm);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedReason = formData.reason.trim();
    if (
      !formData.startDate ||
      !formData.endDate ||
      !formData.type ||
      !trimmedReason
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error('End date cannot be before start date');
      return;
    }

    if (trimmedReason.length < 3) {
      toast.error('Reason must be at least 3 characters long');
      return;
    }

    const payload = {
      id: editingId || `WFH-${Date.now()}`,
      startDate: formData.startDate,
      endDate: formData.endDate,
      type: formData.type,
      reason: trimmedReason,
      status: 'Pending' as const,
      appliedOn: new Date().toISOString().slice(0, 10),
    };

    if (editingId) {
      setRequests(prev =>
        prev.map(item =>
          item.id === editingId ? { ...item, ...payload } : item
        )
      );
      toast.success('WFH request updated successfully');
    } else {
      setRequests(prev => [payload, ...prev]);
      toast.success('Work From Home request submitted successfully');
    }

    resetForm();
  };

  const handleEdit = (request: WFHRequest) => {
    setFormData({
      startDate: request.startDate,
      endDate: request.endDate,
      type: request.type,
      reason: request.reason,
    });
    setEditingId(request.id);
  };

  const handleWithdraw = (request: WFHRequest) => {
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

  const columns: ColumnDef<WFHRequest>[] = useMemo(
    () => [
      { accessorKey: 'id', header: 'Req ID' },
      { accessorKey: 'startDate', header: 'Start Date' },
      { accessorKey: 'endDate', header: 'End Date' },
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
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={value => updateField('startDate', value)}
              required
            />
            <FormField
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={value => updateField('endDate', value)}
              required
            />
            <FormField
              label="WFH Type"
              name="type"
              type="select"
              value={formData.type}
              onChange={value => updateField('type', value)}
              options={attendanceWorkFromHomeTypeOptions}
              placeholder="Select WFH Type"
              required
            />
            <FormField
              label="Reason"
              name="reason"
              type="textarea"
              value={formData.reason}
              onChange={value => updateField('reason', value)}
              placeholder="Please provide a reason for working from home..."
              rows={4}
              required
              className="sm:col-span-2 xl:col-span-3"
            />
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
                className="px-6  bg-primary hover:bg-primary text-primary-foreground"
              >
                {editingId ? 'Update' : 'Apply'}
              </Button>
            </div>
          </form>
        </div>
        <div className="min-w-0 xl:col-span-1">
          <div className="bg-card dark:bg-card p-4 rounded-lg shadow-sm h-full flex flex-col items-center justify-center">
            <h3 className="text-sm font-semibold text-foreground dark:text-foreground mb-4">
              WFH Stats
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
          emptyMessage="No WFH requests found."
        />
      </div>
    </div>
  );
};

export default WFHTab;
