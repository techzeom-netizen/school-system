import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type AccountCardProps = {
  onNotify: (message: string) => void;
};

const AccountCard = ({ onNotify }: AccountCardProps) => {
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  return (
    <section className="rounded-t-md border border-red-300 dark:border-red-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
          Your data and account
        </h2>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          className="rounded-none border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
          onClick={() => onNotify('TODO: call API to request data download.')}
        >
          Request download
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-none border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
          onClick={() => setDeactivateOpen(true)}
        >
          Deactivate
        </Button>
        <Button
          type="button"
          variant="destructive"
          className="rounded-none"
          onClick={() => setDeleteOpen(true)}
        >
          Delete account
        </Button>
      </div>

      <Dialog open={deactivateOpen} onOpenChange={setDeactivateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate account?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Your profile will be hidden until you sign in again.
          </p>
          <Button
            type="button"
            className="rounded-none bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => {
              setDeactivateOpen(false);
              onNotify('TODO: call API to deactivate account.');
            }}
          >
            Confirm deactivate
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete account forever?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Type DELETE to permanently delete this account.
          </p>
          <label className="text-xs font-medium text-slate-900 dark:text-slate-100">
            Confirmation
            <input
              value={confirmText}
              onChange={event => setConfirmText(event.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
            />
          </label>
          <Button
            type="button"
            variant="destructive"
            className="rounded-none"
            disabled={confirmText !== 'DELETE'}
            onClick={() => {
              setDeleteOpen(false);
              setConfirmText('');
              onNotify('TODO: call API to delete account.');
            }}
          >
            Delete forever
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AccountCard;
