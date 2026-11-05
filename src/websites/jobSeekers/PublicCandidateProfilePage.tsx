import { useParams } from 'react-router-dom';
import CandidateProfileView from '@/features/jobseekers/components/MyProfile/CandidateProfileView';
import { mockProfile } from '@/features/jobseekers/data/myProfile';

const PublicCandidateProfilePage = () => {
  const { candidateId } = useParams();
  const profile = {
    ...mockProfile,
    id: candidateId || mockProfile.id,
  };

  return (
    <section className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-[1560px] px-4 py-6 lg:px-8">
        <CandidateProfileView
          profile={profile}
          mode="recruiter"
          contactRevealed={false}
        />
      </div>
    </section>
  );
};

export default PublicCandidateProfilePage;
