import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Briefcase,
  Camera,
  CheckCircle2,
  Clock,
  ImagePlus,
  IndianRupee,
  Lightbulb,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldAlert,
  Trash2,
  Upload,
  type LucideIcon,
} from 'lucide-react';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  formatDate,
  formatSalary,
  type PersonalDetails,
} from '../../data/profile';

const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
const MAX_COVER_BYTES = 5 * 1024 * 1024;

const RING_RADIUS = 28;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

type ProfileHeaderProps = {
  details: PersonalDetails;
  photoUrl: string;
  coverUrl?: string;
  strengthPercent: number;
  lastUpdated: Date;
  onPhotoChange: (file: File | null) => void;
  onCoverChange?: (file: File | null) => void;
  onVerifyEmail: () => void;
  onVerifyPhone: () => void;
  onEdit: () => void;
  onNotify: (message: string) => void;
};

type MenuAction = {
  label: string;
  icon: LucideIcon;
  onSelect: () => void;
  danger?: boolean;
};

type ImageMenuProps = {
  label: string;
  actions: MenuAction[];
  hint?: string;
  align?: 'left' | 'right';
  triggerClassName: string;
  children: ReactNode;
};

const ImageMenu = ({
  label,
  actions,
  hint,
  align = 'left',
  triggerClassName,
  children,
}: ImageMenuProps) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleMouseDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(current => !current)}
        className={triggerClassName}
      >
        {children}
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute z-30 mt-2 w-56 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1.5 shadow-xl ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {actions.map(action => {
            const Icon = action.icon;

            return (
              <button
                key={action.label}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  action.onSelect();
                }}
                className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                  action.danger
                    ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                {action.label}
              </button>
            );
          })}

          {hint && (
            <p className="mt-1 border-t border-slate-100 dark:border-slate-800 px-3 pb-1 pt-2 text-[11px] leading-4 text-slate-400">
              {hint}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const VerifyBadge = ({
  verified,
  label,
  onVerify,
}: {
  verified: boolean;
  label: string;
  onVerify: () => void;
}) =>
  verified ? (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 px-2.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
      <CheckCircle2 className="h-3.5 w-3.5" />
      {label} verified
    </span>
  ) : (
    <button
      type="button"
      onClick={onVerify}
      className="inline-flex h-7 items-center gap-1.5 rounded-md bg-amber-50 dark:bg-amber-950/40 px-2.5 text-xs font-medium text-amber-700 dark:text-amber-400 transition-colors hover:bg-amber-100 dark:hover:bg-amber-900/40"
    >
      <ShieldAlert className="h-3.5 w-3.5" />
      Verify {label.toLowerCase()}
    </button>
  );

const ProfileHeader = ({
  details,
  photoUrl,
  coverUrl,
  strengthPercent,
  lastUpdated,
  onPhotoChange,
  onCoverChange,
  onVerifyEmail,
  onVerifyPhone,
  onEdit,
  onNotify,
}: ProfileHeaderProps) => {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [localCover, setLocalCover] = useState('');
  const localCoverRef = useRef('');
  const [coverFailed, setCoverFailed] = useState(false);
  const [verificationTarget, setVerificationTarget] = useState<
    'email' | 'phone' | null
  >(null);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const isControlled = typeof onCoverChange === 'function';

  const customCover = isControlled ? (coverUrl ?? '') : localCover;

  const shownCover = customCover || DEFAULT_COVER;

  useEffect(() => {
    setCoverFailed(false);
  }, [shownCover]);

  useEffect(
    () => () => {
      if (localCoverRef.current) {
        URL.revokeObjectURL(localCoverRef.current);
      }
    },
    []
  );

  const initials =
    details.fullName
      .split(' ')
      .filter(Boolean)
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?';

  const normalizedStrength = Math.min(100, Math.max(0, strengthPercent));

  const strokeDashoffset =
    RING_CIRCUMFERENCE - (normalizedStrength / 100) * RING_CIRCUMFERENCE;

  const ringTone =
    normalizedStrength >= 80
      ? 'text-emerald-500 dark:text-emerald-400'
      : normalizedStrength >= 50
        ? 'text-blue-600 dark:text-blue-400'
        : 'text-amber-500 dark:text-amber-400';

  const years = Number(details.experienceYears) || 0;
  const months = Number(details.experienceMonths) || 0;

  const experience =
    years || months
      ? [
          years ? `${years} yr${years === 1 ? '' : 's'}` : '',
          months ? `${months} mo` : '',
        ]
          .filter(Boolean)
          .join(' ')
      : 'Fresher';

  const roleLine =
    details.currentRole && details.company
      ? `${details.currentRole} at ${details.company}`
      : details.currentRole || details.company || 'Add your current role';

  const openVerification = (target: 'email' | 'phone') => {
    setVerificationTarget(target);
    setOtp('');
    setOtpError('');
    onNotify(
      `OTP sent to your ${target === 'email' ? 'email address' : 'phone number'}. TODO: call API to send OTP.`
    );
  };

  const closeVerification = () => {
    setVerificationTarget(null);
    setOtp('');
    setOtpError('');
  };

  const confirmVerification = () => {
    if (!/^\d{6}$/.test(otp)) {
      setOtpError('Enter the 6 digit OTP.');
      return;
    }

    if (verificationTarget === 'email') {
      onVerifyEmail();
      onNotify(
        'Email verified successfully. TODO: call API to verify email OTP.'
      );
    }

    if (verificationTarget === 'phone') {
      onVerifyPhone();
      onNotify(
        'Phone verified successfully. TODO: call API to verify phone OTP.'
      );
    }

    closeVerification();
  };

  const verificationLabel =
    verificationTarget === 'email' ? 'email address' : 'phone number';
  const verificationDestination =
    verificationTarget === 'email' ? details.email : `+91 ${details.mobile}`;

  const nextStep = !details.mobileVerified
    ? {
        text: 'Verify your phone number so recruiters can reach you.',
        action: 'Verify phone',
        onClick: () => openVerification('phone'),
      }
    : !details.emailVerified
      ? {
          text: 'Verify your email so recruiters can reach you.',
          action: 'Verify email',
          onClick: () => openVerification('email'),
        }
      : !photoUrl
        ? {
            text: 'Add a profile photo to make your profile more complete.',
            action: 'Add photo',
            onClick: () => photoInputRef.current?.click(),
          }
        : null;

  const validateImage = (file: File, maxBytes: number, noun: string) => {
    if (!IMAGE_TYPES.includes(file.type)) {
      onNotify(`Upload a JPG, PNG, or WebP ${noun}.`);
      return false;
    }

    if (file.size > maxBytes) {
      onNotify(
        `${noun[0].toUpperCase()}${noun.slice(
          1
        )} must be ${maxBytes / 1024 / 1024} MB or smaller.`
      );

      return false;
    }

    return true;
  };

  const handlePhotoInput = (file?: File) => {
    if (!file || !validateImage(file, MAX_PHOTO_BYTES, 'profile photo')) {
      return;
    }

    onPhotoChange(file);
  };

  const applyCover = (file: File | null) => {
    if (isControlled) {
      onCoverChange?.(file);
      return;
    }

    if (localCoverRef.current) {
      URL.revokeObjectURL(localCoverRef.current);
    }

    const next = file ? URL.createObjectURL(file) : '';

    localCoverRef.current = next;
    setLocalCover(next);
  };

  const handleCoverInput = (file?: File) => {
    if (!file || !validateImage(file, MAX_COVER_BYTES, 'cover photo')) {
      return;
    }

    applyCover(file);
  };

  const coverActions: MenuAction[] = [
    {
      label: 'Upload new cover',
      icon: Upload,
      onSelect: () => coverInputRef.current?.click(),
    },
    ...(customCover
      ? [
          {
            label: 'Reset to default cover',
            icon: Trash2,
            danger: true,
            onSelect: () => applyCover(null),
          },
        ]
      : []),
  ];

  const photoActions: MenuAction[] = [
    {
      label: photoUrl ? 'Change photo' : 'Upload photo',
      icon: Upload,
      onSelect: () => photoInputRef.current?.click(),
    },
    ...(photoUrl
      ? [
          {
            label: 'Remove photo',
            icon: Trash2,
            danger: true,
            onSelect: () => onPhotoChange(null),
          },
        ]
      : []),
  ];

  return (
    <section className="overflow-visible rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
      {/* Cover */}
      <div className="relative h-56 overflow-hidden rounded-t-lg bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500">
        {!coverFailed && (
          <img
            src={shownCover}
            alt=""
            onError={() => setCoverFailed(true)}
            className="h-full w-full object-cover"
          />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/5" />

        <div className="absolute right-3 top-3">
          <ImageMenu
            label="Edit cover photo"
            align="right"
            actions={coverActions}
            hint="JPG, PNG or WebP. Maximum 5 MB."
            triggerClassName="inline-flex h-8 items-center gap-1.5 rounded-md border border-white/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-900/90 px-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm backdrop-blur transition hover:bg-white dark:hover:bg-slate-900"
          >
            <ImagePlus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Edit cover</span>
          </ImageMenu>
        </div>
      </div>

      {/* Main */}
      <div className="relative px-4 pb-4 sm:px-5">
        {/* Main profile row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:gap-4">
          {/* Avatar */}
          <div className="-mt-16 shrink-0 sm:-mt-[74px]">
            <div className="relative h-32 w-32 md:h-[150px] md:w-[150px] lg:h-44 lg:w-44">
              <div className="h-full w-full overflow-hidden rounded-xl border-[5px] border-white dark:border-slate-700 bg-white dark:bg-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.16)] ring-1 ring-slate-200 dark:ring-slate-700">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={details.fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-blue-50 dark:bg-blue-950/40 text-2xl font-bold text-blue-700 dark:text-blue-400 sm:text-3xl">
                    {initials}
                  </div>
                )}
              </div>

              <div className="absolute bottom-0 right-0">
                <ImageMenu
                  label="Edit profile photo"
                  actions={photoActions}
                  hint="JPG, PNG or WebP. Maximum 2 MB."
                  triggerClassName="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white dark:border-slate-700 bg-blue-600 text-white shadow-md transition hover:bg-blue-700"
                >
                  <Camera className="h-3.5 w-3.5" />
                </ImageMenu>
              </div>
            </div>
          </div>

          {/* User info */}
          <div className="mt-2 min-w-0 flex-1 sm:mb-1 sm:mt-0">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <h1 className="truncate text-xl font-bold leading-tight text-slate-950 dark:text-slate-100 sm:text-2xl">
                  {details.fullName}
                </h1>

                <p className="mt-0.5 truncate text-sm font-medium text-slate-500 dark:text-slate-400">
                  {roleLine}
                </p>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-3">
                {/* Profile strength */}
                <div className="flex items-center gap-2">
                  <div
                    role="progressbar"
                    aria-valuenow={normalizedStrength}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Profile strength"
                    className="relative h-14 w-14 shrink-0"
                  >
                    <svg
                      viewBox="0 0 64 64"
                      className="h-full w-full -rotate-90"
                    >
                      <circle
                        cx="32"
                        cy="32"
                        r={RING_RADIUS}
                        fill="none"
                        strokeWidth="5"
                        className="stroke-slate-100 dark:stroke-slate-800"
                      />

                      <circle
                        cx="32"
                        cy="32"
                        r={RING_RADIUS}
                        fill="none"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray={RING_CIRCUMFERENCE}
                        strokeDashoffset={strokeDashoffset}
                        className={`stroke-current transition-all duration-500 ${ringTone}`}
                      />
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-slate-700 dark:text-slate-200">
                      {normalizedStrength}%
                    </div>
                  </div>

                  <div className="hidden xl:block">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      Profile strength
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Keep it updated
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={onEdit}
                  className="h-9 gap-1.5 rounded-md bg-blue-600 px-3.5 text-sm font-semibold text-white shadow-none hover:bg-blue-700"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mt-3 border-t border-slate-100 dark:border-slate-800 pt-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              {details.currentLocation && (
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span>{details.currentLocation}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <Briefcase className="h-4 w-4 text-slate-400" />
                <span>{experience}</span>
              </div>

              {details.currentSalary && (
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <IndianRupee className="h-4 w-4 text-slate-400" />
                  <span>{formatSalary(details.currentSalary)}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="h-3.5 w-3.5" />
                <span>Updated {formatDate(lastUpdated)}</span>
              </div>
            </div>

            {/* Verification */}
            <div className="flex flex-wrap items-center gap-2">
              <VerifyBadge
                verified={details.emailVerified}
                label="Email"
                onVerify={() => openVerification('email')}
              />

              <VerifyBadge
                verified={details.mobileVerified}
                label="Phone"
                onVerify={() => openVerification('phone')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      {nextStep && (
        <div className="flex items-center gap-2.5 border-t border-blue-100 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/60 px-4 py-2.5 sm:px-5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
            <Lightbulb className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          </div>

          <p className="min-w-0 flex-1 text-xs text-blue-900 dark:text-blue-300 sm:text-sm">
            {nextStep.text}
          </p>

          <button
            type="button"
            onClick={nextStep.onClick}
            className="shrink-0 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline sm:text-sm"
          >
            {nextStep.action}
          </button>
        </div>
      )}

      {/* File inputs */}
      <input
        ref={coverInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-label="Upload cover photo"
        className="hidden"
        onChange={event => {
          handleCoverInput(event.target.files?.[0]);
          event.target.value = '';
        }}
      />

      <input
        ref={photoInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-label="Upload profile photo"
        className="hidden"
        onChange={event => {
          handlePhotoInput(event.target.files?.[0]);
          event.target.value = '';
        }}
      />

      <Dialog
        open={Boolean(verificationTarget)}
        onOpenChange={open => {
          if (!open) closeVerification();
        }}
      >
        <DialogContent className="w-[calc(100%-2rem)] max-w-[430px] gap-0 overflow-hidden rounded-xl border-0 bg-white dark:bg-slate-900 p-0 shadow-2xl sm:max-w-[430px]">
          <DialogHeader className="border-b border-slate-100 dark:border-slate-800 px-6 pb-4 pt-6 text-left">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400">
                {verificationTarget === 'email' ? (
                  <Mail className="h-5 w-5" />
                ) : (
                  <Phone className="h-5 w-5" />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-950 dark:text-slate-100">
                  Verify {verificationTarget === 'email' ? 'email' : 'phone'}
                </DialogTitle>
                <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                  Enter the 6 digit OTP sent to your {verificationLabel}.
                </p>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-5 px-6 py-5">
            <p className="rounded-lg border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 px-3 py-2 text-sm font-medium text-blue-900 dark:text-blue-300">
              OTP sent to {verificationDestination}
            </p>
            <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-4">
              <FormField
                label="OTP"
                name="verificationOtp"
                type="otp"
                value={otp}
                onChange={value => {
                  setOtp(value.replace(/\D/g, '').slice(0, 6));
                  setOtpError('');
                }}
                error={otpError}
              />
            </div>
            <div className="flex items-center justify-between gap-3 text-sm">
              <button
                type="button"
                className="font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                onClick={() =>
                  onNotify(
                    `OTP resent to your ${verificationLabel}. TODO: call API to resend OTP.`
                  )
                }
              >
                Resend OTP
              </button>
              <span className="text-xs text-slate-400">Code expires soon</span>
            </div>
            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 dark:border-slate-800 pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-none border-blue-200 dark:border-blue-800 px-6 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                onClick={closeVerification}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="h-10 rounded-none bg-blue-600 px-8 text-white hover:bg-blue-700"
                onClick={confirmVerification}
              >
                Verify
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ProfileHeader;
