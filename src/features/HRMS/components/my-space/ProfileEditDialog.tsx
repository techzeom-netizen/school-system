import type { FormEvent } from 'react';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog';
import Section from '@/components/common/Section';

export interface ProfileEditField {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'date' | 'textarea' | 'select' | 'file';
  placeholder?: string;
  hint?: string;
  required?: boolean;
  rows?: number;
  options?: Array<{ value: string; label: string }>;
  accept?: string;
  colSpan?: 1 | 2;
}

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  fields: ProfileEditField[];
  values: Record<string, string>;
  onValueChange: (name: string, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const ProfileEditDialog = ({
  open,
  onOpenChange,
  title,
  description,
  fields,
  values,
  onValueChange,
  onSubmit,
}: ProfileEditDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent
      className="w-[calc(100%-2rem)] gap-0 border-0 bg-transparent p-0 shadow-none sm:max-w-2xl"
      onInteractOutside={event => event.preventDefault()}
    >
      <Section title={title} contentClassName="space-y-4 bg-card p-4 sm:p-6">
        <DialogHeader>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map(field => (
              <FormField
                key={field.name}
                label={field.label}
                name={field.name}
                type={field.type ?? 'text'}
                value={values[field.name] ?? ''}
                onChange={value => onValueChange(field.name, value)}
                onFileChange={event =>
                  onValueChange(field.name, event.target.files?.[0]?.name ?? '')
                }
                placeholder={field.placeholder}
                hint={field.hint}
                required={field.required}
                rows={field.rows}
                options={field.options}
                accept={field.accept}
                colSpan={field.colSpan}
              />
            ))}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </Section>
    </DialogContent>
  </Dialog>
);

export default ProfileEditDialog;
