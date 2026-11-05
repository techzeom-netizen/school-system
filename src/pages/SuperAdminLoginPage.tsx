import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Check, Copy, KeyRound, LockKeyhole, ShieldCheck } from 'lucide-react';
import { LoginForm } from '@/components/auth';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { getRoleDashboardPath } from '@/utils/roleUtils';
import { LoginCredentials } from '@/types';

const logoSrc = '/frontendImages/LOGO.png';

// TODO: Remove these temporary credentials before the feature is released.
const TEMP_SUPER_ADMIN_CREDENTIALS = {
  email: 'superadmin@demo-school.edu',
  password: 'SchoolSystem@12345',
} as const;

type CredentialKey = keyof typeof TEMP_SUPER_ADMIN_CREDENTIALS;

const SuperAdminLoginPage: React.FC = () => {
  const { login, isAuthenticated, user, error, isLoading } = useAuth();
  const [copiedCredential, setCopiedCredential] =
    useState<CredentialKey | null>(null);

  useEffect(() => {
    document.body.classList.add('no-navbar');
    return () => document.body.classList.remove('no-navbar');
  }, []);

  useEffect(() => {
    if (!copiedCredential) return;

    const timeoutId = window.setTimeout(() => setCopiedCredential(null), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [copiedCredential]);

  if (isAuthenticated && user) {
    return <Navigate to={getRoleDashboardPath(user.role)} replace />;
  }

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      await login(credentials);
    } catch {
      // AuthContext exposes the API error to the form.
    }
  };

  const copyCredential = async (key: CredentialKey) => {
    try {
      await navigator.clipboard.writeText(TEMP_SUPER_ADMIN_CREDENTIALS[key]);
      setCopiedCredential(key);
    } catch {
      // The credentials remain visible so they can still be selected manually.
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07152f] px-4 py-6 sm:px-6 lg:px-8">
      <div
        className="pointer-events-none absolute -left-36 -top-36 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-48 -right-28 h-[30rem] w-[30rem] rounded-full bg-cyan-400/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-3xl border border-white/10 bg-white shadow-[0_32px_90px_rgba(0,0,0,0.35)] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#0b2250] via-[#0c3470] to-[#075985] p-12 text-white lg:flex lg:flex-col lg:justify-between">
            <div
              className="absolute -right-24 -top-20 h-72 w-72 rounded-full border border-white/10"
              aria-hidden="true"
            />
            <div
              className="absolute -right-10 -top-6 h-48 w-48 rounded-full border border-white/10"
              aria-hidden="true"
            />

            <div className="relative">
              <div className="inline-flex rounded-2xl bg-white p-3 shadow-lg shadow-slate-950/20">
                <img src={logoSrc} alt="Demo School" className="h-11 w-auto" />
              </div>
            </div>

            <div className="relative my-16">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm">
                <ShieldCheck className="h-7 w-7" aria-hidden="true" />
              </div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">
                Super Admin Portal
              </p>
              <h1 className="max-w-md text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
                Command your platform with confidence.
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-blue-100/85">
                Secure access to platform operations, account oversight, and
                system-wide administration from one place.
              </p>
            </div>

            <div className="relative flex items-center gap-3 border-t border-white/10 pt-6 text-sm text-blue-100/80">
              <LockKeyhole className="h-4 w-4" aria-hidden="true" />
              Protected administrative access
            </div>
          </div>

          <div className="flex items-center bg-white px-5 py-8 sm:px-10 sm:py-12 lg:px-16 xl:px-20">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8 lg:hidden">
                <img src={logoSrc} alt="Demo School" className="h-11 w-auto" />
              </div>

              <div className="mb-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-blue-700 lg:hidden">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  Super Admin Portal
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Welcome back
                </h2>
                <p className="mt-3 text-base leading-6 text-slate-600">
                  Enter your credentials to access the control center.
                </p>
              </div>

              <div className="[&_form]:!space-y-5 [&_input]:!h-11 [&_input]:!rounded-lg [&_input]:!border-slate-300 [&_label]:!text-sm">
                <LoginForm
                  type="Super Admin"
                  onSubmit={handleLogin}
                  error={error || undefined}
                  isLoading={isLoading}
                  initialValues={{
                    ...TEMP_SUPER_ADMIN_CREDENTIALS,
                    type: 'Super Admin',
                  }}
                />
              </div>

              <div className="mt-7 border-t border-slate-200 pt-6">
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                    <KeyRound className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Temporary login credentials
                    </h3>
                    <p className="mt-0.5 text-xs leading-5 text-slate-500">
                      For development access only. Copy each value into the
                      form.
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {(
                    Object.entries(TEMP_SUPER_ADMIN_CREDENTIALS) as [
                      CredentialKey,
                      string,
                    ][]
                  ).map(([key, value]) => {
                    const isCopied = copiedCredential === key;

                    return (
                      <div
                        key={key}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                            {key}
                          </p>
                          <p className="mt-0.5 truncate font-mono text-sm font-medium text-slate-800">
                            {value}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => copyCredential(key)}
                          className="shrink-0 text-slate-500 hover:bg-white hover:text-blue-700"
                          aria-label={`Copy ${key}`}
                          title={`Copy ${key}`}
                        >
                          {isCopied ? (
                            <Check className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SuperAdminLoginPage;
