import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getDaysSince, type SecuritySettings } from '../../data/profile';
import Switch from './Switch';

type SecurityCardProps = {
  settings: SecuritySettings;
  onChange: (settings: SecuritySettings) => void;
  onNotify: (message: string) => void;
};

const inputClass =
  'h-10 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900';

const SecurityCard = ({ settings, onChange, onNotify }: SecurityCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    next: '',
    confirm: '',
  });
  const [error, setError] = useState('');

  const update = (next: SecuritySettings) => {
    onChange(next);
    // TODO: call API to update security settings.
  };

  const changePassword = () => {
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      setError('All password fields are required.');
      return;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(passwords.next)) {
      setError('New password needs 8 chars, uppercase, lowercase and number.');
      return;
    }
    if (passwords.current === passwords.next) {
      setError('New password must differ from current password.');
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setError('Confirm password must match.');
      return;
    }
    onNotify('Password updated. TODO: call API to change password.');
    setDialogOpen(false);
    setPasswords({ current: '', next: '', confirm: '' });
    setError('');
  };

  return (
    <section className="rounded-t-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
          Login and security
        </h2>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            Password
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last changed {getDaysSince(settings.passwordChangedAt)} days ago
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="rounded-none border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
          onClick={() => setDialogOpen(true)}
        >
          Change password
        </Button>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Two-step verification
        </span>
        <Switch
          label="Two-step verification"
          checked={settings.twoStep}
          onChange={twoStep => {
            update({ ...settings, twoStep });
            if (twoStep) onNotify('TODO: call API to connect OTP setup.');
          }}
        />
      </div>
      <div className="mt-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Signed-in devices
          </h3>
          <Button
            type="button"
            variant="ghost"
            className="text-blue-700 dark:text-blue-400"
            onClick={() => {
              update({
                ...settings,
                sessions: settings.sessions.filter(session => session.current),
              });
              onNotify('TODO: call API to log out other devices.');
            }}
          >
            Log out of all other devices
          </Button>
        </div>
        <div className="mt-3 space-y-2">
          {settings.sessions.map(session => (
            <div
              key={session.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 dark:border-slate-800 p-3"
            >
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {session.device}{' '}
                  {session.current && (
                    <span className="rounded-full bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 text-xs text-blue-700 dark:text-blue-400">
                      This device
                    </span>
                  )}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {session.location} | {session.lastActive}
                </p>
              </div>
              {!session.current && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Log out ${session.device}`}
                  onClick={() => {
                    update({
                      ...settings,
                      sessions: settings.sessions.filter(
                        item => item.id !== session.id
                      ),
                    });
                    onNotify('TODO: call API to log out this device.');
                  }}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {[
              ['current', 'Current password'],
              ['next', 'New password'],
              ['confirm', 'Confirm password'],
            ].map(([key, label]) => (
              <label
                key={key}
                className="text-xs font-medium text-slate-900 dark:text-slate-100"
              >
                {label}
                <input
                  type="password"
                  value={passwords[key as keyof typeof passwords]}
                  onChange={event =>
                    setPasswords(current => ({
                      ...current,
                      [key]: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </label>
            ))}
            {error && (
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
            <Button
              type="button"
              className="rounded-none bg-blue-600 text-white hover:bg-blue-700"
              onClick={changePassword}
            >
              Update password
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SecurityCard;
