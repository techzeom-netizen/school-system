import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AccountCard from '../components/Profile/AccountCard';
import CommunicationCard from '../components/Profile/CommunicationCard';
import OnlinePresenceCard from '../components/Profile/OnlinePresenceCard';
import PersonalDetailsCard from '../components/Profile/PersonalDetailsCard';
import PrivacyCard from '../components/Profile/PrivacyCard';
import ProfileHeader from '../components/Profile/ProfileHeader';
import {
  ProfileActivityCard,
  ProfileChecklistCard,
} from '../components/Profile/ProfileSideCards';
import SecurityCard from '../components/Profile/SecurityCard';
import {
  getMonthsSince,
  initialContactPreferences,
  initialLastUpdated,
  initialOnlineLinks,
  initialPersonalDetails,
  initialPrivacySettings,
  initialSecuritySettings,
  type ContactPreferences,
  type OnlineLinks,
  type PersonalDetails,
  type PrivacySettings,
  type SecuritySettings,
} from '../data/profile';

const ProfilePage = () => {
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>(
    initialPersonalDetails
  );
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [onlineLinks, setOnlineLinks] =
    useState<OnlineLinks>(initialOnlineLinks);
  const [photoUrl, setPhotoUrl] = useState('');
  const [contactPreferences, setContactPreferences] =
    useState<ContactPreferences>(initialContactPreferences);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(
    initialPrivacySettings
  );
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(
    initialSecuritySettings
  );
  const [lastUpdated, setLastUpdated] = useState(initialLastUpdated);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  const touch = () => setLastUpdated(new Date());

  const handlePhotoChange = (file: File | null) => {
    setPhotoUrl(current => {
      if (current) URL.revokeObjectURL(current);
      return file ? URL.createObjectURL(file) : '';
    });
    touch();
  };

  const checklist = useMemo(
    () => [
      { key: 'photo', label: 'Add a profile photo', done: Boolean(photoUrl) },
      {
        key: 'personal',
        label: 'Complete personal details',
        done: Boolean(
          personalDetails.dateOfBirth &&
            personalDetails.gender &&
            personalDetails.currentLocation
        ),
      },
      {
        key: 'mobile',
        label: 'Verify mobile number',
        done: personalDetails.mobileVerified,
      },
      {
        key: 'email',
        label: 'Verify email',
        done: personalDetails.emailVerified,
      },
      {
        key: 'links',
        label: 'Add an online link',
        done: Object.values(onlineLinks).some(Boolean),
      },
      {
        key: 'contact',
        label: 'Choose how recruiters reach you',
        done:
          contactPreferences.allowRecruiters &&
          contactPreferences.methods.length > 0,
      },
      {
        key: 'security',
        label: 'Turn on two-step verification',
        done: securitySettings.twoStep,
      },
    ],
    [
      contactPreferences.allowRecruiters,
      contactPreferences.methods.length,
      onlineLinks,
      personalDetails.currentLocation,
      personalDetails.dateOfBirth,
      personalDetails.emailVerified,
      personalDetails.gender,
      personalDetails.mobileVerified,
      photoUrl,
      securitySettings.twoStep,
    ]
  );

  const strengthPercent = Math.round(
    (checklist.filter(item => item.done).length / checklist.length) * 100
  );
  const monthsOld = getMonthsSince(lastUpdated);
  const showStaleBanner = monthsOld > 3 && !bannerDismissed;

  return (
    <section className="bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-[1560px] px-4 py-6 lg:px-8">
        {notice && (
          <div
            role="status"
            className="mb-4 flex items-start justify-between gap-3 rounded-t-md border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 p-4 text-sm font-medium text-blue-800 dark:text-blue-300"
          >
            <span>{notice}</span>
            <button
              type="button"
              aria-label="Dismiss notice"
              onClick={() => setNotice('')}
              className="rounded p-1 hover:bg-blue-100 dark:hover:bg-blue-900/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {showStaleBanner && (
          <div
            role="alert"
            className="mb-4 flex flex-col gap-3 rounded-t-md border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 p-4 text-sm text-amber-900 dark:text-amber-300 sm:flex-row sm:items-center sm:justify-between"
          >
            <p>
              Your profile details were last updated {monthsOld} months ago.
              Check that your contact information is still correct.
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                className="rounded-none bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => setDetailsOpen(true)}
              >
                Review details
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Dismiss stale profile alert"
                onClick={() => setBannerDismissed(true)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <ProfileHeader
          details={personalDetails}
          photoUrl={photoUrl}
          strengthPercent={strengthPercent}
          lastUpdated={lastUpdated}
          onPhotoChange={handlePhotoChange}
          onVerifyEmail={() => {
            setPersonalDetails(current => ({
              ...current,
              emailVerified: true,
            }));
            touch();
          }}
          onVerifyPhone={() => {
            setPersonalDetails(current => ({
              ...current,
              mobileVerified: true,
            }));
            touch();
          }}
          onEdit={() => setDetailsOpen(true)}
          onNotify={setNotice}
        />

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <main className="space-y-4">
            <PersonalDetailsCard
              details={personalDetails}
              open={detailsOpen}
              onOpenChange={setDetailsOpen}
              onSave={details => {
                setPersonalDetails(details);
                touch();
              }}
            />
            <OnlinePresenceCard
              links={onlineLinks}
              onSave={links => {
                setOnlineLinks(links);
                touch();
              }}
            />
            <CommunicationCard
              preferences={contactPreferences}
              onChange={preferences => {
                setContactPreferences(preferences);
                touch();
              }}
            />
            <PrivacyCard
              settings={privacySettings}
              employerName={personalDetails.company}
              onChange={settings => {
                setPrivacySettings(settings);
                touch();
              }}
            />
            <SecurityCard
              settings={securitySettings}
              onChange={settings => {
                setSecuritySettings(settings);
                touch();
              }}
              onNotify={setNotice}
            />
            <AccountCard onNotify={setNotice} />
          </main>

          <aside className="space-y-4">
            <ProfileChecklistCard percent={strengthPercent} items={checklist} />
            <ProfileActivityCard />
          </aside>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
