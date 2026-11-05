import type { FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';

type JobSeekerResetPasswordFormProps = {
  otp: string;
  newPassword: string;
  confirmPassword: string;
  message: string;
  onOtpChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const JobSeekerResetPasswordForm = ({
  otp,
  newPassword,
  confirmPassword,
  message,
  onOtpChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onBack,
  onSubmit,
}: JobSeekerResetPasswordFormProps) => (
  <form onSubmit={onSubmit} className="mt-7 space-y-5">
    <FormField
      label="6-digit OTP"
      name="recovery-otp"
      type="otp"
      value={otp}
      onChange={onOtpChange}
      required
      className="[&_label]:text-sm [&_label]:font-bold [&_label]:gap-6"
    />
    <FormField
      label="New password"
      name="new-password"
      type="password"
      value={newPassword}
      onChange={onNewPasswordChange}
      placeholder="Minimum 8 characters"
      required
      className="[&_input]:h-11 [&_input]:rounded-md [&_input]:px-4 [&_input]:text-base [&_label]:text-sm [&_label]:font-bold"
    />
    <FormField
      label="Confirm password"
      name="confirm-new-password"
      type="password"
      value={confirmPassword}
      onChange={onConfirmPasswordChange}
      placeholder="Re-enter new password"
      required
      className="[&_input]:h-11 [&_input]:rounded-md [&_input]:px-4 [&_input]:text-base [&_label]:text-sm [&_label]:font-bold"
    />

    {message && (
      <p
        className={`rounded-md px-3 py-2 text-sm ${
          message.startsWith('Enter') || message.includes('match')
            ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
            : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
        }`}
      >
        {message}
      </p>
    )}

    <Button
      type="submit"
      className="h-11 w-full rounded-lg bg-blue-600 text-sm font-bold uppercase tracking-widest text-white hover:bg-blue-700"
    >
      Reset password
      <ArrowRight className="h-5 w-5" aria-hidden="true" />
    </Button>

    <div className="border-t border-slate-100 dark:border-slate-800 pt-5 text-center">
      <Button
        type="button"
        variant="link"
        className="h-auto gap-2 p-0 text-sm font-bold text-slate-950 dark:text-slate-100 hover:text-blue-700 dark:hover:text-blue-400"
        onClick={onBack}
      >
        <ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />
        Back to sign in
      </Button>
    </div>
  </form>
);

export default JobSeekerResetPasswordForm;
