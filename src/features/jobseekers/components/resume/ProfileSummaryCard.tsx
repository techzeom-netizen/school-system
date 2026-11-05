import { useState } from 'react';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import type { ProfileSummary } from '../../data/resume';

type ProfileSummaryCardProps = {
  summary: ProfileSummary;
  onSave: (summary: ProfileSummary) => void;
};

const ProfileSummaryCard = ({ summary, onSave }: ProfileSummaryCardProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(summary);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!draft.headline.trim()) {
      setError('Headline is required.');
      return;
    }
    if (draft.summary.trim().length < 50) {
      setError('Summary must be at least 50 characters.');
      return;
    }
    onSave(draft);
    setEditing(false);
    setError('');
    // TODO: Persist headline and summary with profile API.
  };

  return (
    <section className="rounded-t-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
            Headline and summary
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            This is shown to recruiters and used while applying.
          </p>
        </div>
        {!editing && (
          <Button
            type="button"
            variant="outline"
            className="rounded-none border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
            onClick={() => setEditing(true)}
          >
            Edit
          </Button>
        )}
      </div>

      {editing ? (
        <div className="mt-4 space-y-4">
          <FormField
            label="Headline"
            name="headline"
            type="text"
            value={draft.headline}
            onChange={value =>
              setDraft(current => ({ ...current, headline: value }))
            }
            placeholder="Frontend Developer | React, TypeScript"
            required
            maxLength={120}
          />
          <div>
            <label
              htmlFor="summary"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Summary
            </label>
            <textarea
              id="summary"
              value={draft.summary}
              onChange={event =>
                setDraft(current => ({
                  ...current,
                  summary: event.target.value.slice(0, 500),
                }))
              }
              className="min-h-28 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-sm focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
              maxLength={500}
            />
            <p className="mt-1 text-right text-xs text-slate-500 dark:text-slate-400">
              {draft.summary.length}/500
            </p>
          </div>
          {error && (
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <Button
              type="button"
              className="rounded-none bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-none border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
              onClick={() => {
                setDraft(summary);
                setEditing(false);
                setError('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <p className="font-bold text-slate-950 dark:text-slate-100">
            {summary.headline}
          </p>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            {summary.summary}
          </p>
        </div>
      )}
    </section>
  );
};

export default ProfileSummaryCard;
