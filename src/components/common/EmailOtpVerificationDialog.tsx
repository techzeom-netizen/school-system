import type { FormEvent } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface EmailOtpVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  accountType: 'candidate' | 'recruiter';
  value: string;
  onChange: (value: string) => void;
  error: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting?: boolean;
}

const EmailOtpVerificationDialog = ({
  open,
  onOpenChange,
  email,
  accountType,
  value,
  onChange,
  error,
  onSubmit,
  isSubmitting = false,
}: EmailOtpVerificationDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-2xl border-blue-100 dark:border-blue-900 bg-white dark:bg-slate-900 p-0 shadow-2xl">
      <DialogHeader className="border-b border-slate-100 dark:border-slate-800 px-6 pb-4 pt-6 text-left">
        <div className="flex items-center gap-3 pr-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </div>
          <DialogTitle className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            Verify your email
          </DialogTitle>
        </div>
        <DialogDescription className="text-sm leading-6 text-slate-500 dark:text-slate-400">
          Enter the 6-digit OTP sent to{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {email}
          </span>{' '}
          to finish creating your KD Public School account.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={onSubmit} className="space-y-5 px-6 pb-6">
        <FormField
          label="Email OTP"
          name="registration-email-otp"
          type="otp"
          value={value}
          onChange={onChange}
          error={error}
          hint="Use the latest OTP from your email inbox."
          required
          className="pt-1 [&_label]:text-center [&_label]:text-sm [&_label]:font-bold [&_label]:text-slate-700 dark:[&_label]:text-slate-200"
        />

        <div className="rounded-xl border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 px-4 py-3 text-sm leading-6 text-blue-700 dark:text-blue-400">
          We will create your {accountType} account after email verification.
        </div>

        <DialogFooter className="gap-3 pt-1 sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-lg border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-11 rounded-lg bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Verify & create account
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
);

export default EmailOtpVerificationDialog;
