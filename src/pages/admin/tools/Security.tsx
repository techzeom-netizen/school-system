import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormField } from '@/components/common';
import Section from '@/components/common/Section';
import { Plus } from 'lucide-react';
import { showSuccessToast, showErrorToast } from '@/lib/utils';

const Security: React.FC = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [authAppEnabled, setAuthAppEnabled] = useState(false);
  const [primaryEmailEnabled, setPrimaryEmailEnabled] = useState(true);
  const [smsRecoveryEnabled, setSmsRecoveryEnabled] = useState(false);
  const [mobileAuthEnabled, setMobileAuthEnabled] = useState(true);
  const [emailNotifEnabled, setEmailNotifEnabled] = useState(false);
  const [smsAccountRecoveryEnabled, setSmsAccountRecoveryEnabled] =
    useState(false);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogPreviewUrl, setDialogPreviewUrl] = useState<string | null>(null);
  const [accountHolderName, setAccountHolderName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currency, setCurrency] = useState('usd');
  const [interestRate, setInterestRate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('active');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      showErrorToast('Please fill all password fields');
      return;
    }
    if (newPassword.length < 8) {
      showErrorToast('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      showErrorToast('Passwords do not match');
      return;
    }
    showSuccessToast('Password changed successfully');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handlePrivacySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreePrivacy || !confirmDelete) {
      showErrorToast('Please check both required boxes');
      return;
    }
    showSuccessToast('Privacy preferences saved');
  };

  const handleDialogFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDialogPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccessToast('Bank account created successfully');
    // Reset form
    setDialogPreviewUrl(null);
    setAccountHolderName('');
    setPhoneNumber('');
    setCurrency('usd');
    setInterestRate('');
    setExpiryDate('');
    setAmount('');
    setStatus('active');
    setIsDialogOpen(false);
  };

  return (
    <Section
      title="Security"
      showBreadcrumbs
      menuId="security"
      buttonText="Create Account"
      buttonIcon={Plus}
      onButtonClick={() => setIsDialogOpen(true)}
    >
      {/* Create Bank Account Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[710px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-dashed pb-4 mb-4">
            <DialogTitle className="text-xl font-semibold">
              Create Bank Account
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateAccount}>
            {/* Profile Photo Section */}
            <p className="mb-4 text-lg font-medium">Profile Photo</p>
            <div className="mb-6 flex flex-wrap items-center gap-5 xl:gap-10">
              <img
                src={
                  dialogPreviewUrl ||
                  'https://app.sangamamcoop.com/assets/images/placeholder.png'
                }
                alt="placeholder"
                className="h-20 w-20 lg:h-auto lg:w-auto rounded-full object-cover"
              />
              <div className="flex gap-4">
                <input
                  type="file"
                  name="photo"
                  id="photo"
                  className="hidden"
                  accept="image/*"
                  onChange={handleDialogFileChange}
                />
                <label
                  htmlFor="photo"
                  className="btn bg-blue-700 text-white px-6 py-2 rounded cursor-pointer hover:bg-blue-800"
                >
                  Upload Photo
                </label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogPreviewUrl(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="mt-6 grid grid-cols-2 gap-4 xl:mt-8 xxxl:gap-6">
              <div className="col-span-2">
                <FormField
                  label="Account Holder Name"
                  name="accountHolderName"
                  type="text"
                  value={accountHolderName}
                  onChange={setAccountHolderName}
                  placeholder="Enter Name"
                  required
                />
              </div>

              <div className="col-span-2">
                <FormField
                  label="Phone Number"
                  name="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  placeholder="Enter Number"
                  required
                />
              </div>

              <div className="col-span-2">
                <FormField
                  label="Select Currency"
                  name="currency"
                  type="select"
                  value={currency}
                  onChange={setCurrency}
                  options={[
                    { value: 'usd', label: 'USD' },
                    { value: 'gbp', label: 'GBP' },
                    { value: 'yen', label: 'YEN' },
                    { value: 'jpn', label: 'JPN' },
                  ]}
                  required
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <FormField
                  label="Interest Rate"
                  name="interestRate"
                  type="number"
                  value={interestRate}
                  onChange={setInterestRate}
                  placeholder="Interest Rate %"
                  required
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <FormField
                  label="Expiry Date"
                  name="expiryDate"
                  type="date"
                  value={expiryDate}
                  onChange={setExpiryDate}
                  placeholder="Select Date"
                  required
                />
              </div>

              <div className="col-span-2">
                <FormField
                  label="Amount"
                  name="amount"
                  type="number"
                  value={amount}
                  onChange={setAmount}
                  placeholder="Enter Amount"
                  required
                />
              </div>

              <div className="col-span-2">
                <FormField
                  label="Select Status"
                  name="status"
                  type="select"
                  value={status}
                  onChange={setStatus}
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                  ]}
                  required
                />
              </div>

              <div className="col-span-2 mt-4">
                <Button
                  type="submit"
                  className="bg-blue-700 text-white px-6 py-2 rounded w-full"
                >
                  Create Account
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Change Password Section */}
      <Section title="Change Password" className="bg-white rounded shadow">
        <form
          onSubmit={handleChangePassword}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end"
        >
          <FormField
            label="Old Password *"
            name="oldPassword"
            type="password"
            placeholder="Enter your old password"
            value={oldPassword}
            onChange={val => setOldPassword(val)}
            required
          />
          <FormField
            label="New Password *"
            name="newPassword"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={val => setNewPassword(val)}
            required
          />
          <FormField
            label="Confirm Password *"
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={val => setConfirmPassword(val)}
            required
          />
          <div className="flex items-center gap-4 mt-2">
            <Button
              type="submit"
              className="bg-blue-700 text-white px-6 py-2 rounded"
            >
              Save Changes
            </Button>
            <Button
              type="button"
              className="border"
              onClick={() => {
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Section>

      {/* Privacy Section */}
      <Section
        title="Privacy & Policy"
        className="mt-8 bg-white rounded shadow"
      >
        <form
          onSubmit={handlePrivacySubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end"
        >
          <FormField
            label="I agree to the privacy & policy *"
            name="agreePrivacy"
            type="checkbox"
            value={agreePrivacy}
            onCheckboxChange={setAgreePrivacy}
            required
          />
          <FormField
            label="Confirm that I want to delete my profile *"
            name="confirmDelete"
            type="checkbox"
            value={confirmDelete}
            onCheckboxChange={setConfirmDelete}
            required
          />
          <div className="flex items-center">
            <Button
              type="submit"
              className="bg-blue-700 text-white px-6 py-2 rounded min-w-[160px]"
            >
              Save Privacy
            </Button>
          </div>
        </form>
      </Section>

      {/* Two-Factor Authentication Section */}
      <Section
        title="Two-Factor Authentication"
        className="mt-8 bg-white rounded shadow"
      >
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <FormField
            label="Authentication App"
            name="authAppEnabled"
            type="checkbox"
            value={authAppEnabled}
            onCheckboxChange={setAuthAppEnabled}
          />
          <FormField
            label="Primary Email"
            name="primaryEmailEnabled"
            type="checkbox"
            value={primaryEmailEnabled}
            onCheckboxChange={setPrimaryEmailEnabled}
          />
          <FormField
            label="SMS Recovery"
            name="smsRecoveryEnabled"
            type="checkbox"
            value={smsRecoveryEnabled}
            onCheckboxChange={setSmsRecoveryEnabled}
          />
          <FormField
            label="Mobile Authenticator"
            name="mobileAuthEnabled"
            type="checkbox"
            value={mobileAuthEnabled}
            onCheckboxChange={setMobileAuthEnabled}
          />
          <FormField
            label="Email Notifications"
            name="emailNotifEnabled"
            type="checkbox"
            value={emailNotifEnabled}
            onCheckboxChange={setEmailNotifEnabled}
          />
          <FormField
            label="SMS Account Recovery"
            name="smsAccountRecoveryEnabled"
            type="checkbox"
            value={smsAccountRecoveryEnabled}
            onCheckboxChange={setSmsAccountRecoveryEnabled}
          />
        </form>
      </Section>
    </Section>
  );
};

export default Security;
