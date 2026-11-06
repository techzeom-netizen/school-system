import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  ClipboardCheck,
  Copy,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { LoginForm } from '@/components/auth';
import SchoolBrand from '@/components/common/SchoolBrand';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { getRoleDashboardPath } from '@/utils/roleUtils';
import { LoginCredentials } from '@/types';

const TEMP_SUPER_ADMIN_CREDENTIALS = {
  email: 'superadmin@kdpublicschool.edu',
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
      // The visible credentials can still be copied manually.
    }
  };

  return (
    <main className="min-h-[100dvh] bg-[#f7f3e8] text-slate-900">
      <div className="grid min-h-[100dvh] lg:grid-cols-[1.05fr_.95fr]">
        <section className="relative hidden min-h-[100dvh] overflow-hidden bg-[#7a1724] text-white lg:flex lg:flex-col">
          <img
            src="https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=82&w=1400"
            alt="KD Public School administration building"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-br from-[#3f0c14]/94 via-[#7a1724]/84 to-[#4f111a]/96"
            aria-hidden="true"
          />

          <div className="relative z-10 flex min-h-[100dvh] flex-col px-10 py-9 xl:px-16 xl:py-12">
            <Link
              to="/"
              className="w-fit focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d4a62f]"
            >
              <SchoolBrand inverse large />
            </Link>

            <div className="my-auto max-w-xl py-12">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#d4a62f]">
                School administration
              </p>
              <h1 className="mt-4 max-w-lg text-4xl font-bold leading-tight xl:text-5xl">
                Manage the school with clarity and confidence.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-white/75">
                Secure access for authorised administrators to oversee people,
                operations, records and school-wide settings.
              </p>

              <div className="mt-9 grid gap-4 sm:grid-cols-3">
                {[
                  { icon: Users, label: 'People and roles' },
                  { icon: ClipboardCheck, label: 'School operations' },
                  { icon: ShieldCheck, label: 'Protected access' },
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

            <div className="flex items-center gap-2 text-sm text-white/60">
              <LockKeyhole className="h-4 w-4" aria-hidden="true" />
              Authorised school administrators only
            </div>
          </div>
        </section>

        <section className="flex min-h-[100dvh] items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(212,166,47,.18),transparent_35%)] px-5 py-8 sm:px-8 lg:px-12">
          <div className="w-full max-w-lg">
            <div className="mb-7 lg:hidden">
              <Link to="/" aria-label="Return to KD Public School homepage">
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
                <div className="inline-flex items-center gap-2 rounded-full bg-[#f5efe0] px-3 py-1.5 text-xs font-bold uppercase tracking-[.12em] text-[#7a1724]">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  Administration portal
                </div>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#7a1724]">
                  Administrator sign in
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Use your authorised school administration account.
                </p>
              </div>

              <div className="mt-7 [&_form]:!space-y-5 [&_input]:!h-12 [&_input]:!rounded-lg [&_input]:!border-[#d9c3c7] [&_input]:!bg-white [&_input]:!px-4 [&_input]:focus:!border-[#7a1724] [&_label]:!font-semibold [&_label]:!text-[#7a1724] [&_button[type=submit]]:!h-12 [&_button[type=submit]]:!rounded-lg [&_button[type=submit]]:!bg-[#7a1724] [&_button[type=submit]]:!font-bold [&_button[type=submit]]:!text-white [&_button[type=submit]]:hover:!bg-[#5b101a]">
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
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fff3d2] text-[#9d6917]">
                    <KeyRound className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[#7a1724]">
                      Test administration access
                    </h3>
                    <p className="mt-0.5 text-xs leading-5 text-slate-500">
                      Temporary credentials for development and review.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    Object.entries(TEMP_SUPER_ADMIN_CREDENTIALS) as [
                      CredentialKey,
                      string,
                    ][]
                  ).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center gap-2 rounded-lg border border-[#d9e0e8] bg-[#f7faf8] px-3 py-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-500">
                          {key}
                        </p>
                        <p className="mt-1 truncate font-mono text-xs font-semibold text-[#7a1724]">
                          {value}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => copyCredential(key)}
                        className="shrink-0 text-[#4b5f78] hover:bg-[#f5efe0] hover:text-[#7a1724]"
                        aria-label={`Copy ${key}`}
                      >
                        {copiedCredential === key ? (
                          <Check className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Copy className="h-4 w-4" aria-hidden="true" />
                        )}
                      </Button>
                    </div>
                  ))}
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
