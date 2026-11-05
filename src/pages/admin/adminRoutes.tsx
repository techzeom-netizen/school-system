import { Route } from 'react-router-dom';

// Admin Components
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import TransactionManagement from '@/components/admin/TransactionManagement';
import CustomerManagement from '@/components/admin/CustomerManagement';
import Reports from '@/components/admin/Reports';

// Admin Pages
import SavingAccountPage from './SavingAccountPage';
import SavingAccountsListPage from './SavingAccountsListPage';
import CompanyProfilePage from './company/CompanyProfilePage';
import AddPromoterPage from './company/AddPromoterPage';
import ViewPromoterPage from './company/ViewPromoterPage';
import CreateBranchPage from './branch/CreateBranchPage';
import ViewUpdateBranchPage from './branch/ViewUpdateBranchPage';
import BODPage from './company/BODPage';
import ViewLoginDetailsPage from './company/ViewLoginDetailsPage';
import EODPage from './company/EODPage';
import ChangePasswordPage from './company/ChangePasswordPage';
import ViewUpdateFinancialYearPage from './company/ViewUpdateFinancialYearPage';
import LockSettingPage from './company/LockSettingPage';
import UnencumberedDepositPage from './company/UnencumberedDepositPage';
import GetSMSBalancePage from './company/GetSMSBalancePage';
import SMSTemplatePage from './company/SMSTemplatePage';
import ShareParameterPage from './bank/ShareParameterPage';
import FeeParameterPage from './bank/FeeParameterPage';
import SBAccountParametersPage from './bank/SBAccountParametersPage';
import PlanParameterPage from './bank/PlanParameterPage';
import CurrentAccountParametersPage from './bank/CurrentAccountParametersPage';
import AddPrematuritySlabsPage from './bank/AddPrematuritySlabsPage';
import LoanOnDepositParametersPage from './bank/LoanOnDepositParametersPage';
import ApprovalLimitParametersPage from './bank/ApprovalLimitParametersPage';
import ServiceDeductionPage from './bank/ServiceDeductionPage';
import DepositTDSParametersPage from './bank/DepositTDSParametersPage';
import ODAccountParameterPage from './bank/ODAccountParameterPage';
import LateFeeParameterPage from './bank/LateFeeParameterPage';
import AddServiceChargesPage from './bank/AddServiceChargesPage';
import HolidayListPage from './bank/HolidayListPage';
import CreateHolidayPage from './bank/CreateHolidayPage';
import PaymentSetup from './PaymentGateway/paymentSetup';
import VirtualAccountRequest from './PaymentGateway/virtualAccountRequest';
import { Exchange, MakePayment } from './PaymentGateway';
import PolicyModificationPage from './modifications/PolicyModificationPage';
import NomineeChangePage from './modifications/NomineeChangePage';
import ChangeSBAccountType from './modifications/ChangeSBAccountTypePage';
import SeniorCitizenROIChangePage from './modifications/SeniorCitizenROIChangePage';
import UpdateMemberDatePage from './modifications/UpdateMemberDatePage';
import DepositMemberChangePage from './modifications/DepositMemberChangePage';
import DeleteAccountTransactionsPage from './modifications/DeleteAccountTransactionsPage';
import DeleteAccountsPage from './modifications/DeleteAccountsPage';
import ActivateDeactivateAccountPage from './modifications/ActivateDeactivateAccountPage';
import DeletedLoanReportsPage from './modifications/DeletedLoanReportsPage';
import DeletedEMIReportPage from './modifications/DeletedEMIReportPage';
import DeleteAccountTransactionReportPage from './modifications/DeleteAccountTransactionReportPage';
import UpdateShareDatePage from './modifications/UpdateShareDatePage';
import AddBankRequestPage from './request/AddBankRequestPage';
import NeftRequestPage from './request/NeftRequestPage';
import OnlineRequestPage from './request/OnlineRequestPage';
import SmsChargeDeductPage from './request/SmsChargeDeductPage';
import ComplaintHelpReqPage from './request/ComplaintHelpReqPage';
import FeedbackRequestPage from './request/FeedbackRequestPage';
import AssignRequestToBrangePage from './request/AssignRequestToBranchPage';
import ShareTransferRequestPage from './request/ShareTransferRequestPage';
import AddBranchPrefixPage from './branch/AddBranchPrefixPage';
import IPControlPage from './branch/IPControlPage';
import CreateServiceCenterPage from './branch/CreateServiceCenterPage';
import ViewServiceCenterPage from './branch/ViewServiceCenterPage';
import CreateServiceCenterUserPage from './branch/CreateServiceCenterUserPage';
import ViewServiceCenterUserPage from './branch/ViewServiceCenterUserPage';
import KioskATMConfiguration from './terminalSuite/KioskATMConfiguration';
import POSConfiguration from './terminalSuite/POSConfiguration';
import VirtualDebitCredit from './terminalSuite/VirtualDebitCredit';
import Payin from './terminalSuite/Payin';
import PayOut from './terminalSuite/PayOut';
import MicroAtmModule from './terminalSuite/MicroAtmModule';
import UPICollectionModule from './terminalSuite/UPICollectionModule';
import CDMIntegration from './terminalSuite/CDMIntegration';
import RecurringPaymentSetup from './terminalSuite/RecurringPaymentSetup';
import MerchantManagementModule from './terminalSuite/MerchantManagementModule';
import InsuranceCrossSellingModule from './terminalSuite/InsuranceCrossSellingModule';
import RewardCashBackManagement from './terminalSuite/RewardCashBackManagement';
import BBPS from './terminalSuite/BBPS';
import Occupation from './modifications/managermaster/Occupation';
import Relationship from './modifications/managermaster/Relationship';
import Annualincome from './modifications/managermaster/Annualincome';
import UpdateNews from './modifications/managermaster/UpdateNews';
import AddIpAddress from './modifications/managermaster/AddIpAddress';
import UpdateIpAddress from './modifications/managermaster/UpdateIpAddress';
import ChangeIpAddress from './modifications/managermaster/ChangeIpAddress';
import GalleryCategory from './modifications/managermaster/GalleryCategory';
import UpdateGallery from './modifications/managermaster/UpdateGallery';
import ShareAllocationPermission from './modifications/managermaster/ShareAllocationPermission';
import ServicesPermission from './modifications/managermaster/ServicesPermission';
import RequiredDocuments from './modifications/managermaster/RequiredDocuments';
import CreateReligion from './modifications/managermaster/CreateReligion';
import ManageServiceTax from './modifications/managermaster/ManageServiceTax';
import UpdateBankDetails from './modifications/managermaster/UpdateBankDetails';
import CreateNews from './modifications/managermaster/CreateNews';
import SmsNotification from './tools/SmsNotification';
import EmailCommunication from './tools/EmailCommunication';
import WhatsappCommunication from './tools/WhatsappCommunication';
import Profile from './tools/Profile';
import Security from './tools/Security';
import SocialNetwork from './tools/SocialNetwork';
import Notification from './tools/Notification';
import PaymentLinks from './tools/PaymentLinks';
import SoundBox from './terminalSuite/SoundBox';
import CreateComplaint from './complaint/CreateComplaint';
import ViewComplaint from './complaint/ViewComplaint';
import CompanySetting from './company/CompanySetting';
import SystemSetting from './company/SystemSetting';
import SoftwareConfiguration from './company/SoftwareConfiguration';
import ListOfKycDocumnets from './bank/ListOfKycDocumnets';
import CodeSequencePage from './branch/CodeSequencePage';

/**
 * Admin Routes Configuration
 * All routes under /dashboard/admin/*
 */
export const adminRoutes = (
  <>
    {/* Admin Dashboard Home */}
    <Route index element={<AdminDashboard />} />

    {/* Transaction Management */}
    <Route path="transactions" element={<TransactionManagement />} />

    {/* Customer Management */}
    <Route path="customers" element={<CustomerManagement />} />

    {/* Reports */}
    <Route path="reports" element={<Reports />} />

    {/* Saving Account Routes */}
    <Route path="saving-account" element={<SavingAccountPage />} />
    <Route path="saving-accounts" element={<SavingAccountsListPage />} />

    {/* Company Routes */}
    <Route path="company/profile" element={<CompanyProfilePage />} />
    <Route path="company/promoters" element={<ViewPromoterPage />} />
    <Route path="company/promoters/create" element={<AddPromoterPage />} />
    <Route path="company/bod" element={<BODPage />} />
    <Route path="company/login-details" element={<ViewLoginDetailsPage />} />
    <Route path="company/eod" element={<EODPage />} />
    <Route
      path="company/unencumbered-deposit"
      element={<UnencumberedDepositPage />}
    />
    <Route path="company/sms-balance" element={<GetSMSBalancePage />} />
    <Route path="company/update-content" element={<CompanySetting />} />
    <Route path="company/system-settings" element={<SystemSetting />} />
    <Route path="company/sms-templates" element={<SMSTemplatePage />} />
    <Route path="company/software-config" element={<SoftwareConfiguration />} />
    <Route
      path="bank-master/share-parameter"
      element={<ShareParameterPage />}
    />
    <Route path="bank-master/fee-parameter" element={<FeeParameterPage />} />
    <Route
      path="bank-master/sb-accounts-parameters"
      element={<SBAccountParametersPage />}
    />
    <Route path="bank-master/plan-parameters" element={<PlanParameterPage />} />
    <Route
      path="bank-master/current-accounts-parameters"
      element={<CurrentAccountParametersPage />}
    />
    <Route
      path="bank-master/prematurity-slabs"
      element={<AddPrematuritySlabsPage />}
    />
    <Route
      path="bank-master/loan-on-deposit-parameters"
      element={<LoanOnDepositParametersPage />}
    />
    <Route
      path="bank-master/approval-limit-parameters"
      element={<ApprovalLimitParametersPage />}
    />
    <Route
      path="bank-master/service-deduction"
      element={<ServiceDeductionPage />}
    />
    <Route
      path="bank-master/deposit-tds-parameters"
      element={<DepositTDSParametersPage />}
    />
    <Route
      path="bank-master/od-account-parameter"
      element={<ODAccountParameterPage />}
    />
    <Route
      path="bank-master/late-fee-parameter"
      element={<LateFeeParameterPage />}
    />
    <Route
      path="bank-master/service-charges"
      element={<AddServiceChargesPage />}
    />
    <Route path="bank-master/holidays" element={<HolidayListPage />} />
    <Route path="bank-master/kyc-documents" element={<ListOfKycDocumnets />} />
    <Route path="bank-master/holidays/create" element={<CreateHolidayPage />} />

    {/* Branch Routes */}
    <Route path="branch" element={<ViewUpdateBranchPage />} />
    <Route path="branch/create" element={<CreateBranchPage />} />
    <Route path="company/change-password" element={<ChangePasswordPage />} />
    <Route
      path="company/financial-year"
      element={<ViewUpdateFinancialYearPage />}
    />
    <Route path="company/lock-settings" element={<LockSettingPage />} />
    <Route
      path="payment-gateway/neft-rtgs-imps-setup"
      element={<PaymentSetup />}
    />
    <Route
      path="payment-gateway/virtual-account-request"
      element={<VirtualAccountRequest />}
    />
    <Route
      path="payment-gateway/approve-virtual-account"
      element={<Exchange />}
    />
    <Route path="payment-gateway/request" element={<MakePayment />} />

    {/* Modification routes */}
    <Route path="modifications/policy" element={<PolicyModificationPage />} />
    <Route path="modifications/nominee" element={<NomineeChangePage />} />
    <Route
      path="modifications/sb-account-type"
      element={<ChangeSBAccountType />}
    />
    <Route
      path="modifications/senior-citizen-roi"
      element={<SeniorCitizenROIChangePage />}
    />
    <Route
      path="modifications/member-date"
      element={<UpdateMemberDatePage />}
    />
    <Route
      path="modifications/deposit-member"
      element={<DepositMemberChangePage />}
    />
    <Route
      path="modifications/delete-transaction"
      element={<DeleteAccountTransactionsPage />}
    />
    <Route
      path="modifications/delete-accounts"
      element={<DeleteAccountsPage />}
    />
    <Route
      path="modifications/activate-deactivate-account"
      element={<ActivateDeactivateAccountPage />}
    />
    <Route
      path="modifications/deleted-loans-report"
      element={<DeletedLoanReportsPage />}
    />
    <Route
      path="modifications/deleted-emi-report"
      element={<DeletedEMIReportPage />}
    />
    <Route
      path="modifications/deleted-transaction-report"
      element={<DeleteAccountTransactionReportPage />}
    />
    <Route path="modifications/share-date" element={<UpdateShareDatePage />} />
    {/* Bank Request Routes */}
    <Route path="request/balance/create" element={<AddBankRequestPage />} />
    <Route path="request/neft" element={<NeftRequestPage />} />
    <Route path="request/online" element={<OnlineRequestPage />} />
    <Route path="request/sms-charge-deduct" element={<SmsChargeDeductPage />} />
    <Route path="request/complaint-help" element={<ComplaintHelpReqPage />} />
    <Route
      path="request/feedback-appreciation"
      element={<FeedbackRequestPage />}
    />
    <Route
      path="request/assign-to-branch"
      element={<AssignRequestToBrangePage />}
    />
    <Route
      path="request/share-transfer"
      element={<ShareTransferRequestPage />}
    />
    {/* managebranch Routes */}
    <Route path="branch/code-sequence" element={<CodeSequencePage />} />
    <Route path="branch/prefix/create" element={<AddBranchPrefixPage />} />
    <Route path="branch/ip-control" element={<IPControlPage />} />
    <Route
      path="contact/service-center/create"
      element={<CreateServiceCenterPage />}
    />
    <Route path="contact/service-center" element={<ViewServiceCenterPage />} />
    <Route
      path="contact/service-center/user/create"
      element={<CreateServiceCenterUserPage />}
    />
    <Route
      path="contact/service-center/user"
      element={<ViewServiceCenterUserPage />}
    />
    <Route
      path="terminal-suite/kiosk-atm"
      element={<KioskATMConfiguration />}
    />
    <Route path="terminal-suite/pos" element={<POSConfiguration />} />
    <Route path="terminal-suite/sound-box-standy" element={<SoundBox />} />
    <Route
      path="terminal-suite/virtual-debit-credit"
      element={<VirtualDebitCredit />}
    />
    <Route path="terminal-suite/payin" element={<Payin />} />
    <Route path="terminal-suite/payout" element={<PayOut />} />
    <Route
      path="terminal-suite/micro-atm-module"
      element={<MicroAtmModule />}
    />
    <Route
      path="terminal-suite/upi-collection-module"
      element={<UPICollectionModule />}
    />
    <Route path="terminal-suite/cdm-integration" element={<CDMIntegration />} />
    <Route
      path="terminal-suite/recurring-payment-setup"
      element={<RecurringPaymentSetup />}
    />
    <Route
      path="terminal-suite/merchant-management-module"
      element={<MerchantManagementModule />}
    />
    <Route
      path="terminal-suite/insurance-cross-selling-module"
      element={<InsuranceCrossSellingModule />}
    />
    <Route
      path="terminal-suite/reward-cashback-management"
      element={<RewardCashBackManagement />}
    />
    <Route path="terminal-suite/bbps" element={<BBPS />} />
    {/* Manage Master */}
    <Route
      path="master/share-allocation-permission"
      element={<ShareAllocationPermission />}
    />
    <Route
      path="master/sms-payout-service-permission"
      element={<ServicesPermission />}
    />
    <Route path="master/required-documents" element={<RequiredDocuments />} />
    <Route path="master/occupation" element={<Occupation />} />
    <Route path="master/relationship" element={<Relationship />} />
    <Route path="master/annual-income" element={<Annualincome />} />
    <Route path="master/religion/create" element={<CreateReligion />} />
    <Route path="master/service-tax" element={<ManageServiceTax />} />
    <Route path="master/bank-details" element={<UpdateBankDetails />} />
    <Route path="master/news/create" element={<CreateNews />} />
    <Route path="master/news" element={<UpdateNews />} />
    <Route path="master/ip-address/create" element={<AddIpAddress />} />
    <Route path="master/ip-address" element={<UpdateIpAddress />} />
    <Route
      path="master/ip-address/change-status"
      element={<ChangeIpAddress />}
    />
    <Route
      path="master/gallery/category/create"
      element={<GalleryCategory />}
    />
    <Route path="master/gallery" element={<UpdateGallery />} />

    {/* tools Routes */}
    <Route path="tools/sms-communication" element={<SmsNotification />} />
    <Route path="tools/email-communication" element={<EmailCommunication />} />
    <Route
      path="tools/whatsapp-communication"
      element={<WhatsappCommunication />}
    />
    <Route path="tools/profile" element={<Profile />} />
    <Route path="tools/security" element={<Security />} />
    <Route path="tools/social-network" element={<SocialNetwork />} />
    <Route path="tools/notification" element={<Notification />} />
    <Route path="tools/payment-limits" element={<PaymentLinks />} />
    {/* Complaint */}
    <Route path="complaint/create-complaint" element={<CreateComplaint />} />
    <Route path="complaint/view-complaint" element={<ViewComplaint />} />
  </>
);
