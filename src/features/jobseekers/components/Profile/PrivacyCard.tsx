import { useState } from 'react';
import { X } from 'lucide-react';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import type { PersonalDetails, PrivacySettings } from '../../data/profile';
import Switch from './Switch';

type PrivacyCardProps = {
  settings: PrivacySettings;
  employerName: PersonalDetails['company'];
  onChange: (settings: PrivacySettings) => void;
};

const inputClass =
  'h-10 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900';
const photoVisibilityOptions = ['Everyone', 'Recruiters only', 'Nobody'];
const contactVisibilityOptions = [
  'Only companies I apply to',
  'All recruiters',
  'Hide my contact details',
];
const toOptions = (options: string[]) =>
  options.map(option => ({ label: option, value: option }));
const visibilityOptions = [
  {
    value: 'all',
    label: 'Visible to all recruiters',
    hint: 'Recruiters can find your profile in search.',
  },
  {
    value: 'applied',
    label: 'Only companies I apply to',
    hint: 'Your profile is shared only after you apply.',
  },
  {
    value: 'hidden',
    label: 'Hidden',
    hint: 'Your profile will not appear in recruiter search.',
  },
] as const;

const PrivacyCard = ({
  settings,
  employerName,
  onChange,
}: PrivacyCardProps) => {
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');

  const update = (next: PrivacySettings) => {
    onChange(next);
    // TODO: call API to autosave privacy settings.
  };

  const addBlockedCompany = () => {
    const nextCompany = company.trim();
    if (!nextCompany) return;
    if (
      settings.blockedCompanies.some(
        item => item.toLowerCase() === nextCompany.toLowerCase()
      )
    ) {
      setError('This company is already blocked.');
      return;
    }
    if (settings.blockedCompanies.length >= 20) {
      setError('You can block up to 20 companies.');
      return;
    }
    update({
      ...settings,
      blockedCompanies: [...settings.blockedCompanies, nextCompany],
    });
    setCompany('');
    setError('');
  };

  return (
    <section className="rounded-t-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
          Privacy and visibility
        </h2>
      </div>
      <div className="mt-4 grid gap-3">
        {visibilityOptions.map(option => (
          <label
            key={option.value}
            className={`cursor-pointer rounded-lg border p-3 ${
              settings.visibility === option.value
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40'
                : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'
            }`}
          >
            <input
              type="radio"
              name="profileVisibility"
              value={option.value}
              checked={settings.visibility === option.value}
              onChange={() => update({ ...settings, visibility: option.value })}
              className="sr-only"
            />
            <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
              {option.label}
            </span>
            <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
              {option.hint}
            </span>
          </label>
        ))}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <FormField
          label="Show my photo to"
          name="photoVisibility"
          type="select"
          value={settings.photoVisibility}
          onChange={photoVisibility => update({ ...settings, photoVisibility })}
          options={toOptions(photoVisibilityOptions)}
        />
        <FormField
          label="Show my phone and email to"
          name="contactVisibility"
          type="select"
          value={settings.contactVisibility}
          onChange={contactVisibility =>
            update({ ...settings, contactVisibility })
          }
          options={toOptions(contactVisibilityOptions)}
        />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Hide from my current employer ({employerName})
        </span>
        <Switch
          label="Hide from my current employer"
          checked={settings.hideCurrentEmployer}
          onChange={hideCurrentEmployer =>
            update({ ...settings, hideCurrentEmployer })
          }
        />
      </div>
      <div className="mt-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Blocked companies
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {settings.blockedCompanies.map(item => (
            <span
              key={item}
              className="inline-flex items-center gap-2 rounded-full bg-red-50 dark:bg-red-950/40 px-3 py-1 text-sm font-semibold text-red-700 dark:text-red-400"
            >
              {item}
              <button
                type="button"
                aria-label={`Remove ${item}`}
                onClick={() =>
                  update({
                    ...settings,
                    blockedCompanies: settings.blockedCompanies.filter(
                      companyName => companyName !== item
                    ),
                  })
                }
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor="blockedCompany">
            Company to block
          </label>
          <input
            id="blockedCompany"
            value={company}
            onChange={event => setCompany(event.target.value)}
            className={`${inputClass} flex-1`}
            placeholder="Company name"
          />
          <Button
            type="button"
            className="rounded-none bg-blue-600 text-white hover:bg-blue-700"
            onClick={addBlockedCompany}
          >
            Block
          </Button>
        </div>
        {error && (
          <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    </section>
  );
};

export default PrivacyCard;
