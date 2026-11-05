import { Route } from 'react-router-dom';
import {
  AttendenceCorectionReport,
  AttendenceInsights,
  AttendenceRequests,
  AttendenceSummaryReport,
  EmployeeAttendence,
  MonthlyMusterReport,
  MyAttendence,
  TimeClock,
} from '@/features/HRMS/pages/Attendence';
import {
  Form16Page,
  LeavePolicies,
  MySpacePage,
  PayrollOverview,
  PayrollReportPage,
  ReimbursementBuyoutPage,
  SalaryStructurePage,
  TaxDeclaration,
} from '@/features/HRMS';
import PayslipPage from '@/features/HRMS/pages/payrolls/PayslipPage';
import LoanAndAdvancePage from '@/features/HRMS/pages/payrolls/LoanAndAdvancePage';
import DocumentRequestsPage from '@/features/HRMS/pages/documents/DocumentRequestPage';
import CompanyDocumentsPage from '@/features/HRMS/pages/documents/CompanyDocumentsPage';
import ESignaturePage from '@/features/HRMS/pages/documents/EsignaturePage';
import TemplatesPage from '@/features/HRMS/pages/documents/TemplatesPage';
import MyLeavesPage from '@/features/HRMS/pages/LeaveAndHoliday/MyLeavesPage';
import LeaveAndHolidayCalenderPage from '@/features/HRMS/pages/LeaveAndHoliday/LeaveAndHolidayCalenderPage';
import LeaveReportPage from '@/features/HRMS/pages/LeaveAndHoliday/LeaveReportPage';
import CompanyStructure from '@/features/HRMS/pages/Directory/CompanyStructure';
import EmployeeDirectory from '@/features/HRMS/pages/Directory/EmployeeDirectory';
import OrgChart from '@/features/HRMS/pages/Directory/OrgChart';
import AttendenceSettingsPage from '@/features/HRMS/pages/menu-settings/AttendenceSettingsPage';
import LeaveSettingsPage from '@/features/HRMS/pages/menu-settings/LeaveSettingsPage';
import RegularizationSettingsPage from '@/features/HRMS/pages/menu-settings/RegularizationSettingsPage';
import ActionSettingsPage from '@/features/HRMS/pages/menu-settings/ActionSettingsPage';
import ProfileSettingsPage from '@/features/HRMS/pages/menu-settings/ProfileSettingsPage';
import DocumentSettingsPage from '@/features/HRMS/pages/menu-settings/DocumentSettingsPage';
import AssetsSettingsPage from '@/features/HRMS/pages/menu-settings/AssetsSettingsPage';
import ShiftSettingsPage from '@/features/HRMS/pages/menu-settings/ShiftSettingsPage';
import HelpdeskSettingsPage from '@/features/HRMS/pages/menu-settings/HelpdeskSettingsPage';
import CalibrationandIncrement from '@/features/HRMS/pages/Performance-Growth/CalibrationandIncrement';
import Feedback from '@/features/HRMS/pages/Performance-Growth/Feedback';
import TalentandSuccession from '@/features/HRMS/pages/Performance-Growth/TalentandSuccession';
import OneonOneNotes from '@/features/HRMS/pages/Performance-Growth/OneonOneNotes';
import PerformanceReview from '@/features/HRMS/pages/Performance-Growth/PerformanceReview';
import GoalsandOKRs from '@/features/HRMS/pages/Performance-Growth/GoalsandOKRs';
import AssetsInventoryPage from '@/features/HRMS/pages/assets-management/AssetsInventoryPage';
import AssetsReportPage from '@/features/HRMS/pages/assets-management/AssetsReportPage';
import AssetRequestsPage from '@/features/HRMS/pages/assets-management/AssetsRequestPage';
import MaintenanceRepairPage from '@/features/HRMS/pages/assets-management/MaintanenceAndReoairPage';
import MyAssetsPage from '@/features/HRMS/pages/assets-management/MyAssetsPage';
import ReturnRecoveryPage from '@/features/HRMS/pages/assets-management/ReturnAndRecoveryPage';
import VendorsPurchasePage from '@/features/HRMS/pages/assets-management/VendorAndPurchasePage';
import ShiftMasterPage from '@/features/HRMS/pages/shift-management/ShiftMasterPage';
import ShiftRulesAndSchedulePage from '@/features/HRMS/pages/shift-management/ShiftRulesAndSchedulePage';
import OverTimeReportsPage from '@/features/HRMS/pages/shift-management/Reports/OverTimeReportsPage';
import ShiftWiseAttendencePage from '@/features/HRMS/pages/shift-management/Reports/ShiftWiseAttendencePage';
import FAQPage from '@/features/HRMS/pages/Helpdesk/FAQPage';
import HelpdeskReportPage from '@/features/HRMS/pages/Helpdesk/HelpdeskReportPage';
import MyTicketsPage from '@/features/HRMS/pages/Helpdesk/MyTicketsPage';
import RaiseTicketPage from '@/features/HRMS/pages/Helpdesk/RaiseTicketPage';
import OnboardingHubPage from '@/features/HRMS/pages/Actions/OnBoardingHub';
import CandidateOnboardingPage from '@/features/HRMS/pages/Actions/on-boarding/CandidateOnboarding';
import OffBoardingHub from '@/features/HRMS/pages/Actions/OffBoardingHub';
import ApprovalsInbox from '@/features/HRMS/pages/Actions/ApprovalsInbox';
import ExitandSettlement from '@/features/HRMS/pages/Actions/ExitandSettlement';

export const employerRoutes = (
  <>
    <Route path="my-space" element={<MySpacePage />} />

    <Route path="attendance">
      <Route index element={<MyAttendence />} />
      <Route path="time-clock" element={<TimeClock />} />
      <Route path="my-attendance" element={<MyAttendence />} />
      <Route path="emp-attendeance" element={<EmployeeAttendence />} />
      <Route path="attendence-requests" element={<AttendenceRequests />} />
      <Route
        path="attendence-summary-report"
        element={<AttendenceSummaryReport />}
      />
      <Route
        path="attendence-correction-report"
        element={<AttendenceCorectionReport />}
      />
      <Route path="monthly-muster-report" element={<MonthlyMusterReport />} />
      <Route path="attendence-insights" element={<AttendenceInsights />} />
    </Route>
    <Route path="payrolls/payroll-overview" element={<PayrollOverview />} />
    <Route path="payrolls/salary-structure" element={<SalaryStructurePage />} />
    <Route path="payrolls/payslips" element={<PayslipPage />} />
    <Route path="payrolls/tax-declarations" element={<TaxDeclaration />} />
    <Route path="payrolls/form16" element={<Form16Page />} />
    <Route
      path="payrolls/reimbursements-and-buyouts"
      element={<ReimbursementBuyoutPage />}
    />
    <Route
      path="payrolls/loans-and-advances"
      element={<LoanAndAdvancePage />}
    />
    <Route path="payrolls/payroll-reports" element={<PayrollReportPage />} />
    {/* Documents ROuting */}
    <Route
      path="documents/company-documents"
      element={<CompanyDocumentsPage />}
    />
    <Route path="documents/esignature" element={<ESignaturePage />} />
    <Route
      path="documents/document-requests"
      element={<DocumentRequestsPage />}
    />
    <Route
      path="documents/templates-and-autogeneration"
      element={<TemplatesPage />}
    />

    <Route path="leave-holiday/leave-policies" element={<LeavePolicies />} />
    <Route path="leave-holiday/my-leaves" element={<MyLeavesPage />} />
    <Route
      path="leave-holiday/leave-holiday-calander"
      element={<LeaveAndHolidayCalenderPage />}
    />
    <Route path="leave-holiday/leave-reports" element={<LeaveReportPage />} />
    {/* Directory Routes */}
    <Route path="directory/company-structure" element={<CompanyStructure />} />
    <Route
      path="directory/employee-directory"
      element={<EmployeeDirectory />}
    />
    <Route path="directory/organization-chart" element={<OrgChart />} />

    {/* Settings Route */}
    <Route
      path="settings/attendance-settings"
      element={<AttendenceSettingsPage />}
    />
    <Route path="settings/leave-settings" element={<LeaveSettingsPage />} />

    <Route
      path="settings/regularization-settings"
      element={<RegularizationSettingsPage />}
    />

    <Route path="settings/actions" element={<ActionSettingsPage />} />

    <Route path="settings/profile-settings" element={<ProfileSettingsPage />} />

    <Route
      path="settings/document-settings"
      element={<DocumentSettingsPage />}
    />

    <Route path="settings/assets-settings" element={<AssetsSettingsPage />} />

    <Route path="settings/shift-settings" element={<ShiftSettingsPage />} />
    <Route
      path="settings/helpdesk-settings"
      element={<HelpdeskSettingsPage />}
    />
    {/* performance & growth routes */}
    <Route
      path="performance-growth/goals-and-okrs"
      element={<GoalsandOKRs />}
    />
    <Route
      path="performance-growth/performance-reviews"
      element={<PerformanceReview />}
    />
    <Route
      path="performance-growth/one-on-one-notes"
      element={<OneonOneNotes />}
    />
    <Route
      path="performance-growth/calibrations-and-increments"
      element={<CalibrationandIncrement />}
    />
    <Route
      path="performance-growth/talent-and-succession"
      element={<TalentandSuccession />}
    />
    <Route path="performance-growth/feedback" element={<Feedback />} />
    <Route path="assets-management/my-assets" element={<MyAssetsPage />} />
    <Route
      path="assets-management/assets-inventory"
      element={<AssetsInventoryPage />}
    />
    <Route
      path="assets-management/assets-requests"
      element={<AssetRequestsPage />}
    />
    <Route
      path="assets-management/return-and-recovery"
      element={<ReturnRecoveryPage />}
    />
    <Route
      path="assets-management/maintanance-and-repairs"
      element={<MaintenanceRepairPage />}
    />
    <Route
      path="assets-management/vendor-and-purchase"
      element={<VendorsPurchasePage />}
    />
    <Route
      path="assets-management/assets-reports"
      element={<AssetsReportPage />}
    />
    <Route path="shift-management/shift-master" element={<ShiftMasterPage />} />
    <Route
      path="shift-management/shift-rules-and-schedules"
      element={<ShiftRulesAndSchedulePage />}
    />
    <Route
      path="shift-management/reports/overtime-reports"
      element={<OverTimeReportsPage />}
    />
    <Route
      path="shift-management/reports/shift-wise-attendence"
      element={<ShiftWiseAttendencePage />}
    />
    <Route path="helpdesk">
      <Route index element={<MyTicketsPage />} />
      <Route path="my-tickets" element={<MyTicketsPage />} />
      <Route path="raise-ticket" element={<RaiseTicketPage />} />
      <Route path="faqs" element={<FAQPage />} />
      <Route path="helpdesk-reports" element={<HelpdeskReportPage />} />
    </Route>
    <Route path="actions">
      <Route path="onboarding-hub" element={<OnboardingHubPage />} />
      <Route
        path="onboarding-hub/add-candidate"
        element={<CandidateOnboardingPage />}
      />
      <Route path="offboarding-hub" element={<OffBoardingHub />} />
      <Route path="approvals-inbox" element={<ApprovalsInbox />} />
      <Route path="exit-and-settlements" element={<ExitandSettlement />} />
    </Route>
  </>
);

export default employerRoutes;
