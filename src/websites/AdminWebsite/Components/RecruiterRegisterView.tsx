import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react';
import FormField from '@/components/common/FormField';
import EmailOtpVerificationDialog from '@/components/common/EmailOtpVerificationDialog';
import { Button } from '@/components/ui/button';
import { userRegistrationService } from '@/services/userRegistration.service';
import { showSuccessToast } from '@/lib/utils';
import { registerFeatures } from './employerPortalData';

interface RecruiterRegisterViewProps {
  onLogin: () => void;
}

interface RegisterErrors {
  fullName?: string;
  workEmail?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  form?: string;
}

const registerFeatureStyles = [
  'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 ring-blue-200 dark:ring-blue-800',
  'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 ring-emerald-200 dark:ring-emerald-800',
  'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400 ring-violet-200 dark:ring-violet-800',
  'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 ring-amber-200 dark:ring-amber-800',
];

const initialForm = {
  fullName: '',
  workEmail: '',
  password: '',
  confirmPassword: '',
  terms: false,
};

const RecruiterRegisterView = ({ onLogin }: RecruiterRegisterViewProps) => {
  const loginTimeoutRef = useRef<number>();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [registrationRequestId, setRegistrationRequestId] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  useEffect(
    () => () => {
      if (loginTimeoutRef.current) {
        window.clearTimeout(loginTimeoutRef.current);
      }
    },
    []
  );

  const updateField = (field: keyof typeof form, value: string | boolean) => {
    setForm(current => ({ ...current, [field]: value }));
    setErrors({});
  };

  const validate = () => {
    const nextErrors: RegisterErrors = {};

    if (!form.fullName.trim()) nextErrors.fullName = 'Full name is required.';
    if (!form.workEmail.trim()) {
      nextErrors.workEmail = 'Work email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(form.workEmail)) {
      nextErrors.workEmail = 'Enter a valid work email address.';
    }
    if (form.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    }
    if (!form.confirmPassword) {
      nextErrors.confirmPassword = 'Confirm your password.';
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }
    if (!form.terms) nextErrors.terms = 'Please accept the terms.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setIsRegistering(true);

    try {
      const response = await userRegistrationService.registerUser({
        name: form.fullName.trim(),
        email: form.workEmail.trim(),
        password: form.password,
        type: 'Company Admin',
      });

      setRegistrationRequestId(response.data.requestId);
      setEmailOtp('');
      setOtpError('');
      setOtpDialogOpen(true);
    } catch (error) {
      setErrors({
        form:
          error instanceof Error
            ? error.message
            : 'Unable to create your account. Please try again.',
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleOtpDialogOpenChange = (open: boolean) => {
    setOtpDialogOpen(open);
    if (!open) setOtpError('');
  };

  const handleOtpSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOtpError('');

    if (emailOtp.length !== 6) {
      setOtpError('Please enter the 6-digit OTP sent to your email.');
      return;
    }

    if (!registrationRequestId) {
      setOtpError('Registration request is missing. Please register again.');
      return;
    }

    setIsVerifyingOtp(true);

    try {
      await userRegistrationService.verifyUserRegistration({
        requestId: registrationRequestId,
        otp: emailOtp,
      });

      setOtpDialogOpen(false);
      setEmailOtp('');
      setRegistrationRequestId('');
      setForm(initialForm);
      setErrors({});
      showSuccessToast('Recruiter account created successfully.');

      if (loginTimeoutRef.current) {
        window.clearTimeout(loginTimeoutRef.current);
      }
      loginTimeoutRef.current = window.setTimeout(onLogin, 3000);
    } catch (error) {
      setOtpError(
        error instanceof Error
          ? error.message
          : 'Unable to verify the OTP. Please try again.'
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const errorMessage =
    errors.form ||
    errors.fullName ||
    errors.workEmail ||
    errors.password ||
    errors.confirmPassword ||
    errors.terms;

  return (
    <main className="min-h-[calc(100vh-4.1rem)] bg-white dark:bg-slate-900 lg:h-[calc(100vh-4.4rem)] lg:overflow-hidden">
      <section className="mx-auto grid min-h-[calc(100vh-4.5rem)] w-full max-w-[1560px] px-5 lg:h-full lg:grid-cols-2 lg:px-8">
        <aside className="relative hidden overflow-hidden bg-[linear-gradient(135deg,#eef6ff_0%,#dbeafe_48%,#ecfdf5_100%)] dark:bg-[linear-gradient(135deg,#0f172a_0%,#172554_48%,#052e2b_100%)] px-10 py-12 lg:flex lg:h-full lg:items-center">
          <div className="absolute right-8 top-8 h-28 w-28 rounded-3xl border border-white/70 dark:border-slate-700/70 bg-white/30 dark:bg-slate-900/30 rotate-12" />
          <div className="absolute -left-16 top-28 h-48 w-48 rounded-full border-[28px] border-blue-200/60 dark:border-blue-800/60" />

          <div className="relative">
            <div className="flex flex-wrap items-center gap-2.5">
              <div
                className="hx-rise inline-flex items-center gap-2 rounded-md border border-blue-200 dark:border-blue-800 bg-white/90 dark:bg-slate-900/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-800 dark:text-blue-300 shadow-sm"
                style={{ animationDelay: '0ms' }}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Start hiring today
              </div>
              <div
                className="hx-rise inline-flex items-center rounded-md bg-emerald-600 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white border border-emerald-600"
                style={{ animationDelay: '60ms' }}
              >
                Free HRMS included
              </div>
            </div>
            <h1 className="mt-6 max-w-lg text-4xl font-extrabold leading-tight tracking-tight text-slate-950 dark:text-slate-100">
              Build your school community with Demo School.
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-slate-600 dark:text-slate-300">
              Create your recruiter account, publish your first role and start
              receiving applications in minutes.
            </p>
            <div className="mt-9 grid gap-4">
              {registerFeatures.map(({ icon: Icon, title, text }, index) => (
                <div
                  key={title}
                  className="group flex items-start gap-4 rounded-2xl border border-white/70 dark:border-slate-700/70 bg-white/75 dark:bg-slate-900/75 p-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ${
                      registerFeatureStyles[
                        index % registerFeatureStyles.length
                      ]
                    }`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-slate-100">
                      {title}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              A simpler way to hire verified talent.
            </p>
          </div>
        </aside>

        <section className="px-0 py-8 sm:py-10 lg:flex lg:h-full lg:overflow-y-auto lg:px-12 lg:py-6">
          <div className="mx-auto flex w-full max-w-2xl flex-col justify-center lg:min-h-full">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
              Join Demo School
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-100 lg:text-4xl">
              Create recruiter account
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
              Start hiring verified talent today.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
              <FormField
                label="Full name"
                name="register-full-name"
                type="text"
                value={form.fullName}
                onChange={value => updateField('fullName', value)}
                placeholder="Enter your full name"
                error={errors.fullName}
                required
              />
              <FormField
                label="Work email"
                name="register-work-email"
                type="email"
                value={form.workEmail}
                onChange={value => updateField('workEmail', value)}
                placeholder="you@company.com"
                error={errors.workEmail}
                required
              />

              <FormField
                name="Password"
                label="Password"
                type="password"
                value={form.password}
                onChange={value => updateField('password', value)}
                placeholder="Min. 8 characters"
                error={errors.password}
                required
              />
              <FormField
                name="Confirm password"
                label="Confirm password"
                type="password"
                value={form.confirmPassword}
                onChange={value => updateField('confirmPassword', value)}
                placeholder="Re-enter password"
                error={errors.confirmPassword}
                required
              />

              <FormField
                label="I agree to the Terms & Conditions and Privacy Policy."
                name="register-terms"
                type="checkbox"
                value={form.terms}
                onCheckboxChange={checked => updateField('terms', checked)}
                error={errors.terms}
              />

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
                className="h-12 w-full rounded-xl bg-blue-700 text-base font-semibold text-white shadow-lg shadow-blue-700/20 hover:bg-blue-800"
                isLoading={isRegistering}
                disabled={isRegistering}
              >
                Create account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Already have an account?
              </p>
              <Button
                type="button"
                variant="link"
                onClick={onLogin}
                className="mt-2 h-auto gap-2 p-0 text-sm font-bold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Sign in to Demo School
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <p className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <LockKeyhole className="h-3.5 w-3.5" />
              Secure registration
            </p>
          </div>
        </section>
      </section>
      <EmailOtpVerificationDialog
        open={otpDialogOpen}
        onOpenChange={handleOtpDialogOpenChange}
        email={form.workEmail}
        accountType="recruiter"
        value={emailOtp}
        onChange={setEmailOtp}
        error={otpError}
        onSubmit={handleOtpSubmit}
        isSubmitting={isVerifyingOtp}
      />
    </main>
  );
};

export default RecruiterRegisterView;
