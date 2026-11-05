import { Route } from 'react-router-dom';
import AppliedJobDescription from '../components/AppliedJobDescription';
import AppliedJobsPage from '../pages/AppliedJobsPage';
import FindCompanies from '../pages/FindCompanies';
import FollowedCompanies from '../pages/FollowedCompanies';
import JobDetailPage from '../pages/JobDetailPage';
import JobSeekerHomePage from '../pages/JobSeekerHomePage';
import MyProfilePage from '../pages/MyProfilePage';
import NotificationsPage from '../pages/NotificationsPage';
import ProfilePage from '../pages/ProfilePage';
import ResumePage from '../pages/ResumePage';
import SavedJobsPage from '../pages/SavedJobsPage';

export const jobSeekerRoutes = (
  <>
    <Route index element={<JobSeekerHomePage />} />
    <Route path="companies" element={<FindCompanies />} />
    <Route path="companies/:companyId" element={<FindCompanies />} />
    <Route path="followed-companies" element={<FollowedCompanies />} />
    <Route path="my-profile" element={<MyProfilePage />} />
    <Route path="notifications" element={<NotificationsPage />} />
    <Route path="profile" element={<ProfilePage />} />
    <Route path="resume" element={<ResumePage />} />
    <Route path="saved-jobs" element={<SavedJobsPage />} />
    <Route path="applied-jobs" element={<AppliedJobsPage />} />
    <Route path="applied-jobs/:jobId" element={<AppliedJobDescription />} />
    <Route path="jobs/:jobId" element={<JobDetailPage />} />
    <Route path=":seekerSlug" element={<JobSeekerHomePage />} />
  </>
);

export default jobSeekerRoutes;
