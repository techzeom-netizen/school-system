import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookmarkCheck,
  Briefcase,
  CheckCircle2,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import EmailOtpVerificationDialog from '@/components/common/EmailOtpVerificationDialog';
import { userRegistrationService } from '@/services/userRegistration.service';
import { showSuccessToast } from '@/lib/utils';

const logoSrc = '/frontendImages/LOGO.png';

const benefits = [
  {
    icon: Briefcase,
    title: 'Discover opportunities',
    text: 'Find jobs that match your skills and ambitions.',
    className:
      'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
  },
  {
    icon: UserRound,
    title: 'Build your professional profile',
    text: 'Showcase your experience and stand out.',
    className:
      'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400',
  },
  {
    icon: BookmarkCheck,
    title: 'Stay on top of your career',
    text: 'Save jobs and track every application.',
    className:
      'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
  },
];

const fieldClass =
  '[&_input]:h-11 [&_input]:rounded-md [&_input]:px-4 [&_input]:text-base [&_label]:text-sm [&_label]:font-bold';

const JobSeekerRegisterPage = () => {
  const navigate = useNavigate();
  const redirectTimeoutRef = useRef<number>();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [registrationRequestId, setRegistrationRequestId] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  useEffect(
    () => () => {
      if (redirectTimeoutRef.current) {
        window.clearTimeout(redirectTimeoutRef.current);
      }
    },
    []
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setIsError(false);

    if (password.length < 8) {
      setIsError(true);
      setMessage('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setIsError(true);
      setMessage('Passwords do not match.');
      return;
    }

    setIsRegistering(true);

    try {
      const response = await userRegistrationService.registerUser({
        name: fullName.trim(),
        email: email.trim(),
        password,
        type: 'Jobseeker',
      });

      setRegistrationRequestId(response.data.requestId);
      setEmailOtp('');
      setOtpError('');
      setOtpDialogOpen(true);
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : 'Unable to create your account. Please try again.'
      );
    } finally {
      setIsRegistering(false);
    }
  };

  const handleOtpDialogOpenChange = (open: boolean) => {
    setOtpDialogOpen(open);
    if (!open) {
      setOtpError('');
    }
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
      setIsError(false);
      const successMessage = 'your account created successfully.';
      setMessage(successMessage);
      showSuccessToast(successMessage);

      if (redirectTimeoutRef.current) {
        window.clearTimeout(redirectTimeoutRef.current);
      }
      redirectTimeoutRef.current = window.setTimeout(() => {
        navigate('/?login=true', { replace: true });
      }, 3000);
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

  const passwordChecks = [
    {
      label: 'At least 8 characters',
      valid: password.length >= 8,
    },
    {
      label: 'Passwords match',
      valid: confirmPassword.length > 0 && password === confirmPassword,
    },
  ];

  return (
    <div className="grid w-full h-screen border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 lg:grid-cols-[1.1fr_1.1fr]">
      {/* Left branding panel */}
      <aside className="relative hidden flex-col overflow-hidden bg-gradient-to-br from-[#f9fcff] dark:from-slate-900 via-[#eef5ff] dark:via-slate-900 to-[#dceaff] dark:to-slate-900 px-10 py-10 lg:flex xl:px-14 xl:py-12">
        <div className="pointer-events-none absolute -right-14 -top-20 h-48 w-48 rounded-full bg-blue-200/40 dark:bg-blue-900/40" />
        <div className="pointer-events-none absolute -bottom-36 -left-24 h-80 w-80 rounded-full bg-blue-200/35 dark:bg-blue-900/35" />
        <div className="pointer-events-none absolute -bottom-44 right-[-100px] h-80 w-80 rounded-full bg-blue-100/60 dark:bg-blue-900/60" />

        <div className="relative z-10 flex items-center">
          <div>
            <img
              src={logoSrc}
              alt="Demo School"
              className="h-12 w-auto object-contain bg-white rounded-md"
            />
          </div>
        </div>

        <div className="relative z-10 mt-12 xl:mt-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 dark:border-blue-900 bg-white/70 dark:bg-slate-900/70 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Your career journey begins here
          </div>

          <h1 className="mt-6 max-w-md text-[38px] font-extrabold leading-[1.17] tracking-tight text-slate-800 dark:text-slate-100 xl:text-[42px]">
            Your next chapter
            <br />
            starts here.
          </h1>

          <p className="mt-5 max-w-sm text-base leading-7 text-slate-600 dark:text-slate-300">
            Create your profile, explore new opportunities, and move your career
            forward with Demo School.
          </p>

          <div className="mt-10 space-y-6 xl:mt-12 xl:space-y-8">
            {benefits.map(({ icon: Icon, title, text, className }) => (
              <div key={title} className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${className}`}
                >
                  <Icon
                    className="h-6 w-6"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>
                <div className="pt-0.5">
                  <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-auto flex items-center gap-2 pt-8 text-xs font-medium text-slate-500 dark:text-slate-400 xl:pt-12">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          A simpler way to build your career.
        </div>
      </aside>

      {/* Registration form panel */}
      <section className="flex flex-col px-5 py-8 sm:px-10 sm:py-10 lg:px-12 xl:px-16">
        <div className="mb-8 -mt-6 md:pt-12 flex items-center justify-center gap-2 lg:hidden">
          <img
            src={logoSrc}
            alt="Demo School"
            className="h-14 w-auto object-contain bg-white rounded-md"
          />{' '}
        </div>

        <div className="mx-auto w-full mt-12">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
            Join Demo School
          </p>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-700 dark:text-slate-200 sm:text-[38px] sm:leading-tight">
            Create your account
          </h2>

          <p className="my-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Start discovering opportunities made for you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Full name"
              name="candidate-name"
              type="text"
              value={fullName}
              onChange={setFullName}
              placeholder="Enter your full name"
              required
              className={fieldClass}
            />

            <FormField
              label="Email address"
              name="candidate-email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              required
              className={fieldClass}
            />

            <div className="relative">
              <FormField
                label="Password"
                name="candidate-password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="Create a password"
                required
                className={`${fieldClass} [&_input]:pr-12`}
              />
            </div>

            <div className="relative">
              <FormField
                label="Confirm password"
                name="candidate-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Re-enter your password"
                required
                className={`${fieldClass} [&_input]:pr-12`}
              />
            </div>

            {(password || confirmPassword) && (
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {passwordChecks.map(check => (
                  <div
                    key={check.label}
                    className={`flex items-center gap-1.5 text-xs ${
                      check.valid
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {check.label}
                  </div>
                ))}
              </div>
            )}

            {message && (
              <div
                role={isError ? 'alert' : 'status'}
                className={`rounded-lg border px-4 py-3 text-sm leading-6 ${
                  isError
                    ? 'border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400'
                    : 'border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                }`}
              >
                {message}
              </div>
            )}

            <Button
              type="submit"
              className="mt-2 h-11 w-full rounded-lg bg-blue-600 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700"
              isLoading={isRegistering}
              disabled={isRegistering}
            >
              Create account
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-7 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Already have an account?
            </p>
            <Link
              to="/?login=true"
              className="mt-2 inline-flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400 transition hover:text-blue-700 dark:hover:text-blue-400"
            >
              Sign in to Demo School
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
            <LockKeyhole className="h-3.5 w-3.5" />
            Secure registration
          </div>
        </div>
      </section>

      <EmailOtpVerificationDialog
        open={otpDialogOpen}
        onOpenChange={handleOtpDialogOpenChange}
        email={email}
        accountType="candidate"
        value={emailOtp}
        onChange={setEmailOtp}
        error={otpError}
        onSubmit={handleOtpSubmit}
        isSubmitting={isVerifyingOtp}
      />
    </div>
  );
};

export default JobSeekerRegisterPage;
