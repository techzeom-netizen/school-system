import { Link } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CandidateProfileView from '../components/MyProfile/CandidateProfileView';
import { mockProfile } from '../data/myProfile';

const MyProfilePage = () => {
  const profile = mockProfile;
  const shareUrl =
    typeof window === 'undefined'
      ? `/candidates/${profile.id}`
      : `${window.location.origin}/candidates/${profile.id}`;

  return (
    <section className="bg-slate-50 dark:bg-[#0c1321]">
      <div className="mx-auto w-full max-w-[1560px] px-4 py-6 lg:px-8">
        <CandidateProfileView
          profile={profile}
          mode="candidate"
          shareUrl={shareUrl}
          editAction={
            <Button
              asChild
              variant="outline"
              className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
            >
              <Link to="/jobseekers/resume">
                <Pencil className="mr-2 h-4 w-4" />
                Edit profile
              </Link>
            </Button>
          }
        />
      </div>
    </section>
  );
};

export default MyProfilePage;
