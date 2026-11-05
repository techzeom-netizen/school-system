import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Section from '@/components/common/Section';
import { FormField } from '@/components/common';
import { showSuccessToast } from '@/lib/utils';
import { Plus } from 'lucide-react';

const Notification: React.FC = () => {
  // Email Notifications
  const [emailNotifMarketing, setEmailNotifMarketing] = useState(true);
  const [emailNotifUpdates, setEmailNotifUpdates] = useState(false);
  const [emailNotifSecurity, setEmailNotifSecurity] = useState(true);

  // SMS / Push Notifications
  const [smsNotifMarketing, setSmsNotifMarketing] = useState(false);
  const [smsNotifUpdates, setSmsNotifUpdates] = useState(true);
  const [smsNotifSecurity, setSmsNotifSecurity] = useState(true);

  // Email address for notifications
  const [email, setEmail] = useState('user@example.com');

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

  const handleSaveChanges = () => {
    showSuccessToast('Notification settings saved');
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
      title="Notification Settings"
      showBreadcrumbs
      menuId="notification-settings"
      buttonText="Add New"
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
      {/* Email Notifications */}
      <Section title="Email Notifications" className="bg-white rounded shadow">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Email Address"
            name="emailAddress"
            type="text"
            value={email}
            onChange={setEmail}
            required
          />
          <FormField
            label="Marketing Emails"
            name="emailMarketing"
            type="checkbox"
            value={emailNotifMarketing}
            onCheckboxChange={setEmailNotifMarketing}
          />
          <FormField
            label="Product Updates"
            name="emailUpdates"
            type="checkbox"
            value={emailNotifUpdates}
            onCheckboxChange={setEmailNotifUpdates}
          />
          <FormField
            label="Security Alerts"
            name="emailSecurity"
            type="checkbox"
            value={emailNotifSecurity}
            onCheckboxChange={setEmailNotifSecurity}
          />
        </form>
      </Section>

      {/* SMS / Push Notifications */}
      <Section
        title="SMS / Push Notifications"
        className="mt-8 bg-white rounded shadow"
      >
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Marketing Messages"
            name="smsMarketing"
            type="checkbox"
            value={smsNotifMarketing}
            onCheckboxChange={setSmsNotifMarketing}
          />
          <FormField
            label="Product Updates"
            name="smsUpdates"
            type="checkbox"
            value={smsNotifUpdates}
            onCheckboxChange={setSmsNotifUpdates}
          />
          <FormField
            label="Security Alerts"
            name="smsSecurity"
            type="checkbox"
            value={smsNotifSecurity}
            onCheckboxChange={setSmsNotifSecurity}
          />
        </form>
      </Section>

      {/* Save & Reset Buttons */}
      <div className="mt-6 flex items-center gap-4">
        <Button
          type="button"
          className="bg-blue-700 text-white px-6 py-2 rounded"
          onClick={handleSaveChanges}
        >
          Save Changes
        </Button>
        <Button
          type="button"
          className="border px-6 py-2 rounded"
          onClick={() => {
            setEmailNotifMarketing(false);
            setEmailNotifUpdates(false);
            setEmailNotifSecurity(false);
            setSmsNotifMarketing(false);
            setSmsNotifUpdates(false);
            setSmsNotifSecurity(false);
          }}
        >
          Reset
        </Button>
      </div>
    </Section>
  );
};

export default Notification;
