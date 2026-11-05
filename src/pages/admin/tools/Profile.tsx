import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormField } from '@/components/common';
import { showSuccessToast } from '@/lib/utils';
import Section from '@/components/common/Section';
import { Plus } from 'lucide-react';

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const Profile: React.FC = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('male');
  const [tagline, setTagline] = useState('');
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [location, setLocation] = useState('USA');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccessToast('Profile saved successfully');
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccessToast('Address saved');
  };

  const handlePrivacySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccessToast('Privacy saved');
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setGender('male');
    setTagline('');
    setAgreePrivacy(false);
    setAgreeTerms(false);
  };

  const deleteAccountText =
    'When you delete your account, you lose access to Front account services, and we permanently delete your personal data. You can cancel the deletion for 14 days.';

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
      title="Profile"
      showBreadcrumbs
      menuId="profile"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side - Profile Form */}
        <Section
          title="Profile Information"
          className="bg-white rounded shadow"
        >
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="flex items-end mb-5 gap-[10px]">
              <FormField
                type="file"
                label="Upload Photo"
                name="profilePhoto"
                value=""
                onFileChange={handleFileChange}
                previewUrl={previewUrl ?? undefined}
                accept="image/*"
                required
              />
              <Button
                type="button"
                className="bg-blue-600 h-fit"
                onClick={() => setPreviewUrl(null)}
              >
                Cancel
              </Button>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <FormField
                label="First Name *"
                name="firstName"
                type="text"
                value={firstName}
                onChange={setFirstName}
                required
              />
              <FormField
                label="Last Name *"
                name="lastName"
                type="text"
                value={lastName}
                onChange={setLastName}
                required
              />
            </div>

            <FormField
              label="Email *"
              name="email"
              type="email"
              value={email}
              onChange={setEmail}
              required
            />

            <FormField
              label="Phone (Optional)"
              name="phone"
              type="tel"
              value={phone}
              onChange={setPhone}
            />

            <FormField
              label="Gender *"
              name="gender"
              type="radio"
              value={gender}
              options={genderOptions}
              onChange={setGender}
              required
            />

            <FormField
              label="Tagline *"
              name="tagline"
              type="textarea"
              value={tagline}
              onChange={setTagline}
              required
            />

            <FormField
              label="I agree to the privacy & policy *"
              name="agreePrivacy"
              type="checkbox"
              value={agreePrivacy}
              onCheckboxChange={setAgreePrivacy}
              required
            />
            <FormField
              label="I agree with all terms & conditions *"
              name="agreeTerms"
              type="checkbox"
              value={agreeTerms}
              onCheckboxChange={setAgreeTerms}
              required
            />

            <div className="flex items-center gap-4 pt-4">
              <Button
                type="submit"
                className="bg-blue-700 text-white px-6 py-2 rounded"
              >
                Save Changes
              </Button>
              <Button type="button" className="border" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Section>

        {/* Right Side - Address & Privacy */}
        <div className="space-y-6">
          {/* Address Form */}
          <Section title="Address" className="bg-white rounded shadow">
            <form onSubmit={handleAddressSubmit}>
              <FormField
                label="Location *"
                name="location"
                type="select"
                value={location}
                onChange={setLocation}
                options={[
                  { value: 'USA', label: 'USA' },
                  { value: 'India', label: 'India' },
                ]}
                required
              />

              <FormField
                label="Address 1 *"
                name="address1"
                type="text"
                value={address1}
                onChange={setAddress1}
                required
              />
              <FormField
                label="Address 2 (Optional)"
                name="address2"
                type="text"
                value={address2}
                onChange={setAddress2}
              />

              <FormField
                label="Zip Code *"
                name="zipCode"
                type="text"
                value={zipCode}
                onChange={setZipCode}
                required
              />

              <div className="flex items-center gap-4 pt-6">
                <Button
                  type="submit"
                  className="bg-blue-700 text-white px-6 py-2 rounded"
                >
                  Save Changes
                </Button>
                <Button type="button" className="border">
                  Cancel
                </Button>
              </div>
            </form>
          </Section>

          {/* Privacy Form */}
          <Section title="Privacy" className="bg-white rounded shadow">
            <form onSubmit={handlePrivacySubmit}>
              <FormField
                label="Who can see your profile photo? *"
                name="photoPrivacy"
                type="select"
                value={agreePrivacy ? 'friends' : 'anyone'}
                onChange={() => {}}
                options={[
                  { value: 'anyone', label: 'Anyone' },
                  { value: 'friends', label: 'Friends' },
                  { value: 'only-me', label: 'Only me' },
                ]}
                required
              />

              <div className="flex items-center gap-4 pt-6">
                <Button
                  type="submit"
                  className="bg-blue-700 text-white px-6 py-2 rounded"
                >
                  Save Changes
                </Button>
                <Button type="button" className="border">
                  Cancel
                </Button>
              </div>
            </form>
          </Section>

          {/* Delete Account Section */}
          <Section
            title="Delete Your Account"
            className="bg-white rounded shadow"
          >
            <form
              onSubmit={e => {
                e.preventDefault();
                if (confirmDelete) {
                  showSuccessToast('Account deleted');
                }
              }}
            >
              <p className="text-sm text-gray-600 mb-4">{deleteAccountText}</p>
              <FormField
                label="Confirm that I want to delete my profile *"
                name="confirmDelete"
                type="checkbox"
                value={confirmDelete}
                onCheckboxChange={setConfirmDelete}
                required
              />

              <div className="pt-6">
                <Button type="submit" className="border">
                  Delete
                </Button>
              </div>
            </form>
          </Section>
        </div>
      </div>
    </Section>
  );
};

export default Profile;
