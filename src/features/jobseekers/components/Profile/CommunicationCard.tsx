import FormField from '@/components/common/FormField';
import type { ContactPreferences } from '../../data/profile';
import Switch from './Switch';

type CommunicationCardProps = {
  preferences: ContactPreferences;
  onChange: (preferences: ContactPreferences) => void;
};

const methods = ['Email', 'Phone call', 'WhatsApp'];
const times = ['Anytime', 'Morning 9-12', 'Afternoon 12-4', 'Evening 4-8'];
const languages = ['English', 'Hindi', 'Kannada', 'Tamil', 'Telugu'];
const toOptions = (options: string[]) =>
  options.map(option => ({ label: option, value: option }));

const CommunicationCard = ({
  preferences,
  onChange,
}: CommunicationCardProps) => {
  const update = (next: ContactPreferences) => {
    onChange(next);
    // TODO: call API to autosave contact preferences.
  };

  return (
    <section className="rounded-t-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
          Contact preferences
        </h2>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Allow recruiters to contact me
        </span>
        <Switch
          label="Allow recruiters to contact me"
          checked={preferences.allowRecruiters}
          onChange={allowRecruiters =>
            update({ ...preferences, allowRecruiters })
          }
        />
      </div>
      <fieldset
        className="mt-4 space-y-3"
        disabled={!preferences.allowRecruiters}
      >
        <legend className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Contact methods
        </legend>
        <div className="flex flex-wrap gap-4">
          {methods.map(method => (
            <label key={method} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={preferences.methods.includes(method)}
                onChange={event => {
                  const nextMethods = event.target.checked
                    ? [...preferences.methods, method]
                    : preferences.methods.filter(item => item !== method);
                  update({ ...preferences, methods: nextMethods });
                }}
              />
              {method}
            </label>
          ))}
        </div>
      </fieldset>
      {preferences.allowRecruiters && preferences.methods.length === 0 && (
        <p
          role="alert"
          className="mt-3 text-sm font-medium text-amber-700 dark:text-amber-400"
        >
          Choose at least one contact method.
        </p>
      )}
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <FormField
          label="Best time to call"
          name="bestTime"
          type="select"
          value={preferences.bestTime}
          onChange={bestTime => update({ ...preferences, bestTime })}
          options={toOptions(times)}
        />
        <FormField
          label="Preferred language"
          name="language"
          type="select"
          value={preferences.language}
          onChange={language => update({ ...preferences, language })}
          options={toOptions(languages)}
        />
      </div>
    </section>
  );
};

export default CommunicationCard;
