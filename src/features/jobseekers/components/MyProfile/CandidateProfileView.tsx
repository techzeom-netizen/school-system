import { useState, type ReactNode } from 'react';
import type { CandidateProfile } from '../../data/myProfile';
import ProfileSections from './ProfileSections';
import ProfileSidebarCards from './ProfileSidebarCards';
import ProfileTopCard from './ProfileTopCard';
import ShareProfileDialog from './ShareProfileDialog';

type CandidateProfileViewProps = {
  profile: CandidateProfile;
  mode?: 'candidate' | 'recruiter';
  shareUrl?: string;
  editAction?: ReactNode;
  recruiterActions?: ReactNode;
  contactRevealed?: boolean;
  onDownloadResume?: () => void;
};

const CandidateProfileView = ({
  profile,
  mode = 'candidate',
  shareUrl,
  editAction,
  recruiterActions,
  contactRevealed = mode === 'candidate',
  onDownloadResume,
}: CandidateProfileViewProps) => {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <>
      <ProfileTopCard
        profile={profile}
        mode={mode}
        editAction={editAction}
        recruiterActions={recruiterActions}
        onDownloadResume={onDownloadResume}
        onShare={
          mode === 'candidate' && shareUrl
            ? () => setShareOpen(true)
            : undefined
        }
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <ProfileSections
          profile={profile}
          onDownloadResume={onDownloadResume}
        />
        <ProfileSidebarCards
          profile={profile}
          contactRevealed={contactRevealed}
        />
      </div>

      {mode === 'candidate' && shareUrl && (
        <ShareProfileDialog
          open={shareOpen}
          onOpenChange={setShareOpen}
          profileUrl={shareUrl}
          candidateName={profile.fullName}
        />
      )}
    </>
  );
};

export default CandidateProfileView;
