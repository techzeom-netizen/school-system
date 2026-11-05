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
import { showSuccessToast } from '@/lib/utils';
import { Plus } from 'lucide-react';

const PaymentLimits: React.FC = () => {
  const [cashLimit, setCashLimit] = useState('800');
  const [privateLimit, setPrivateLimit] = useState('800');
  const [onlineLimit, setOnlineLimit] = useState('800');
  const [storeLimit, setStoreLimit] = useState('800');
  const [purchaseLimit, setPurchaseLimit] = useState('800');
  const [p2pLimit, setP2pLimit] = useState('800');

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [accountHolderName, setAccountHolderName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currency, setCurrency] = useState('usd');
  const [interestRate, setInterestRate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('active');

  const handleSave = () => showSuccessToast('Changes saved successfully');
  const handleCancel = () => showSuccessToast('Changes cancelled');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccessToast('Bank account created successfully');
    // Reset form
    setPreviewUrl(null);
    setAccountHolderName('');
    setPhoneNumber('');
    setCurrency('usd');
    setInterestRate('');
    setExpiryDate('');
    setAmount('');
    setStatus('active');
    setIsDialogOpen(false);
  };

  // helper to show visual progress bar (like a slider)
  const ProgressBar = ({ value }: { value: string }) => {
    const percentage = (parseInt(value) / 5000) * 100;
    return (
      <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
        <div
          className="h-2 bg-blue-600 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  return (
    <Section
      title="Payment Limits"
      showBreadcrumbs
      menuId="payment-limits"
      buttonText="Open an Account"
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
                  previewUrl ||
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
                  onChange={handleFileChange}
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
                  onClick={() => setPreviewUrl(null)}
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
      <div className="space-y-6">
        {/* Payment Limits Sub-sections */}
        <div className="space-y-4">
          <Section
            title="Cash withdrawal"
            className="bg-gray-50 rounded-md border"
            contentClassName="pt-0 p-4"
          >
            <FormField
              label="Amount spent and setup"
              type="number"
              name="cashLimit"
              value={cashLimit}
              onChange={(val: string) => setCashLimit(val)}
              min="0"
              max="5000"
              step="50"
              required
            />
            <ProgressBar value={cashLimit} />
            <div className="text-sm text-right text-gray-600 mt-1">
              ${cashLimit}.00 / $5000.00
            </div>
          </Section>

          <Section
            title="Private Transaction"
            className="bg-gray-50 rounded-md border"
            contentClassName="pt-0 p-4"
          >
            <FormField
              label="Amount spent and setup"
              type="number"
              name="privateLimit"
              value={privateLimit}
              onChange={(val: string) => setPrivateLimit(val)}
              min="0"
              max="5000"
              step="50"
              required
            />
            <ProgressBar value={privateLimit} />
            <div className="text-sm text-right text-gray-600 mt-1">
              ${privateLimit}.00 / $5000.00
            </div>
          </Section>

          <Section
            title="Online Payment"
            className="bg-gray-50 rounded-md border"
            contentClassName="pt-0 p-4"
          >
            <FormField
              label="Amount spent and setup"
              type="number"
              name="onlineLimit"
              value={onlineLimit}
              onChange={(val: string) => setOnlineLimit(val)}
              min="0"
              max="5000"
              step="50"
              required
            />
            <ProgressBar value={onlineLimit} />
            <div className="text-sm text-right text-gray-600 mt-1">
              ${onlineLimit}.00 / $5000.00
            </div>
          </Section>
        </div>

        {/* Transaction Limits Sub-sections */}
        <div className="space-y-4">
          <Section
            title="One-time purchase in store"
            className="bg-gray-50 rounded-md border"
            contentClassName="pt-0 p-4"
          >
            <FormField
              label="Account Limits"
              type="number"
              name="storeLimit"
              value={storeLimit}
              onChange={(val: string) => setStoreLimit(val)}
              min="0"
              max="5000"
              step="50"
              required
            />
            <ProgressBar value={storeLimit} />
            <div className="text-sm text-right text-gray-600 mt-1">
              ${storeLimit}.00 / $5000.00
            </div>
          </Section>

          <Section
            title="One-time purchase online"
            className="bg-gray-50 rounded-md border"
            contentClassName="pt-0 p-4"
          >
            <FormField
              label="Account Limits"
              type="number"
              name="purchaseLimit"
              value={purchaseLimit}
              onChange={(val: string) => setPurchaseLimit(val)}
              min="0"
              max="5000"
              step="50"
              required
            />
            <ProgressBar value={purchaseLimit} />
            <div className="text-sm text-right text-gray-600 mt-1">
              ${purchaseLimit}.00 / $5000.00
            </div>
          </Section>

          <Section
            title="One-time p2p transfer"
            className="bg-gray-50 rounded-md border"
            contentClassName="pt-0 p-4"
          >
            <FormField
              label="Account Limits"
              type="number"
              name="p2pLimit"
              value={p2pLimit}
              onChange={(val: string) => setP2pLimit(val)}
              min="0"
              max="5000"
              step="50"
              required
            />
            <ProgressBar value={p2pLimit} />
            <div className="text-sm text-right text-gray-600 mt-1">
              ${p2pLimit}.00 / $5000.00
            </div>
          </Section>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-4">
          <Button
            className="bg-blue-700 text-white px-6 py-2 rounded"
            onClick={handleSave}
          >
            Save Changes
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default PaymentLimits;
