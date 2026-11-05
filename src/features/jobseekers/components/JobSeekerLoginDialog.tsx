import { FormEvent, ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  KeyRound,
  MailCheck,
  ShieldCheck,
  Users,
  LucideIcon,
  BookmarkCheck,
  Building2,
  LockKeyhole,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import { getJobSeekerProfilePath } from '../config/jobSeekerNavigation';
import JobSeekerForgotPasswordForm from './JobSeekerForgotPasswordForm';
import JobSeekerLoginForm from './JobSeekerLoginForm';
import JobSeekerResetPasswordForm from './JobSeekerResetPasswordForm';

const logoSrc = '/frontendImages/LOGO.png';

type AuthMode = 'login' | 'forgot' | 'reset';

const sideContent: Record<
  AuthMode,
  {
    eyebrow: string;
    title: ReactNode;
    description: string;
    points: Array<{
      icon: LucideIcon;
      title: string;
      text: string;
      className: string;
    }>;
    headerTitle: string;
    headerDescription: string;
  }
> = {
  login: {
    eyebrow: 'Welcome back',
    title: (
      <>
        Jobs. People.
        <br />
        Opportunities.
      </>
    ),
    description: 'Sign in to manage saved jobs and applications.',
    headerTitle: 'Sign in to Demo School',
    headerDescription: 'Use your email, Google, or LinkedIn to continue.',
    points: [
      {
        icon: Users,
        title: 'Job seeker access',
        text: 'Find roles and manage your profile.',
        className:
          'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
      },
      {
        icon: Briefcase,
        title: 'Application tracking',
        text: 'Follow every step of your applications.',
        className:
          'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
      },
      {
        icon: BookmarkCheck,
        title: 'Save jobs you love',
        text: 'Keep your favorite opportunities organized.',
        className:
          'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400',
      },
      {
        icon: Building2,
        title: 'Follow companies',
        text: 'Discover new openings and company updates.',
        className:
          'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
      },
    ],
  },
  forgot: {
    eyebrow: 'Account recovery',
    title: (
      <>
        Recover access.
        <br />
        Stay secure.
      </>
    ),
    description:
      'Enter your registered email to receive a secure verification code.',
    headerTitle: 'Forgot password?',
    headerDescription: 'Enter your email to receive a verification code.',
    points: [
      {
        icon: MailCheck,
        title: 'Email verification',
        text: 'We send the OTP to your registered email address.',
        className:
          'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
      },
      {
        icon: ShieldCheck,
        title: 'Private and protected',
        text: 'Your recovery code helps keep your account secure.',
        className:
          'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400',
      },
      {
        icon: Briefcase,
        title: 'Back to your opportunities',
        text: 'Return to your saved jobs, profile, and applications.',
        className:
          'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
      },
    ],
  },
  reset: {
    eyebrow: 'Identity verification',
    title: (
      <>
        Reset password.
        <br />
        Keep access safe.
      </>
    ),
    description:
      'Enter the OTP from your email and create a new password for your account.',
    headerTitle: 'Reset password',
    headerDescription: 'Enter your code and create a new password.',
    points: [
      {
        icon: KeyRound,
        title: 'OTP check',
        text: 'Confirm the code sent to your registered email.',
        className:
          'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
      },
      {
        icon: ShieldCheck,
        title: 'Secure reset',
        text: 'Create a private new password before signing in again.',
        className:
          'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400',
      },
      {
        icon: LockKeyhole,
        title: 'Create a new password',
        text: 'Set a strong password to regain access.',
        className:
          'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
      },
    ],
  },
};

type JobSeekerLoginDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectTo?: string;
  disableOpenAnimation?: boolean;
};

const JobSeekerLoginDialog = ({
  open,
  onOpenChange,
  redirectTo,
  disableOpenAnimation = false,
}: JobSeekerLoginDialogProps) => {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');
  const content = sideContent[mode];

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setMode('login');
      setError('');
      setResetMessage('');
    }
  };

  const signIn = async (credentials: { email: string; password: string }) => {
    setError('');
    setIsSubmitting(true);

    try {
      await login({ ...credentials, type: 'Jobseeker', rememberMe: true });
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

      if (storedUser.role !== UserRole.JOB_SEEKER) {
        await logout();
        setError('Please use the job seeker login for this area.');
        return;
      }

      onOpenChange(false);
      navigate(redirectTo ?? getJobSeekerProfilePath(storedUser));
    } catch {
      setError('Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProviderLogin = () => {
    void signIn({ email: 'parent@demo-school.edu', password: 'password123' });
  };

  const handleRegisterClick = () => {
    onOpenChange(false);
    window.setTimeout(() => navigate('/jobseekers/register'), 0);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await signIn({ email, password });
  };

  const handleForgotSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setResetMessage(`OTP sent to ${recoveryEmail}.`);
    setMode('reset');
  };

  const handleResetSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (otp.length < 6) {
      setResetMessage('Enter the 6-digit OTP.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetMessage('Passwords do not match.');
      return;
    }

    setResetMessage('Password reset prepared. You can sign in now.');
  };

  const backToLogin = () => {
    setMode('login');
    setError('');
    setResetMessage('');
  };

  let authForm: ReactNode;
  if (mode === 'forgot') {
    authForm = (
      <JobSeekerForgotPasswordForm
        email={recoveryEmail}
        onEmailChange={setRecoveryEmail}
        onBack={backToLogin}
        onSubmit={handleForgotSubmit}
      />
    );
  } else if (mode === 'reset') {
    authForm = (
      <JobSeekerResetPasswordForm
        otp={otp}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        message={resetMessage}
        onOtpChange={setOtp}
        onNewPasswordChange={setNewPassword}
        onConfirmPasswordChange={setConfirmPassword}
        onBack={backToLogin}
        onSubmit={handleResetSubmit}
      />
    );
  } else {
    authForm = (
      <JobSeekerLoginForm
        email={email}
        password={password}
        error={error}
        isSubmitting={isSubmitting}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onProviderLogin={handleProviderLogin}
        onForgotPassword={() => {
          setMode('forgot');
          setError('');
          setResetMessage('');
        }}
        onRegister={handleRegisterClick}
        onSubmit={handleSubmit}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        disableOpenAnimation={disableOpenAnimation}
        className="h-[700px] overflow-hidden bg-white dark:bg-slate-900 p-0 sm:max-w-4xl lg:max-w-[950px]"
        onEscapeKeyDown={event => event.preventDefault()}
        onInteractOutside={event => event.preventDefault()}
      >
        <div className="grid h-full lg:grid-cols-[400px_550px]">
          <aside className="relative hidden h-full overflow-hidden border-r border-blue-100 dark:border-blue-900 bg-gradient-to-br from-white dark:from-slate-900 via-blue-50 dark:via-blue-950/40 to-blue-100 dark:to-blue-900/40 p-10 lg:block">
            <div className="absolute -bottom-28 -left-28 h-64 w-64 rounded-full bg-blue-200/40 dark:bg-blue-900/40" />
            <div className="absolute -bottom-36 left-16 h-72 w-72 rounded-full bg-blue-100/60 dark:bg-blue-900/60" />
            <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-blue-200/40 dark:bg-blue-900/40" />

            <div className="relative">
              <img
                src={logoSrc}
                alt="Demo School"
                className="h-10 w-auto bg-white rounded-md"
              />

              <h2 className="mt-10 text-[30px] font-black leading-tight text-slate-700 dark:text-slate-200">
                {content.title}
              </h2>
              <p className="mt-5 max-w-[330px] text-base leading-6 text-slate-600 dark:text-slate-300">
                {content.description}
              </p>

              <div className="mt-10 space-y-6">
                {content.points.map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex items-center gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${item.className}`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          <section className="flex h-full flex-col px-6 py-7 sm:px-8 lg:px-10 lg:py-10">
            <DialogHeader>
              <p className="text-[11px] font-bold uppercase tracking-[0.36em] text-slate-500 dark:text-slate-400">
                {content.eyebrow}
              </p>
              <DialogTitle className="mt-3 text-4xl font-black tracking-tight text-slate-700 dark:text-slate-200">
                {content.headerTitle}
              </DialogTitle>
              <DialogDescription className="mt-2 text-base text-slate-600 dark:text-slate-300">
                {content.headerDescription}
              </DialogDescription>
            </DialogHeader>

            {authForm}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobSeekerLoginDialog;
