import { useState } from 'react';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import { formatSalary, type CareerPreferences } from '../../data/resume';

type CareerPreferencesCardProps = {
  preferences: CareerPreferences;
  onSave: (preferences: CareerPreferences) => void;
};

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const noticePeriods = ['Immediate', '15 days', '30 days', '60 days', '90 days'];
const workModes = ['Remote', 'Hybrid', 'Onsite'];
const toOptions = (options: string[]) =>
  options.map(option => ({ label: option, value: option }));

const CareerPreferencesCard = ({
  preferences,
  onSave,
}: CareerPreferencesCardProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(preferences);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!draft.desiredRole.trim()) {
      setError('Desired role is required.');
      return;
    }
    if (!/^\d+$/.test(draft.salary)) {
      setError('Expected salary must contain digits only.');
      return;
    }
    onSave(draft);
    setEditing(false);
    setError('');
  };

  return (
    <section className="rounded-t-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
          Career preferences
        </h2>
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
        <div className="mt-4 grid gap-4">
          <FormField
            label="Desired role"
            name="desiredRole"
            type="text"
            value={draft.desiredRole}
            onChange={value =>
              setDraft(current => ({ ...current, desiredRole: value }))
            }
            placeholder="Senior Frontend Developer"
            required
            maxLength={120}
          />
          <FormField
            label="Preferred locations"
            name="locations"
            type="text"
            value={draft.locations}
            onChange={value =>
              setDraft(current => ({ ...current, locations: value }))
            }
            placeholder="Bengaluru, Remote"
            maxLength={120}
          />
          <FormField
            label="Expected salary"
            name="salary"
            type="text"
            value={draft.salary}
            onChange={value =>
              setDraft(current => ({
                ...current,
                salary: value.replace(/\D/g, ''),
              }))
            }
            placeholder="1800000"
            required
            maxLength={12}
          />
          <FormField
            label="Job type"
            name="jobType"
            type="select"
            value={draft.jobType}
            onChange={value =>
              setDraft(current => ({ ...current, jobType: value }))
            }
            options={toOptions(jobTypes)}
          />
          <FormField
            label="Notice period"
            name="noticePeriod"
            type="select"
            value={draft.noticePeriod}
            onChange={value =>
              setDraft(current => ({ ...current, noticePeriod: value }))
            }
            options={toOptions(noticePeriods)}
          />
          <FormField
            label="Work mode"
            name="workMode"
            type="select"
            value={draft.workMode}
            onChange={value =>
              setDraft(current => ({ ...current, workMode: value }))
            }
            options={toOptions(workModes)}
          />
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
                setDraft(preferences);
                setEditing(false);
                setError('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <dl className="mt-4 grid gap-3">
          {[
            ['Desired role', preferences.desiredRole],
            ['Job type', preferences.jobType],
            ['Preferred locations', preferences.locations],
            ['Expected salary', `${formatSalary(preferences.salary)} per year`],
            ['Notice period', preferences.noticePeriod],
            ['Work mode', preferences.workMode],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg bg-slate-50 dark:bg-slate-800 border p-2.5 dark:border-white/20"
            >
              <dt className="text-xs text-slate-500 dark:text-slate-400">
                {label}
              </dt>
              <dd className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
};

export default CareerPreferencesCard;
