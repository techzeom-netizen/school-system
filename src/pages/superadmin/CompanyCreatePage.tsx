import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/common';
import Section from '@/components/common/Section';
import { Save } from 'lucide-react';
import { showSuccessToast } from '@/lib/utils';
import {
  COMPANY_TYPES,
  BUSINESS_TYPES,
  INDUSTRIES,
  COUNTRIES,
  INDIAN_STATES,
  FONT_FAMILIES,
} from '@/constants/companyTypes';
import { useAppDispatch } from '@/redux/store';
import { createAdminCompany } from '@/redux/slices/company.slice';

interface CompanyFormData {
  // Basic Information
  companyName: string;
  companyType: string;
  businessType: string;
  industry: string;
  registrationNumber: string;
  panNumber: string;
  gstNumber: string;
  incorporationDate: string;

  // Contact Information
  email: string;
  phone: string;
  website: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;

  // Branding
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logo: string;

  // System Configuration
  domain: string;
  subdomain: string;
  timezone: string;
  currency: string;
  language: string;

  // Additional Information
  description: string;
  notes: string;
}

const CompanyCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [formData, setFormData] = useState<CompanyFormData>({
    companyName: '',
    companyType: '',
    businessType: '',
    industry: '',
    registrationNumber: '',
    panNumber: '',
    gstNumber: '',
    incorporationDate: '',
    email: '',
    phone: '',
    website: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    country: 'IN',
    pincode: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    fontFamily: 'Inter',
    logo: '',
    domain: '',
    subdomain: '',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    language: 'en',
    description: '',
    notes: '',
  });
  // Handle form input changes
  const handleInputChange = useCallback(
    (field: keyof CompanyFormData, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    },
    []
  );

  // Handle logo file upload
  const handleLogoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setLogoPreview(base64String);
          setFormData(prev => ({ ...prev, logo: base64String }));
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );
  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await dispatch(createAdminCompany(formData)).unwrap();
      showSuccessToast('Company created successfully!');
      navigate('/dashboard/super-admin/companies');
    },
    [formData, navigate, dispatch]
  );

  return (
    <Section title="Create Company" menuId="create-company" showBreadcrumbs>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Information */}
        <Section
          title="Basic Information"
          contentClassName="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <FormField
            label="Company Name"
            name="companyName"
            value={formData.companyName}
            onChange={(value: string) =>
              handleInputChange('companyName', value)
            }
            placeholder="Enter company name"
            required
            maxLength={100}
          />

          <FormField
            label="Company Type"
            name="companyType"
            type="select"
            value={formData.companyType}
            onChange={(value: string) =>
              handleInputChange('companyType', value)
            }
            options={[...COMPANY_TYPES]}
            required
          />

          <FormField
            label="Business Type"
            name="businessType"
            type="select"
            value={formData.businessType}
            onChange={(value: string) =>
              handleInputChange('businessType', value)
            }
            options={[...BUSINESS_TYPES]}
            required
          />

          <FormField
            label="Industry"
            name="industry"
            type="select"
            value={formData.industry}
            onChange={(value: string) => handleInputChange('industry', value)}
            options={[...INDUSTRIES]}
            required
          />

          <FormField
            label="Registration Number"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={(value: string) =>
              handleInputChange('registrationNumber', value)
            }
            placeholder="Enter registration number"
            required
            maxLength={50}
          />

          <FormField
            label="PAN Number"
            name="panNumber"
            value={formData.panNumber}
            onChange={(value: string) => handleInputChange('panNumber', value)}
            placeholder="Enter PAN number"
            required
            maxLength={10}
            pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
          />

          <FormField
            label="GST Number"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={(value: string) => handleInputChange('gstNumber', value)}
            placeholder="Enter GST number"
            maxLength={15}
          />

          <FormField
            label="Incorporation Date"
            name="incorporationDate"
            type="date"
            value={formData.incorporationDate}
            onChange={(value: string) =>
              handleInputChange('incorporationDate', value)
            }
            required
          />
        </Section>

        {/* Contact Information */}
        <Section
          title="Contact Information"
          contentClassName="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <FormField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(value: string) => handleInputChange('email', value)}
            placeholder="Enter email address"
            required
          />

          <FormField
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={(value: string) => handleInputChange('phone', value)}
            placeholder="Enter phone number"
            required
          />

          <FormField
            label="Website"
            name="website"
            type="url"
            value={formData.website}
            onChange={(value: string) => handleInputChange('website', value)}
            placeholder="Enter website URL"
          />

          <FormField
            label="Address Line 1"
            name="address1"
            value={formData.address1}
            onChange={(value: string) => handleInputChange('address1', value)}
            placeholder="Enter address line 1"
            required
          />

          <FormField
            label="Address Line 2"
            name="address2"
            value={formData.address2}
            onChange={(value: string) => handleInputChange('address2', value)}
            placeholder="Enter address line 2"
          />

          <FormField
            label="City"
            name="city"
            value={formData.city}
            onChange={(value: string) => handleInputChange('city', value)}
            placeholder="Enter city"
            required
          />

          <FormField
            label="State"
            name="state"
            type="select"
            value={formData.state}
            onChange={(value: string) => handleInputChange('state', value)}
            options={[...INDIAN_STATES]}
            required
          />

          <FormField
            label="Country"
            name="country"
            type="select"
            value={formData.country}
            onChange={(value: string) => handleInputChange('country', value)}
            options={[...COUNTRIES]}
            required
          />

          <FormField
            label="Pincode"
            name="pincode"
            value={formData.pincode}
            onChange={(value: string) => handleInputChange('pincode', value)}
            placeholder="Enter pincode"
            required
            maxLength={6}
          />
        </Section>

        {/* Branding */}
        <Section
          title="Branding & Theme"
          contentClassName="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <FormField
            label="Primary Color"
            name="primaryColor"
            type="color"
            value={formData.primaryColor}
            onChange={(value: string) =>
              handleInputChange('primaryColor', value)
            }
            placeholder="#3b82f6"
            required
          />

          <FormField
            label="Secondary Color"
            name="secondaryColor"
            type="color"
            value={formData.secondaryColor}
            onChange={(value: string) =>
              handleInputChange('secondaryColor', value)
            }
            placeholder="Select primary color"
            required
          />
          <FormField
            label="Font Family"
            name="fontFamily"
            type="select"
            value={formData.fontFamily}
            onChange={(value: string) => handleInputChange('fontFamily', value)}
            options={[...FONT_FAMILIES]}
            required
          />

          <FormField
            label="Company Logo"
            name="logo"
            type="file"
            value={formData.logo}
            onFileChange={handleLogoUpload}
            accept="image/*"
            previewUrl={logoPreview}
          />
        </Section>
        {/* System Configuration */}
        <Section
          title="System Configuration"
          contentClassName="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <FormField
            label="Domain"
            name="domain"
            value={formData.domain}
            onChange={(value: string) => handleInputChange('domain', value)}
            placeholder="Enter domain name"
            required
          />

          <FormField
            label="Subdomain"
            name="subdomain"
            value={formData.subdomain}
            onChange={(value: string) => handleInputChange('subdomain', value)}
            placeholder="Enter subdomain"
          />

          <FormField
            label="Timezone"
            name="timezone"
            value={formData.timezone}
            onChange={(value: string) => handleInputChange('timezone', value)}
            placeholder="Asia/Kolkata"
            required
          />

          <FormField
            label="Currency"
            name="currency"
            value={formData.currency}
            onChange={(value: string) => handleInputChange('currency', value)}
            placeholder="INR"
            required
          />
        </Section>

        {/* Additional Information */}
        <Section title="Additional Information" contentClassName="space-y-6">
          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={(value: string) =>
              handleInputChange('description', value)
            }
            placeholder="Enter company description"
            rows={4}
          />

          <FormField
            label="Notes"
            name="notes"
            type="textarea"
            value={formData.notes}
            onChange={(value: string) => handleInputChange('notes', value)}
            placeholder="Enter any additional notes"
            rows={3}
          />
        </Section>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard/super-admin/companies')}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Create Company
          </Button>
        </div>
      </form>
    </Section>
  );
};

export default CompanyCreatePage;
