import { useState, type FormEvent } from 'react';
import {
  Briefcase,
  CalendarDays,
  type LucideIcon,
  Network,
  Pencil,
  UserRound,
} from 'lucide-react';
import FormField from '@/components/common/FormField';
import Section from '@/components/common/Section';
import { Button } from '@/components/ui/button';
import ProfileEditDialog, { type ProfileEditField } from './ProfileEditDialog';

interface WorkEditSectionProps {
  title: string;
  icon: LucideIcon;
  fields: ProfileEditField[];
  initialValues: Record<string, string>;
}

const formatValue = (field: ProfileEditField, value: string) => {
  if (field.type !== 'date' || !value) return value || '—';
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const WorkEditSection = ({
  title,
  fields,
  initialValues,
}: WorkEditSectionProps) => {
  const [values, setValues] = useState(initialValues);
  const [draft, setDraft] = useState(initialValues);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openEditor = () => {
    setDraft(values);
    setIsDialogOpen(true);
  };

  const updateDraft = (name: string, value: string) => {
    setDraft(current => ({ ...current, [name]: value }));
  };

  const saveChanges = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValues(draft);
    setIsDialogOpen(false);
  };

  return (
    <>
      <Section title={title} contentClassName="p-4">
        <div className="mb-3 flex justify-end">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={openEditor}
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(field => (
            <FormField
              key={field.name}
              label={field.label}
              name={`work-view-${field.name}`}
              type={field.type === 'date' ? 'date' : 'text'}
              value={formatValue(field, values[field.name])}
              readOnly
            />
          ))}
        </div>
      </Section>
      <ProfileEditDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={`Edit ${title}`}
        description={`Update details for ${title.toLowerCase()}.`}
        fields={fields}
        values={draft}
        onValueChange={updateDraft}
        onSubmit={saveChanges}
      />
    </>
  );
};

const WorkTab = () => (
  <Section title="Work" icon={Briefcase}>
    <div className="grid min-w-0 gap-4 xl:grid-cols-2">
      <WorkEditSection
        title="Current Employment"
        icon={Briefcase}
        fields={[
          { name: 'employeeId', label: 'Employee ID' },
          { name: 'role', label: 'Role' },
          { name: 'designation', label: 'Designation' },
          { name: 'employeeType', label: 'Employee Type' },
          { name: 'department', label: 'Department' },
          { name: 'joiningDate', label: 'Joining Date', type: 'date' },
          { name: 'office', label: 'Office' },
          { name: 'status', label: 'Status' },
        ]}
        initialValues={{
          employeeId: 'SWM001',
          role: 'Developer',
          designation: 'Software Developer',
          employeeType: 'Full Time',
          department: 'Engineering',
          joiningDate: '2023-06-06',
          office: '',
          status: 'Active',
        }}
      />
      <WorkEditSection
        title="Reporting Structure"
        icon={Network}
        fields={[
          { name: 'reportingManager', label: 'Reporting Manager' },
          { name: 'hrContact', label: 'HR Contact' },
          { name: 'team', label: 'Team' },
        ]}
        initialValues={{
          reportingManager: 'None',
          hrContact: 'Pooja Sharma (HR Manager)',
          team: 'Engineering Team',
        }}
      />
      <WorkEditSection
        title="Work Schedule"
        icon={CalendarDays}
        fields={[
          { name: 'shift', label: 'Shift' },
          { name: 'workingDays', label: 'Working Days' },
          { name: 'workLocation', label: 'Work Location' },
        ]}
        initialValues={{
          shift: 'General Shift',
          workingDays: 'Monday - Friday',
          workLocation: 'Office',
        }}
      />
      <WorkEditSection
        title="Employment Timeline"
        icon={UserRound}
        fields={[
          { name: 'joiningDate', label: 'Joining Date', type: 'date' },
          { name: 'probationPeriod', label: 'Probation Period' },
          {
            name: 'confirmationDate',
            label: 'Confirmation Date',
            type: 'date',
          },
        ]}
        initialValues={{
          joiningDate: '2023-06-06',
          probationPeriod: '3 Months',
          confirmationDate: '2023-09-06',
        }}
      />
    </div>
  </Section>
);

export default WorkTab;
