import type { FormEvent } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';

type JobSeekerForgotPasswordFormProps = {
  email: string;
  onEmailChange: (value: string) => void;
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const JobSeekerForgotPasswordForm = ({
  email,
  onEmailChange,
  onBack,
  onSubmit,
}: JobSeekerForgotPasswordFormProps) => (
  <form onSubmit={onSubmit} className="mt-7 space-y-5">
    <FormField
      label="Registered email address"
      name="recovery-email"
      type="email"
      value={email}
      onChange={onEmailChange}
      placeholder="parent@kdpublicschool.edu"
      required
      className="[&_input]:h-11 [&_input]:rounded-md [&_input]:px-4 [&_input]:text-base [&_label]:text-sm [&_label]:font-bold"
    />

    <div className="rounded-lg border border-amber-100 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 px-4 py-4">
      <div className="flex gap-3">
        <ShieldCheck
          className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400"
          aria-hidden="true"
        />
        <p className="text-sm leading-5 text-slate-700 dark:text-slate-200">
          We'll send a verification code to your registered email.
        </p>
      </div>
    </div>

    <Button
      type="submit"
      className="h-11 w-full rounded-lg bg-blue-600 text-sm font-bold uppercase tracking-widest text-white hover:bg-blue-700"
    >
      Send OTP
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

export default JobSeekerForgotPasswordForm;
