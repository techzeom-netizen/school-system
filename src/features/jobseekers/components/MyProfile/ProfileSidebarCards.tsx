import {
  ExternalLink,
  Globe,
  Languages,
  Lock,
  Mail,
  Phone,
  SlidersHorizontal,
  UserRound,
} from 'lucide-react';
import {
  maskEmail,
  maskPhone,
  type CandidateProfile,
  type LabelValue,
} from '../../data/myProfile';
import { ProfileCard } from './ProfileCard';

const RowList = ({ rows }: { rows: LabelValue[] }) => {
  if (rows.length === 0) return null;

  return (
    <dl className="space-y-3">
      {rows.map(row => (
        <div key={row.label}>
          <dt className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            {row.label}
          </dt>
          <dd className="mt-0.5 text-sm font-medium text-slate-900 dark:text-slate-100">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
};

const ProfileSidebarCards = ({
  profile,
  contactRevealed,
}: {
  profile: CandidateProfile;
  contactRevealed: boolean;
}) => (
  <aside className="space-y-4">
    {profile.preferences.length > 0 && (
      <ProfileCard icon={SlidersHorizontal} title="Job preferences">
        <RowList rows={profile.preferences} />
      </ProfileCard>
    )}

    <ProfileCard icon={Mail} title="Contact">
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-white/10 p-3">
          <span className="inline-flex min-w-0 items-center gap-2 text-slate-600 dark:text-slate-300">
            <Mail className="h-4 w-4 shrink-0 text-blue-700 dark:text-blue-400" />
            <span className="break-all">
              {contactRevealed ? profile.email : maskEmail(profile.email)}
            </span>
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-white/10 p-3">
          <span className="inline-flex min-w-0 items-center gap-2 text-slate-600 dark:text-slate-300">
            <Phone className="h-4 w-4 shrink-0 text-blue-700 dark:text-blue-400" />
            <span>
              {contactRevealed ? profile.phone : maskPhone(profile.phone)}
            </span>
          </span>
        </div>
        {!contactRevealed && (
          <p className="inline-flex items-start gap-2 rounded-md bg-slate-50 dark:bg-slate-950 p-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Contact details are masked until the recruiter has access.
          </p>
        )}
      </div>
    </ProfileCard>

    {profile.links.length > 0 && (
      <ProfileCard icon={Globe} title="Online presence">
        <div className="space-y-2">
          {profile.links.map(link => (
            <a
              key={link.label}
              href={link.value}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 dark:border-white/10 p-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-700 dark:hover:text-blue-400"
            >
              <span>{link.label}</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          ))}
        </div>
      </ProfileCard>
    )}

    {profile.languages.length > 0 && (
      <ProfileCard icon={Languages} title="Languages">
        <RowList rows={profile.languages} />
      </ProfileCard>
    )}

    {profile.personal.length > 0 && (
      <ProfileCard icon={UserRound} title="Personal details">
        <RowList rows={profile.personal} />
      </ProfileCard>
    )}
  </aside>
);

export default ProfileSidebarCards;
