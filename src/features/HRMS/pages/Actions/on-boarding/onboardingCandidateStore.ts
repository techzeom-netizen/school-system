export type VerificationStatus =
  | 'Not Started'
  | 'In Progress'
  | 'Verified'
  | 'Needs Review';

export type OnboardingCandidate = {
  id: string;
  candidateId: string;
  mobile: string;
  name: string;
  email: string;
  role: string;
  department: string;
  joiningDate: string;
  education: string;
  experience: string;
  skills: string[];
  verification: Record<string, VerificationStatus>;
};

const candidates: OnboardingCandidate[] = [];

export const getOnboardingCandidates = () => [...candidates];

export const findOnboardingCandidate = (
  identifierType: 'candidateId' | 'mobile',
  identifier: string
) =>
  candidates.find(candidate => candidate[identifierType] === identifier.trim());

export const saveOnboardingCandidate = (
  candidate: OnboardingCandidate
): void => {
  const existingIndex = candidates.findIndex(
    saved =>
      (candidate.candidateId && saved.candidateId === candidate.candidateId) ||
      (candidate.mobile && saved.mobile === candidate.mobile)
  );

  if (existingIndex === -1) {
    candidates.unshift(candidate);
  } else {
    candidates[existingIndex] = {
      ...candidate,
      id: candidates[existingIndex].id,
    };
  }
};
