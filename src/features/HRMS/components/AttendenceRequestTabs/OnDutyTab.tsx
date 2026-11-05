import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import FormField from '@/components/common/FormField';
import TanStackTable from '@/components/common/TanStackTable';
import type { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import {
  attendanceOnDutyLocationOptions,
  attendanceOnDutyTypeOptions,
} from '@/data/reusableDropdownData';

interface OnDutyRequest {
  id: string;
  dates: string;
  type: string;
  location: string;
  reason: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  appliedOn: string;
}

const initialHistory: OnDutyRequest[] = [
  {
    id: 'OD001',
    dates: '2026-10-02',
    type: 'Client Visit',
    location: 'Client Site A',
    reason: 'Quarterly client review',
    status: 'Approved',
    appliedOn: '2026-10-01',
  },
  {
    id: 'OD002',
    dates: '2026-10-05',
    type: 'Field Work',
    location: 'Branch Office 1',
    reason: 'Site inspection',
    status: 'Pending',
    appliedOn: '2026-10-04',
  },
  {
    id: 'OD003',
    dates: '2026-09-30',
    type: 'Training',
    location: 'Head Office (HQ)',
    reason: 'Mandatory team training',
    status: 'Approved',
    appliedOn: '2026-09-29',
  },
];

const defaultForm = {
  dates: '',
  type: '',
  locationMode: 'preset' as 'preset' | 'map',
  location: '',
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

const OnDutyTab = () => {
  const [requests, setRequests] = useState<OnDutyRequest[]>(initialHistory);
  const [formData, setFormData] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const updateField = (
    field: keyof typeof defaultForm,
    value: string | 'preset' | 'map'
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(defaultForm);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedReason = formData.reason.trim();
    const selectedLocation = formData.location.trim();

    if (!formData.dates || !formData.type || !trimmedReason) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!selectedLocation) {
      toast.error('Please select or enter a valid location');
      return;
    }

    if (trimmedReason.length < 3) {
      toast.error('Reason must be at least 3 characters long');
      return;
    }

    const payload = {
      id: editingId || `OD-${Date.now()}`,
      dates: formData.dates,
      type: formData.type,
      location: selectedLocation,
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
      toast.success('On duty request updated successfully');
    } else {
      setRequests(prev => [payload, ...prev]);
      toast.success('On duty request submitted successfully');
    }

    resetForm();
  };

  const handleEdit = (request: OnDutyRequest) => {
    setFormData({
      dates: request.dates,
      type: request.type,
      locationMode: 'preset',
      location: request.location,
      reason: request.reason,
    });
    setEditingId(request.id);
  };

  const handleWithdraw = (request: OnDutyRequest) => {
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
        name: 'Client Visit',
        value: requests.filter(item => item.type === 'Client Visit').length,
        color: 'hsl(var(--primary))',
      },
      {
        name: 'Field Work',
        value: requests.filter(item => item.type === 'Field Work').length,
        color: 'hsl(var(--accent-foreground))',
      },
      {
        name: 'Training',
        value: requests.filter(item => item.type === 'Training').length,
        color: 'hsl(var(--secondary-foreground))',
      },
    ],
    [requests]
  );

  const columns: ColumnDef<OnDutyRequest>[] = useMemo(
    () => [
      { accessorKey: 'id', header: 'Req ID' },
      { accessorKey: 'dates', header: 'Date' },
      { accessorKey: 'type', header: 'Type' },
      { accessorKey: 'location', header: 'Location' },
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
              label="Dates"
              name="dates"
              type="date"
              value={formData.dates}
              onChange={value => updateField('dates', value)}
              placeholder="YYYY-MM-DD"
              required
            />
            <FormField
              label="On Duty Type"
              name="type"
              type="select"
              value={formData.type}
              onChange={value => updateField('type', value)}
              options={attendanceOnDutyTypeOptions}
              placeholder="Select Type"
              required
            />
            <FormField
              label="Location selection"
              name="locationMode"
              type="radio"
              value={formData.locationMode}
              onChange={value =>
                updateField('locationMode', value as 'preset' | 'map')
              }
              options={[
                { value: 'preset', label: 'Select preset locations' },
                { value: 'map', label: 'Enter a location' },
              ]}
              className="sm:col-span-2 xl:col-span-3"
            />
            {formData.locationMode === 'preset' ? (
              <div>
                <FormField
                  label="Select Preset Locations"
                  name="location"
                  type="select"
                  value={formData.location}
                  onChange={value => updateField('location', value)}
                  options={attendanceOnDutyLocationOptions}
                  placeholder="Select Location"
                  required
                />
              </div>
            ) : (
              <FormField
                label="Location Details"
                name="location"
                type="text"
                value={formData.location}
                onChange={value => updateField('location', value)}
                placeholder="Enter map location or office address"
                required
              />
            )}
            <FormField
              label="Reason"
              name="reason"
              type="textarea"
              value={formData.reason}
              onChange={value => updateField('reason', value)}
              placeholder="Enter reason here..."
              rows={3}
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
              On Duty Stats
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
          emptyMessage="No on duty requests found."
        />
      </div>
    </div>
  );
};

export default OnDutyTab;
