import { useRef, useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type ShareProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileUrl: string;
  candidateName: string;
};

const ShareProfileDialog = ({
  open,
  onOpenChange,
  profileUrl,
  candidateName,
}: ShareProfileDialogProps) => {
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const message = `View ${candidateName}'s profile: ${profileUrl}`;
  const subject = `${candidateName}'s profile`;

  const copyProfileLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
    } catch {
      inputRef.current?.select();
      document.execCommand('copy');
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const shareNative = async () => {
    if (!navigator.share) return;
    await navigator.share({
      title: subject,
      text: message,
      url: profileUrl,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share profile</DialogTitle>
          <DialogDescription>
            Send {candidateName.split(' ')[0]}
            {' profile'} to a recruiter, friend or referral.
          </DialogDescription>
        </DialogHeader>

        <div>
          <label
            htmlFor="profile-link"
            className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400"
          >
            Profile link
          </label>
          <div className="mt-1 flex gap-2">
            <input
              ref={inputRef}
              id="profile-link"
              value={profileUrl}
              readOnly
              onFocus={event => event.currentTarget.select()}
              className="h-10 min-w-0 flex-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
            />
            <Button
              type="button"
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => void copyProfileLink()}
            >
              {copied ? (
                <Check className="mr-1.5 h-4 w-4" />
              ) : (
                <Copy className="mr-1.5 h-4 w-4" />
              )}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <p className="sr-only" role="status" aria-live="polite">
            {copied ? 'Profile link copied to clipboard' : ''}
          </p>
        </div>

        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <Button
            type="button"
            variant="outline"
            onClick={() => void shareNative()}
          >
            <Share2 className="mr-2 h-4 w-4" />
            More options
          </Button>
        )}
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Anyone with this link can see the recruiter-visible version of your
          profile. Phone and email stay hidden until you share them.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default ShareProfileDialog;
