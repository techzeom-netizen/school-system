import { useState } from 'react';
import { ExternalLink, Link2 } from 'lucide-react';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import { isHttpUrl, type OnlineLinks } from '../../data/profile';

type OnlinePresenceCardProps = {
  links: OnlineLinks;
  onSave: (links: OnlineLinks) => void;
};

const linkFields: Array<[keyof OnlineLinks, string]> = [
  ['linkedin', 'LinkedIn'],
  ['github', 'GitHub'],
  ['portfolio', 'Portfolio/website'],
  ['other', 'Other link'],
];

const OnlinePresenceCard = ({ links, onSave }: OnlinePresenceCardProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(links);
  const [error, setError] = useState('');
  const filledLinks = linkFields.filter(([key]) => links[key]);

  const handleSave = () => {
    if (!Object.values(draft).every(isHttpUrl)) {
      setError('Links must start with http:// or https://.');
      return;
    }
    onSave(draft);
    setEditing(false);
    setError('');
    // TODO: call API to save online presence.
  };

  return (
    <section className="rounded-t-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
          Online presence
        </h2>
        <Button
          type="button"
          variant="outline"
          className="rounded-none border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
          onClick={() => {
            setDraft(links);
            setEditing(!editing);
            setError('');
          }}
        >
          {editing ? 'Cancel' : filledLinks.length ? 'Edit' : 'Add links'}
        </Button>
      </div>
      {editing ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {linkFields.map(([key, label]) => (
            <FormField
              key={key}
              label={label}
              name={key}
              type="text"
              value={draft[key]}
              onChange={value =>
                setDraft(current => ({ ...current, [key]: value }))
              }
              placeholder="https://example.com"
              maxLength={180}
            />
          ))}
          {error && (
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <div className="md:col-span-2">
            <Button
              type="button"
              className="rounded-none bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleSave}
            >
              Save links
            </Button>
          </div>
        </div>
      ) : filledLinks.length ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {filledLinks.map(([key, label]) => (
            <a
              key={key}
              href={links[key]}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-3 text-sm font-semibold text-slate-800 dark:text-slate-100 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/40"
            >
              <span className="flex min-w-0 items-center gap-2">
                <Link2 className="h-4 w-4 text-blue-700 dark:text-blue-400" />
                <span className="truncate">{label}</span>
              </span>
              <ExternalLink className="h-4 w-4 text-slate-400" />
            </a>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 p-5 text-center text-sm text-slate-500 dark:text-slate-400">
          Add links recruiters can use to understand your work.
        </div>
      )}
    </section>
  );
};

export default OnlinePresenceCard;
