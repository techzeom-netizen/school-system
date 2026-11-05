import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import FormField from '@/components/common/FormField';
import TanStackTable from '@/components/common/TanStackTable';
import type { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import {
  attendanceLeaveTypeOptions,
  attendanceNotifyEmployeeOptions,
} from '@/data/reusableDropdownData';

interface LeaveRequest {
  id: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason: string;
  notifyEmployees: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  appliedOn: string;
}

const initialHistory: LeaveRequest[] = [
  {
    id: 'LV001',
    leaveType: 'Sick Leave',
    fromDate: '2026-10-01',
    toDate: '2026-10-02',
    reason: 'Fever and cold',
    notifyEmployees: 'Reporting Manager',
    status: 'Approved',
    appliedOn: '2026-09-30',
  },
  {
    id: 'LV002',
    leaveType: 'Casual Leave',
    fromDate: '2026-10-10',
    toDate: '2026-10-10',
    reason: 'Personal work',
    notifyEmployees: 'HR Department',
    status: 'Pending',
    appliedOn: '2026-10-05',
  },
  {
    id: 'LV003',
    leaveType: 'Earned Leave',
    fromDate: '2026-09-20',
    toDate: '2026-09-22',
    reason: 'Family vacation',
    notifyEmployees: 'Team Members',
    status: 'Approved',
    appliedOn: '2026-09-15',
  },
];

const defaultForm = {
  leaveType: '',
  fromDate: '',
  toDate: '',
  reason: '',
  notifyEmployees: '',
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

const LeaveTab = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>(initialHistory);
  const [formData, setFormData] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<File | null>(null);

  const updateField = (field: keyof typeof defaultForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(defaultForm);
    setEditingId(null);
    setAttachment(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.leaveType || !formData.fromDate || !formData.reason.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (
      formData.toDate &&
      new Date(formData.fromDate) > new Date(formData.toDate)
    ) {
      toast.error('To date cannot be before From date');
      return;
    }

    const payload = {
      id: editingId || `LV-${Date.now()}`,
      leaveType: formData.leaveType,
      fromDate: formData.fromDate,
      toDate: formData.toDate || formData.fromDate,
      reason: formData.reason.trim(),
      notifyEmployees: formData.notifyEmployees || 'Reporting Manager',
      status: 'Pending' as const,
      appliedOn: new Date().toISOString().slice(0, 10),
    };

    if (editingId) {
      setRequests(prev =>
        prev.map(item =>
          item.id === editingId ? { ...item, ...payload } : item
        )
      );
      toast.success('Leave request updated successfully');
    } else {
      setRequests(prev => [payload, ...prev]);
      toast.success('Leave request submitted successfully');
    }
    resetForm();
  };

  const handleEdit = (request: LeaveRequest) => {
    setFormData({
      leaveType: request.leaveType,
      fromDate: request.fromDate,
      toDate: request.toDate,
      reason: request.reason,
      notifyEmployees: request.notifyEmployees,
    });
    setEditingId(request.id);
    setAttachment(null);
  };

  const handleWithdraw = (request: LeaveRequest) => {
    setRequests(prev => prev.filter(item => item.id !== request.id));
    toast.success('Leave request withdrawn successfully.', {
      action: {
        label: 'Undo',
        onClick: () => setRequests(prev => [request, ...prev]),
      },
    });
  };

  const chartData = useMemo(
    () => [
      {
        name: 'Approved',
        value: requests.filter(i => i.status === 'Approved').length,
        color: 'hsl(var(--primary))',
      },
      {
        name: 'Pending',
        value: requests.filter(i => i.status === 'Pending').length,
        color: 'hsl(var(--accent-foreground))',
      },
      {
        name: 'Rejected',
        value: requests.filter(i => i.status === 'Rejected').length,
        color: 'hsl(var(--destructive))',
      },
    ],
    [requests]
  );

  const columns: ColumnDef<LeaveRequest>[] = useMemo(
    () => [
      { accessorKey: 'id', header: 'Req ID' },
      { accessorKey: 'leaveType', header: 'Leave Type' },
      { accessorKey: 'fromDate', header: 'From' },
      { accessorKey: 'toDate', header: 'To' },
      { accessorKey: 'reason', header: 'Reason' },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-full text-[10px] font-medium ${getStatusBadgeClass(row.original.status)}`}
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
        {/* Left Side: Form */}
        <div className="min-w-0 xl:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            <FormField
              label="Leave Type"
              name="leaveType"
              type="select"
              value={formData.leaveType}
              onChange={value => updateField('leaveType', value)}
              options={attendanceLeaveTypeOptions}
              placeholder="Select Leave Type"
              required
            />

            <FormField
              label="From"
              name="fromDate"
              type="date"
              value={formData.fromDate}
              onChange={value => updateField('fromDate', value)}
              placeholder="YYYY-MM-DD"
              required
            />
            <FormField
              label="To"
              name="toDate"
              type="date"
              value={formData.toDate}
              onChange={value => updateField('toDate', value)}
              placeholder="YYYY-MM-DD"
            />

            {formData.leaveType === 'Sick Leave' && (
              <div className="flex items-start gap-2 rounded-lg border border-border bg-secondary p-3 dark:border-border dark:bg-secondary sm:col-span-2 xl:col-span-3">
                <AlertTriangle className="w-4 h-4 text-secondary-foreground dark:text-secondary-foreground flex-shrink-0 mt-0.5" />
                <p className="text-xs text-secondary-foreground dark:text-secondary-foreground">
                  Leave applications are allowed only for 30 past dates for Sick
                  Leave
                </p>
              </div>
            )}

            <FormField
              label="Reason"
              name="reason"
              type="text"
              value={formData.reason}
              onChange={value => updateField('reason', value)}
              placeholder="Enter reason"
              required
              className="sm:col-span-2 xl:col-span-3"
            />

            <div className="min-w-0">
              <FormField
                label="Attachment"
                name="leave-attachment"
                type="file"
                value={attachment?.name ?? ''}
                onFileChange={handleFileChange}
              />
              {attachment && (
                <p className="mt-2 truncate text-xs text-muted-foreground">
                  Selected: {attachment.name}
                </p>
              )}
            </div>

            <FormField
              label="Notify Employees"
              name="notifyEmployees"
              type="select"
              value={formData.notifyEmployees}
              onChange={value => updateField('notifyEmployees', value)}
              options={attendanceNotifyEmployeeOptions}
              placeholder="Select Employees"
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
                className="px-6 bg-primary hover:bg-primary text-primary-foreground"
              >
                {editingId ? 'Update' : 'Apply'}
              </Button>
            </div>
          </form>
        </div>

        {/* Right Side: Chart */}
        <div className="min-w-0 xl:col-span-1">
          <div className="bg-card dark:bg-card p-4 rounded-lg shadow-sm h-full flex flex-col items-center justify-center">
            <h3 className="text-sm font-semibold text-foreground dark:text-foreground mb-4">
              Leave Stats
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

      {/* History Table */}
      <div className="mt-8">
        <h3 className="text-sm font-semibold text-foreground dark:text-foreground mb-3">
          Leave Request History
        </h3>
        <TanStackTable
          showDownload={true}
          data={requests}
          columns={columns}
          enableSearch={true}
          enableSorting={false}
          enablePagination={true}
          pageSize={5}
          searchPlaceholder="Search leave requests..."
          emptyMessage="No leave requests found."
        />
      </div>
    </div>
  );
};

export default LeaveTab;
