import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Check,
  Copy,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import FormField from '@/components/common/FormField';
import SchoolBrand from '@/components/common/SchoolBrand';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { getRoleDashboardPath } from '@/utils/roleUtils';
import { getJobSeekerProfilePath } from '@/features/jobseekers/config/jobSeekerNavigation';
import { LoginCredentials, UserRole } from '@/types';

const TEMP_EMPLOYEE_LOGIN: LoginCredentials = {
  email: 'staff@kdpublicschool.edu',
  password: 'password123',
  type: 'Employee',
  rememberMe: true,
};

const REMEMBERED_EMPLOYEE_LOGIN_KEY = 'schoolSystemRememberedLogin';

interface RememberedEmployeeLogin {
  email: string;
  password: string;
}

const getRememberedEmployeeLogin = (): RememberedEmployeeLogin | null => {
  if (typeof window === 'undefined') return null;

  try {
    const savedLogin = window.localStorage.getItem(
      REMEMBERED_EMPLOYEE_LOGIN_KEY
    );
    if (!savedLogin) return null;

    const parsedLogin = JSON.parse(
      savedLogin
    ) as Partial<RememberedEmployeeLogin>;
    if (
      typeof parsedLogin.email !== 'string' ||
      typeof parsedLogin.password !== 'string'
    ) {
      return null;
    }

    return { email: parsedLogin.email, password: parsedLogin.password };
  } catch {
    return null;
  }
};

const CredentialRow = ({ label, value }: { label: string; value: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // The visible value can still be copied manually.
    }
  };

  return (
    <div className="flex items-center justify-between rounded-lg border border-[#d9e0e8] bg-[#f7faf8] px-4 py-3">
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-500">
          {label}
        </p>
        <p className="mt-1 break-all font-mono text-sm font-semibold text-[#7a1724]">
          {value}
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="ml-3 shrink-0 text-[#4b5f78] hover:bg-[#f5efe0] hover:text-[#7a1724]"
        onClick={() => void handleCopy()}
        aria-label={`Copy ${label}`}
      >
        {copied ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4" aria-hidden="true" />
        )}
      </Button>
    </div>
  );
};

const LoginPage: React.FC = () => {
  const { login, isAuthenticated, user, error, isLoading } = useAuth();
  const [rememberedLogin] = useState(getRememberedEmployeeLogin);
  const [email, setEmail] = useState(
    rememberedLogin?.email ?? TEMP_EMPLOYEE_LOGIN.email
  );
  const [password, setPassword] = useState(
    rememberedLogin?.password ?? TEMP_EMPLOYEE_LOGIN.password
  );
  const [rememberMe, setRememberMe] = useState(rememberedLogin !== null);

  useEffect(() => {
    document.body.classList.add('no-navbar');
    return () => document.body.classList.remove('no-navbar');
  }, []);

  useEffect(() => {
    try {
      if (rememberMe) {
        window.localStorage.setItem(
          REMEMBERED_EMPLOYEE_LOGIN_KEY,
          JSON.stringify({ email, password })
        );
      } else {
        window.localStorage.removeItem(REMEMBERED_EMPLOYEE_LOGIN_KEY);
      }
    } catch {
      // Login still works if browser storage is unavailable.
    }
  }, [email, password, rememberMe]);

  if (isAuthenticated && user) {
    if (user.role === UserRole.ADMIN && user.isRegisterComplete !== true) {
      return <Navigate to="/dashboard/admin/register-company" replace />;
    }
    if (user.role === UserRole.JOB_SEEKER) {
      return <Navigate to={getJobSeekerProfilePath(user)} replace />;
    }
    if (user.role === UserRole.EMPLOYEE) {
      return <Navigate to="/dashboard/employer" replace />;
    }
    return <Navigate to={getRoleDashboardPath(user.role)} replace />;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await login({
        ...TEMP_EMPLOYEE_LOGIN,
        email,
        password,
        rememberMe,
      });
    } catch {
      // The authentication context displays the error below.
    }
  };

  return (
    <main className="min-h-[100dvh] bg-[#f7f3e8] text-slate-900">
      <div className="grid min-h-[100dvh] lg:grid-cols-[1.05fr_.95fr]">
        <section className="relative hidden min-h-[100dvh] overflow-hidden bg-[#7a1724] text-white lg:flex lg:flex-col">
          <img
            src="https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=82&w=1400"
            alt="KD Public School campus"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#3f0c14]/88 via-[#7a1724]/78 to-[#4f111a]/96"
            aria-hidden="true"
          />

          <div className="relative z-10 flex h-full min-h-[100dvh] flex-col px-10 py-9 xl:px-16 xl:py-12">
            <Link
              to="/"
              className="inline-flex w-fit items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d4a62f]"
            >
              <SchoolBrand inverse large />
            </Link>

            <div className="my-auto max-w-xl py-12">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#d4a62f]">
                School portal
              </p>
              <h1 className="mt-4 max-w-lg text-4xl font-bold leading-tight xl:text-5xl">
                Your school day, all in one place.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-white/75">
                Sign in to view notices, attendance, school documents and the
                updates that matter to your family.
              </p>

              <div className="mt-9 grid gap-4 sm:grid-cols-3">
                {[
                  { icon: BookOpen, label: 'Learning updates' },
                  { icon: GraduationCap, label: 'School records' },
                  { icon: ShieldCheck, label: 'Secure access' },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="border border-[#d4a62f]/35 bg-[#4f111a]/35 p-4 backdrop-blur-sm"
                  >
                    <Icon
                      className="h-5 w-5 text-[#d4a62f]"
                      aria-hidden="true"
                    />
                    <p className="mt-3 text-sm font-semibold">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm text-white/60">
              Need help?{' '}
              <a
                href="mailto:hello@kdpublicschool.edu"
                className="font-semibold text-white hover:text-[#d4a62f]"
              >
                Contact the school office
              </a>
            </p>
          </div>
        </section>

        <section className="flex min-h-[100dvh] items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(212,166,47,.18),transparent_35%)] px-5 py-8 sm:px-8 lg:px-12">
          <div className="w-full max-w-lg">
            <div className="mb-7 flex items-center justify-between lg:hidden">
              <Link to="/" className="flex items-center gap-3 text-[#071f3d]">
                <SchoolBrand large />
              </Link>
            </div>

            <div className="relative overflow-hidden rounded-[1.75rem] border border-[#d4a62f]/40 bg-white/95 p-6 shadow-[0_22px_65px_rgba(122,23,36,.14)] sm:p-9">
              <div
                className="absolute inset-x-0 top-0 h-1 bg-[#d4a62f]"
                aria-hidden="true"
              />
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#4b5f78] transition-colors hover:text-[#7a1724]"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to school website
              </Link>

              <div className="mt-7">
                <p className="text-xs font-bold uppercase tracking-[.16em] text-[#7a1724]">
                  Parent and staff access
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#7a1724]">
                  Welcome back
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Enter your school account details to continue.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                {error && (
                  <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}

                <div className="space-y-5 [&_input]:!h-12 [&_input]:!rounded-lg [&_input]:!border-[#d9c3c7] [&_input]:!bg-white [&_input]:!px-4 [&_input]:focus:!border-[#7a1724] [&_label]:!font-semibold [&_label]:!text-[#7a1724]">
                  <FormField
                    label="Email address"
                    type="email"
                    name="login-email"
                    value={email}
                    onChange={setEmail}
                    placeholder="name@kdpublicschool.edu"
                    required
                  />
                  <FormField
                    label="Password"
                    type="password"
                    name="login-password"
                    value={password}
                    onChange={setPassword}
                    placeholder="Enter your password"
                    required
                    minLength={6}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <FormField
                    type="checkbox"
                    label="Remember me"
                    name="remember-employee-login"
                    value={rememberMe}
                    onCheckboxChange={setRememberMe}
                  />
                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-[#7a1724] hover:text-[#5b101a]"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  isLoading={isLoading}
                  className="h-12 w-full rounded-lg bg-[#7a1724] text-base font-bold text-white hover:bg-[#5b101a]"
                >
                  Log in to portal
                </Button>
              </form>

              <div className="mt-7 border-t border-slate-200 pt-6">
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-[#7a1724]">
                    Test access
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Temporary credentials for development and review.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <CredentialRow
                    label="Email"
                    value="staff@kdpublicschool.edu"
                  />
                  <CredentialRow label="Password" value="password123" />
                </div>
              </div>
            </div>

            <p className="mt-5 text-center text-xs text-slate-500">
              © 2026 KD Public School · Secure school portal
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
