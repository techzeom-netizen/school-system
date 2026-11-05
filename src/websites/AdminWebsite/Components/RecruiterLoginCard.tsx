import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole } from 'lucide-react';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import { getRoleDashboardPath } from '@/utils/roleUtils';

interface RecruiterLoginCardProps {
  onRegister: () => void;
}

interface LoginErrors {
  email?: string;
  password?: string;
  form?: string;
}

const fieldClass =
  '[&_input]:h-11 [&_input]:rounded-md [&_input]:px-4 [&_input]:text-base [&_label]:text-sm [&_label]:font-bold';

const RecruiterLoginCard = ({ onRegister }: RecruiterLoginCardProps) => {
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof typeof form, value: string | boolean) => {
    setForm(current => ({ ...current, [field]: value }));
    setErrors({});
  };

  const validate = () => {
    if (!form.email.trim() || !form.password) {
      setErrors({ form: 'Enter your work email and password.' });
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setErrors({ email: 'Enter a valid work email address.' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login({ ...form, type: 'Company Admin' });
      navigate(getRoleDashboardPath(UserRole.COMPANY_ADMIN));
    } catch {
      // Auth context exposes the error message.
    } finally {
      setIsSubmitting(false);
    }
  };

  const errorMessage =
    errors.form || errors.email || errors.password || authError;

  return (
    <aside className="rounded-2xl border border-slate-200 dark:border-white/60 bg-white dark:bg-slate-900 p-6 shadow-xl sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
        Recruiter login
      </p>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
        Welcome back
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        Sign in with your work email to manage your jobs and candidates.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <FormField
          label="Work email"
          name="recruiter-login-email"
          type="email"
          value={form.email}
          onChange={value => updateField('email', value)}
          placeholder="you@company.com"
          error={errors.email}
          required
          className={fieldClass}
        />

        <FormField
          name="Password"
          type="password"
          label="Password"
          value={form.password}
          onChange={value => updateField('password', value)}
          placeholder="Enter your password"
          error={errors.password}
          required
          disabled={isSubmitting}
          className={fieldClass}
        />

        <div className="flex items-center justify-between gap-3">
          <FormField
            label="Remember me"
            name="recruiter-remember-me"
            type="checkbox"
            value={form.rememberMe}
            onCheckboxChange={checked => updateField('rememberMe', checked)}
            className="[&_label]:text-sm [&_label]:font-medium [&_label]:text-slate-600 dark:[&_label]:text-slate-300 "
          />
          <Button
            type="button"
            variant="link"
            className="text-sm font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            onClick={() => {}}
          >
            Forgot password?
          </Button>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="rounded-xl border border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm leading-6 text-red-700 dark:text-red-400"
          >
            {errorMessage}
          </div>
        )}

        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          className="h-12 w-full rounded-xl bg-blue-800 text-base font-semibold text-white shadow-lg shadow-blue-700/20 hover:bg-blue-800"
        >
          Login
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="mt-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 text-center">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          New to Demo School?
        </p>
        <button
          type="button"
          onClick={onRegister}
          className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          Register Account
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        <LockKeyhole className="h-3.5 w-3.5" />
        Secure login for verified employers
      </p>
    </aside>
  );
};

export default RecruiterLoginCard;
