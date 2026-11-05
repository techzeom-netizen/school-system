import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  CalendarDays,
  Check,
  Clock,
  Copy,
  FileText,
  UserRound,
} from 'lucide-react';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { getRoleDashboardPath } from '@/utils/roleUtils';
import { getJobSeekerProfilePath } from '@/features/jobseekers/config/jobSeekerNavigation';
import { LoginCredentials, UserRole } from '@/types';

const logoSrc = '/frontendImages/LOGO.png';

// TODO: Remove this temporary Employee login once the Employee API is enabled.
const TEMP_EMPLOYEE_LOGIN: LoginCredentials = {
  email: 'staff@demo-school.edu',
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

    return {
      email: parsedLogin.email,
      password: parsedLogin.password,
    };
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
      // The value remains visible and can still be selected manually.
    }
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-colors hover:bg-slate-100">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          {label}
        </p>
        <p className="mt-0.5 break-all font-mono text-sm font-medium text-slate-800">
          {value}
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="ml-3 shrink-0 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
        onClick={() => void handleCopy()}
        aria-label={`Copy ${label}`}
        title={`Copy ${label}`}
      >
        {copied ? (
          <Check className="h-5 w-5 text-emerald-600" aria-hidden="true" />
        ) : (
          <Copy className="h-5 w-5" aria-hidden="true" />
        )}
      </Button>
    </div>
  );
};

const HrmsLaptopIllustration = () => (
  <svg
    viewBox="0 0 560 310"
    role="img"
    aria-label="School portal dashboard displayed on a laptop"
    className="h-auto w-full"
  >
    <defs>
      <linearGradient id="laptop-frame" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1685f5" />
        <stop offset="100%" stopColor="#0057d9" />
      </linearGradient>
      <linearGradient id="laptop-base" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#d9f2ff" />
        <stop offset="100%" stopColor="#74c9f2" />
      </linearGradient>
      <linearGradient id="illustration-blob" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#20b5e8" stopOpacity="0.42" />
        <stop offset="100%" stopColor="#08c875" stopOpacity="0.18" />
      </linearGradient>
      <filter id="laptop-shadow" x="-20%" y="-20%" width="140%" height="160%">
        <feDropShadow
          dx="0"
          dy="12"
          stdDeviation="10"
          floodColor="#111b63"
          floodOpacity="0.3"
        />
      </filter>
      <filter id="floating-shadow" x="-30%" y="-30%" width="160%" height="170%">
        <feDropShadow
          dx="0"
          dy="7"
          stdDeviation="6"
          floodColor="#1d256f"
          floodOpacity="0.28"
        />
      </filter>
    </defs>

    <path
      d="M28 224C70 178 130 177 191 147C261 112 312 77 373 94C427 109 453 159 497 183C528 201 539 229 511 251C469 284 395 265 330 269C236 275 168 303 86 281C38 268 7 247 28 224Z"
      fill="url(#illustration-blob)"
    />

    <g filter="url(#laptop-shadow)">
      <rect x="72" y="36" width="356" height="224" rx="19" fill="#052b7d" />
      <rect
        x="82"
        y="46"
        width="336"
        height="204"
        rx="12"
        fill="url(#laptop-frame)"
      />
      <rect x="94" y="58" width="312" height="180" rx="8" fill="#f7faff" />

      <circle cx="108" cy="70" r="3" fill="#5b8def" />
      <circle cx="119" cy="70" r="3" fill="#8fb1ff" />
      <circle cx="130" cy="70" r="3" fill="#c7d9ff" />
      <rect x="335" y="67" width="52" height="6" rx="3" fill="#dbe7ff" />

      <g>
        <rect x="108" y="86" width="282" height="41" rx="9" fill="#ffffff" />
        <rect x="118" y="94" width="31" height="25" rx="7" fill="#dbe7ff" />
        <circle cx="133.5" cy="102" r="5.5" fill="#0067e8" />
        <path
          d="M124 117C125 110 129 107 133.5 107C138 107 142 110 143 117"
          fill="#0067e8"
        />
        <rect x="162" y="96" width="112" height="7" rx="3.5" fill="#a9c3ff" />
        <rect x="162" y="109" width="76" height="6" rx="3" fill="#e5edff" />
        <circle cx="369" cy="106" r="7" fill="#d7f4e5" />
        <path
          d="M365.5 106L368 108.5L372.5 103.5"
          fill="none"
          stroke="#31ad74"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <g>
        <rect x="108" y="134" width="282" height="41" rx="9" fill="#ffffff" />
        <rect x="118" y="142" width="31" height="25" rx="7" fill="#dbe7ff" />
        <circle cx="133.5" cy="150" r="5.5" fill="#0787e5" />
        <path
          d="M124 165C125 158 129 155 133.5 155C138 155 142 158 143 165"
          fill="#0787e5"
        />
        <rect x="162" y="144" width="96" height="7" rx="3.5" fill="#a9c3ff" />
        <rect x="162" y="157" width="128" height="6" rx="3" fill="#e5edff" />
        <rect x="342" y="145" width="38" height="17" rx="8.5" fill="#eff5ff" />
        <circle cx="351" cy="153.5" r="4.5" fill="#08c875" />
      </g>

      <g>
        <rect x="108" y="182" width="282" height="41" rx="9" fill="#ffffff" />
        <rect x="118" y="190" width="31" height="25" rx="7" fill="#dbe7ff" />
        <circle cx="133.5" cy="198" r="5.5" fill="#004fd6" />
        <path
          d="M124 213C125 206 129 203 133.5 203C138 203 142 206 143 213"
          fill="#004fd6"
        />
        <rect x="162" y="192" width="126" height="7" rx="3.5" fill="#a9c3ff" />
        <rect x="162" y="205" width="89" height="6" rx="3" fill="#e5edff" />
        <rect x="337" y="193" width="43" height="17" rx="8.5" fill="#e8f0ff" />
        <rect x="345" y="199" width="27" height="5" rx="2.5" fill="#3b82f6" />
      </g>

      <circle cx="250" cy="42" r="3" fill="#00a7d8" />
      <path
        d="M48 260H452L438 276C435 280 429 282 423 282H77C71 282 65 280 62 276L48 260Z"
        fill="url(#laptop-base)"
      />
      <path
        d="M202 260H298L291 268H209L202 260Z"
        fill="#3b82f6"
        opacity="0.55"
      />
    </g>

    <g filter="url(#floating-shadow)">
      <circle
        cx="365"
        cy="198"
        r="31"
        fill="#f7faff"
        stroke="#052b7d"
        strokeWidth="7"
      />
      <circle cx="365" cy="198" r="20" fill="#dbe7ff" opacity="0.78" />
      <path
        d="M388 221L414 247"
        stroke="#052b7d"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M389 222L412 245"
        stroke="#008ee0"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>

    <g filter="url(#floating-shadow)">
      <rect x="426" y="164" width="76" height="62" rx="13" fill="#008fdc" />
      <path
        d="M450 164V156C450 151 454 148 459 148H469C474 148 478 151 478 156V164"
        fill="none"
        stroke="#dbe7ff"
        strokeWidth="5"
      />
      <path d="M443 183H485V211H443V183Z" fill="#f7faff" opacity="0.94" />
      <path
        d="M443 187L464 197L485 187"
        fill="none"
        stroke="#00a7d8"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect x="459" y="194" width="10" height="7" rx="2" fill="#08c875" />
    </g>
  </svg>
);

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
      // The auth context exposes the login error in the form.
    }
  };

  return (
    <main className="relative h-[100dvh] overflow-hidden bg-[#f8faff] text-slate-950">
      <div className="grid h-full min-h-0 w-full lg:grid-cols-2">
        <section className="relative hidden h-full min-h-0 overflow-visible px-10 py-10 text-white lg:flex lg:flex-col xl:px-20 xl:py-12">
          <svg
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-[120%] max-w-none"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="employee-panel-gradient"
                x1="0"
                y1="1"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor="#06194f" />
                <stop offset="42%" stopColor="#07358f" />
                <stop offset="72%" stopColor="#0057d9" />
                <stop offset="100%" stopColor="#00a7d8" />
              </linearGradient>
              <radialGradient id="employee-panel-glow">
                <stop offset="0%" stopColor="#20b5e8" stopOpacity="0.62" />
                <stop offset="72%" stopColor="#0067e8" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#0067e8" stopOpacity="0" />
              </radialGradient>
              <linearGradient
                id="employee-curve-dark-band"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#004fd6" />
                <stop offset="48%" stopColor="#052b7d" />
                <stop offset="100%" stopColor="#008fdc" />
              </linearGradient>
              <linearGradient
                id="employee-curve-light-band"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#0067e8" />
                <stop offset="52%" stopColor="#00a7d8" />
                <stop offset="100%" stopColor="#08c875" />
              </linearGradient>
              <linearGradient
                id="employee-curve-blue-highlight"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#24c3e8" stopOpacity="0.9" />
                <stop offset="38%" stopColor="#008fdc" stopOpacity="0.45" />
                <stop offset="72%" stopColor="#008fdc" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#008fdc" stopOpacity="0" />
              </linearGradient>
              <filter
                id="employee-curve-edge-glow"
                x="-40%"
                y="-10%"
                width="180%"
                height="120%"
              >
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <clipPath id="employee-panel-clip">
                <path d="M0 0H1000C920 82 840 210 796 330C750 455 795 535 870 607C925 660 915 752 858 850C820 920 780 990 748 1060H0Z" />
              </clipPath>
            </defs>
            <path
              d="M0 0H1000C920 82 840 210 796 330C750 455 795 535 870 607C925 660 915 752 858 850C820 920 780 990 748 1060H0Z"
              fill="url(#employee-panel-gradient)"
            />
            <g clipPath="url(#employee-panel-clip)">
              <ellipse
                cx="700"
                cy="820"
                rx="470"
                ry="390"
                fill="url(#employee-panel-glow)"
              />
              <path
                d="M64 863C177 736 338 746 456 669C543 612 611 645 634 728C660 823 549 900 421 946C278 997 118 1004 64 928C48 906 47 882 64 863Z"
                fill="#00a7d8"
                opacity="0.16"
              />
              <path
                d="M1000 0C920 82 840 210 796 330C750 455 795 535 870 607C925 660 915 752 858 850C820 920 780 990 748 1060"
                fill="none"
                stroke="url(#employee-curve-dark-band)"
                strokeWidth="54"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M1000 0C920 82 840 210 796 330C750 455 795 535 870 607C925 660 915 752 858 850C820 920 780 990 748 1060"
                fill="none"
                stroke="url(#employee-curve-blue-highlight)"
                strokeWidth="1"
                strokeOpacity="0.35"
                transform="translate(-27 0)"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M1000 0C920 82 840 210 796 330C750 455 795 535 870 607C925 660 915 752 858 850C820 920 780 990 748 1060"
                fill="none"
                stroke="url(#employee-curve-light-band)"
                strokeWidth="22"
                vectorEffect="non-scaling-stroke"
              />
            </g>
            <path
              d="M1000 0C920 82 840 210 796 330C750 455 795 535 870 607C925 660 915 752 858 850C820 920 780 990 748 1060"
              fill="none"
              stroke="#bcefff"
              strokeWidth="2"
              strokeOpacity="0.96"
              filter="url(#employee-curve-edge-glow)"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <img
            src={logoSrc}
            alt="Demo School"
            className="relative h-14 w-auto max-w-[170px] rounded-md bg-white object-contain object-left xl:h-16 xl:max-w-[200px]"
          />

          <div className="relative mt-6 max-w-xl xl:mt-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-blue-50 backdrop-blur-sm">
              <UserRound className="h-4 w-4" aria-hidden="true" />
              School Portal
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight xl:text-5xl">
              Stay connected to school life
              <br />
              With Ease
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-blue-100/90 xl:text-base xl:leading-7">
              One secure place for administrators, management, teachers, staff,
              and parents to stay connected with the school community.
            </p>

            <ul className="mt-5 space-y-1.5">
              <li className="group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-white/10">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10">
                  <Clock className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-blue-50">
                  Keep attendance and daily updates in one place
                </p>
              </li>
              <li className="group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-white/10">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10">
                  <CalendarDays
                    className="h-5 w-5 text-white"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-sm font-medium text-blue-50">
                  Manage classes, leave and school requests
                </p>
              </li>
              <li className="group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-white/10">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10">
                  <FileText className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-blue-50">
                  Access notices, documents and your profile
                </p>
              </li>
            </ul>
          </div>

          <div className="relative z-10 mt-auto hidden w-full max-w-[400px] pt-2 [@media(min-height:720px)]:block">
            <HrmsLaptopIllustration />
          </div>
        </section>

        <section className="flex h- min-h-0 justify-center overflow-y-auto px-4 py-8 sm:px-8 lg:px-10 xl:px-20">
          <div className="my-auto w-full max-w-xl rounded-[2rem] border-slate-200/80 px-6 py-9 sm:px-12 sm:py-12 xl:px-14">
            <div className="text-center">
              <img
                src={logoSrc}
                alt="Demo School"
                className="hidden mx-auto h-12 w-auto max-w-[260px] object-contain"
              />
              <h2 className="mt-6 text-4xl font-bold tracking-tight text-[#111a36] sm:text-5xl">
                Welcome Back
              </h2>
              <p className="mt-3 text-base text-slate-600 sm:text-lg">
                Log in to your school account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <div className="space-y-5 [&_input]:!h-14 [&_input]:!rounded-xl [&_input]:!border-slate-300 [&_input]:!px-5 [&_input]:!text-base [&_label]:sr-only">
                <FormField
                  label="Email address"
                  type="email"
                  name="login-email"
                  value={email}
                  onChange={setEmail}
                  placeholder="Enter your email"
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

              <div className="flex items-center justify-between gap-4">
                <FormField
                  type="checkbox"
                  label="Remember me"
                  name="remember-employee-login"
                  value={rememberMe}
                  onCheckboxChange={setRememberMe}
                />
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-[#0057d9] transition-colors hover:text-[#052b7d]"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                size="lg"
                variant="default"
                isLoading={isLoading}
                className="h-14 w-full rounded-xl  text-base font-bold"
              >
                Log In
              </Button>
            </form>

            <div className="mt-8 border-t border-slate-100 pt-8">
              <div className="mb-5 flex gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-100/80 text-amber-600">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Temporary login credentials
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    For development access only. Copy each value into the form.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <CredentialRow label="Email" value="staff@demo-school.edu" />
                <CredentialRow label="Password" value="password123" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
