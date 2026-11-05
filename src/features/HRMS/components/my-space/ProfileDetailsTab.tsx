import { useState, type FormEvent } from 'react';
import { Pencil, type LucideIcon } from 'lucide-react';
import Section from '@/components/common/Section';
import { Button } from '@/components/ui/button';
import ProfileEditDialog, { type ProfileEditField } from './ProfileEditDialog';

interface ProfileDetailsTabProps {
  sectionTitle: string;
  description: string;
  icon: LucideIcon;
  fields: ProfileEditField[];
}

const ProfileDetailsTab = ({
  sectionTitle,
  description,
  icon: Icon,
  fields,
}: ProfileDetailsTabProps) => {
  const initialValues = Object.fromEntries(
    fields.map(field => [field.name, ''])
  );
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [draft, setDraft] = useState<Record<string, string>>(initialValues);
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
      <Section
        title={sectionTitle}
        icon={Icon}
        className="!rounded-md border-border"
        headerClassName="bg-muted [&_.text-navbar-text]:text-foreground"
        contentClassName="bg-card p-4"
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">{description}</p>
          <Button
            type="button"
            variant="outline"
            className="w-full shrink-0 sm:w-auto"
            onClick={openEditor}
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit Profile
          </Button>
        </div>

        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {fields.map(field => (
            <div key={field.name} className="min-w-0">
              <dt className="text-xs text-muted-foreground">{field.label}</dt>
              <dd className="mt-1 break-words text-sm font-medium text-card-foreground">
                {values[field.name] || 'Not provided'}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <ProfileEditDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={`Edit ${sectionTitle}`}
        description={`Update your ${sectionTitle.toLowerCase()} details.`}
        fields={fields}
        values={draft}
        onValueChange={updateDraft}
        onSubmit={saveChanges}
      />
    </>
  );
};

export default ProfileDetailsTab;
