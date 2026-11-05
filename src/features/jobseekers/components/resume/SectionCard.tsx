import { useState } from 'react';
import { Pencil } from 'lucide-react';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  formatMonth,
  type ResumeSectionItem,
  type SectionConfig,
} from '../../data/resume';

type SectionCardProps = {
  config: SectionConfig;
  items: ResumeSectionItem[];
  onChange: (items: ResumeSectionItem[]) => void;
};

const emptyItem: ResumeSectionItem = {
  id: '',
  title: '',
  subtitle: '',
  start: '',
  end: '',
  description: '',
};

const SectionCard = ({ config, items, onChange }: SectionCardProps) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ResumeSectionItem>(emptyItem);
  const [error, setError] = useState('');
  const isEditing = Boolean(draft.id);

  const openAdd = () => {
    setDraft(emptyItem);
    setError('');
    setOpen(true);
  };

  const openEdit = (item: ResumeSectionItem) => {
    setDraft(item);
    setError('');
    setOpen(true);
  };

  const handleSave = () => {
    if (!draft.title.trim() || !draft.subtitle.trim()) {
      setError('Please complete the required fields.');
      return;
    }
    if (config.dates && !draft.start) {
      setError('Start month is required.');
      return;
    }
    if (draft.start && draft.end && draft.end < draft.start) {
      setError('End month cannot be before start month.');
      return;
    }

    const nextItem = {
      ...draft,
      id: draft.id || `${config.key}-${Date.now()}`,
      end:
        config.key === 'employment' && !draft.end
          ? undefined
          : draft.end || undefined,
    };

    onChange(
      isEditing
        ? items.map(item => (item.id === nextItem.id ? nextItem : item))
        : [nextItem, ...items]
    );
    setOpen(false);
  };

  const handleDelete = () => {
    onChange(items.filter(item => item.id !== draft.id));
    setOpen(false);
  };

  return (
    <section className="rounded-t-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
          {config.title}
        </h2>
        <Button
          type="button"
          className="rounded-none bg-blue-600 text-white hover:bg-blue-700"
          onClick={openAdd}
        >
          Add
        </Button>
      </div>

      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/40 p-5 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Add {config.title.toLowerCase()} details to strengthen your
              profile.
            </p>
            <Button
              type="button"
              className="mt-3 rounded-none bg-blue-600 text-white hover:bg-blue-700"
              onClick={openAdd}
            >
              {config.addLabel}
            </Button>
          </div>
        ) : (
          items.map(item => (
            <div
              key={item.id}
              className="rounded-lg border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-slate-800  p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-950 dark:text-slate-100">
                    {item.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {item.subtitle}
                  </p>
                  {config.dates && (
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {formatMonth(item.start)} - {formatMonth(item.end)}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit ${item.title}`}
                  onClick={() => openEdit(item)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              {item.description && (
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? `Edit ${config.title}` : config.addLabel}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <FormField
              label={config.titleLabel}
              name={`${config.key}-title`}
              type="text"
              value={draft.title}
              onChange={value =>
                setDraft(current => ({ ...current, title: value }))
              }
              placeholder={config.titleLabel}
              required
              maxLength={120}
            />
            <FormField
              label={config.subtitleLabel}
              name={`${config.key}-subtitle`}
              type="text"
              value={draft.subtitle}
              onChange={value =>
                setDraft(current => ({ ...current, subtitle: value }))
              }
              placeholder={config.subtitleLabel}
              required
              maxLength={120}
            />
            {config.dates && (
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Start
                  <input
                    type="month"
                    value={draft.start || ''}
                    onChange={event =>
                      setDraft(current => ({
                        ...current,
                        start: event.target.value,
                      }))
                    }
                    className="mt-2 h-10 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  End
                  <input
                    type="month"
                    value={draft.end || ''}
                    onChange={event =>
                      setDraft(current => ({
                        ...current,
                        end: event.target.value,
                      }))
                    }
                    className="mt-2 h-10 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
                  />
                </label>
              </div>
            )}
            {config.description && (
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Description
                <textarea
                  value={draft.description || ''}
                  onChange={event =>
                    setDraft(current => ({
                      ...current,
                      description: event.target.value.slice(0, 500),
                    }))
                  }
                  maxLength={500}
                  className="mt-2 min-h-28 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-sm focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
                />
                <span className="mt-1 block text-right text-xs text-slate-500 dark:text-slate-400">
                  {(draft.description || '').length}/500
                </span>
              </label>
            )}
            {error && (
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
          </div>
          <DialogFooter>
            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              className="rounded-none border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-none bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleSave}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SectionCard;
