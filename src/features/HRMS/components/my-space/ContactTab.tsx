import { useState } from 'react';

import Section from '@/components/common/Section';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import { showSuccessToast } from '@/lib/utils';

const initialValues = {
  email: '',
  phone: '',
  alternatePhone: '',
  address: '',
  city: '',
  postalCode: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
};

const ContactTab = () => {
  const [values, setValues] = useState(initialValues);

  const updateField = (field: keyof typeof initialValues, value: string) => {
    setValues(current => ({ ...current, [field]: value }));
  };

  const handleSaveChanges = () => {
    showSuccessToast('Contact details saved successfully');
  };

  return (
    <>
      <Section title="Contact Information">
        <div className="mb-4 flex justify-end">
          <Button type="button" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </div>

        <div className="grid gap-4 p-4 md:grid-cols-2">
          <FormField
            label="Email Address"
            name="email"
            type="email"
            value={values.email}
            onChange={value => updateField('email', value)}
            placeholder="Enter email address"
          />
          <FormField
            label="Phone Number"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={value => updateField('phone', value)}
            placeholder="Enter phone number"
          />
          <FormField
            label="Alternate Phone"
            name="alternatePhone"
            type="tel"
            value={values.alternatePhone}
            onChange={value => updateField('alternatePhone', value)}
            placeholder="Enter alternate phone"
          />
          <FormField
            label="Street Address"
            name="address"
            value={values.address}
            onChange={value => updateField('address', value)}
            placeholder="Enter street address"
          />
          <FormField
            label="City"
            name="city"
            value={values.city}
            onChange={value => updateField('city', value)}
            placeholder="Enter city"
          />
          <FormField
            label="Postal Code"
            name="postalCode"
            value={values.postalCode}
            onChange={value => updateField('postalCode', value)}
            placeholder="Enter postal code"
          />
          <FormField
            label="Emergency Contact Name"
            name="emergencyContactName"
            value={values.emergencyContactName}
            onChange={value => updateField('emergencyContactName', value)}
            placeholder="Enter emergency contact name"
          />
          <FormField
            label="Emergency Contact Phone"
            name="emergencyContactPhone"
            type="tel"
            value={values.emergencyContactPhone}
            onChange={value => updateField('emergencyContactPhone', value)}
            placeholder="Enter emergency contact phone"
          />
        </div>
      </Section>
    </>
  );
};

export default ContactTab;
