import type { FormEvent } from 'react';
import { ArrowRight, UserPlus } from 'lucide-react';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';

const googleLogoSrc = '/frontendImages/googleLogo.png';
const linkedInLogoSrc = '/frontendImages/linkidIn.png';

type JobSeekerLoginFormProps = {
  email: string;
  password: string;
  error: string;
  isSubmitting: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onProviderLogin: () => void;
  onForgotPassword: () => void;
  onRegister: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const JobSeekerLoginForm = ({
  email,
  password,
  error,
  isSubmitting,
  onEmailChange,
  onPasswordChange,
  onProviderLogin,
  onForgotPassword,
  onRegister,
  onSubmit,
}: JobSeekerLoginFormProps) => (
  <>
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      <Button
        type="button"
        variant="outline"
        className="h-11 justify-center gap-2 rounded-lg border-slate-400 dark:border-white/60 text-base font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400"
        onClick={onProviderLogin}
        disabled={isSubmitting}
      >
        <img src={googleLogoSrc} alt="" className="h-5 w-5" />
        <span>Continue with Google</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        className="h-11 justify-center gap-2 rounded-lg border-slate-400 dark:border-white/60 text-base font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400"
        onClick={onProviderLogin}
        disabled={isSubmitting}
      >
        <img src={linkedInLogoSrc} alt="" className="h-5 w-5" /> Continue with
        LinkedIn
      </Button>
    </div>

    <div className="my-5 flex items-center gap-5">
      <div className="h-px flex-1 bg-slate-200 dark:bg-white/40" />
      <span className="text-xs font-bold uppercase tracking-widest dark:text-white/60">
        or
      </span>
      <div className="h-px flex-1 bg-slate-200 dark:bg-white/40" />
    </div>

    <form onSubmit={onSubmit} className="space-y-4">
      <FormField
        label="Email address"
        name="jobseeker-email"
        type="email"
        value={email}
        onChange={onEmailChange}
        placeholder="parent@demo-school.edu"
        required
        className="[&_input]:h-11 [&_input]:rounded-sm [&_input]:px-4 [&_input]:text-base [&_label]:text-sm [&_label]:font-bold"
      />
      <FormField
        label="Password"
        name="jobseeker-password"
        type="password"
        value={password}
        onChange={onPasswordChange}
        placeholder="Enter password"
        required
        className="[&_input]:h-11 [&_input]:rounded-sm [&_input]:px-4 [&_input]:text-base [&_label]:text-sm [&_label]:font-bold"
      />

      <div className="flex justify-end">
        <Button
          type="button"
          variant="link"
          className="h-auto p-0 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-400"
          onClick={onForgotPassword}
        >
          Forgot password?
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <Button
        type="submit"
        className="h-11 w-full rounded-lg bg-blue-600 text-base font-bold text-white hover:bg-blue-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Signing in...' : 'Sign in'}
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </Button>
    </form>

    <div className="mt-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-center">
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
        New to Demo School?
      </p>
      <Button
        type="button"
        variant="outline"
        className="mt-3 h-10 w-full gap-2 rounded-lg border-blue-600 text-base font-bold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-700 dark:hover:text-blue-400"
        onClick={onRegister}
      >
        <UserPlus className="h-4 w-4" aria-hidden="true" />
        Create an account
      </Button>
    </div>
  </>
);

export default JobSeekerLoginForm;
