import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormField } from '@/components/common';
import Section from '@/components/common/Section';
import { UserPlus } from 'lucide-react';
import { handleApiError, showSuccessToast } from '@/lib/utils';
import {
  ADMIN_ROLES,
  ADMIN_STATUS,
  COUNTRIES,
  INDIAN_STATES,
} from '@/constants/companyTypes';

interface AdminFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;

  // Address Information
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;

  // Professional Information
  employeeId: string;
  department: string;
  designation: string;
  joiningDate: string;
  role: string;
  status: string;

  // Account Information
  username: string;
  password: string;
  confirmPassword: string;

  // Company Assignment
  companyId: string;
  companyName: string;

  // Permissions
  permissions: string[];

  // Additional Information
  notes: string;
}

const AdminCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<AdminFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    country: 'IN',
    pincode: '',
    employeeId: '',
    department: '',
    designation: '',
    joiningDate: '',
    role: '',
    status: 'pending_activation',
    username: '',
    password: '',
    confirmPassword: '',
    companyId: '',
    companyName: '',
    permissions: [],
    notes: '',
  });

  // Mock companies data
  const mockCompanies = [
    { id: '1', name: 'Sangamam Financial Services' },
    { id: '2', name: 'Green Valley Credit Union' },
    { id: '3', name: 'Rural Development Bank' },
    { id: '4', name: 'TechFin Solutions' },
    { id: '5', name: 'Community Savings Bank' },
  ];

  // Handle form input changes
  const handleInputChange = useCallback(
    (field: keyof AdminFormData, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    },
    []
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate password confirmation
      if (formData.password !== formData.confirmPassword) {
        showSuccessToast('Passwords do not match');
        return;
      }

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate successful submission
        showSuccessToast('Admin created successfully!');

        // Redirect to admin list
        navigate('/dashboard/super-admin/admins');
      } catch (error) {
        handleApiError(error, 'Failed to create admin. Please try again.');
      }
    },
    [formData, navigate]
  );

  return (
    <>
      <Section title="Create Admin" menuId="create-admin" showBreadcrumbs>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Information */}
          <Section
            title="Personal Information"
            contentClassName="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <FormField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={(value: string) =>
                handleInputChange('firstName', value)
              }
              placeholder="Enter first name"
              required
              maxLength={50}
            />

            <FormField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={(value: string) => handleInputChange('lastName', value)}
              placeholder="Enter last name"
              required
              maxLength={50}
            />

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
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(value: string) =>
                handleInputChange('dateOfBirth', value)
              }
              required
            />

            <FormField
              label="Gender"
              name="gender"
              type="select"
              value={formData.gender}
              onChange={(value: string) => handleInputChange('gender', value)}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ]}
              required
            />
          </Section>

          {/* Address Information */}
          <Section
            title="Address Information"
            className="mt-4"
            contentClassName="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
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

          {/* Professional Information */}
          <Section
            title="Professional Information"
            className="mt-4"
            contentClassName="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <FormField
              label="Employee ID"
              name="employeeId"
              value={formData.employeeId}
              onChange={(value: string) =>
                handleInputChange('employeeId', value)
              }
              placeholder="Enter employee ID"
              required
              maxLength={20}
            />

            <FormField
              label="Department"
              name="department"
              value={formData.department}
              onChange={(value: string) =>
                handleInputChange('department', value)
              }
              placeholder="Enter department"
              required
              maxLength={50}
            />

            <FormField
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={(value: string) =>
                handleInputChange('designation', value)
              }
              placeholder="Enter designation"
              required
              maxLength={50}
            />

            <FormField
              label="Joining Date"
              name="joiningDate"
              type="date"
              value={formData.joiningDate}
              onChange={(value: string) =>
                handleInputChange('joiningDate', value)
              }
              required
            />

            <FormField
              label="Role"
              name="role"
              type="select"
              value={formData.role}
              onChange={(value: string) => handleInputChange('role', value)}
              options={[...ADMIN_ROLES]}
              required
            />

            <FormField
              label="Status"
              name="status"
              type="select"
              value={formData.status}
              onChange={(value: string) => handleInputChange('status', value)}
              options={[...ADMIN_STATUS]}
              required
            />
          </Section>

          {/* Company Assignment */}
          <Section
            title="Company Assignment"
            className="mt-4"
            contentClassName="space-y-6"
          >
            <div className="space-y-2 select-container">
              <Label
                htmlFor="companyId"
                className="text-gray-700 dark:text-gray-300"
              >
                Assign to Company <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.companyId}
                onValueChange={(value: string) => {
                  const company = mockCompanies.find(c => c.id === value);
                  handleInputChange('companyId', value);
                  handleInputChange('companyName', company?.name || '');
                }}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {mockCompanies.map(company => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Section>

          {/* Account Information */}
          <Section
            title="Account Information"
            className="mt-4"
            contentClassName="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <FormField
              label="Username"
              name="username"
              value={formData.username}
              onChange={(value: string) => handleInputChange('username', value)}
              placeholder="Enter username"
              required
              maxLength={50}
            />

            <FormField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={(value: string) => handleInputChange('password', value)}
              placeholder="Enter password"
              required
              minLength={8}
            />

            <FormField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(value: string) =>
                handleInputChange('confirmPassword', value)
              }
              placeholder="Confirm password"
              required
              minLength={8}
            />
          </Section>

          {/* Additional Information */}
          <Section
            title="Additional Information"
            className="mt-4"
            contentClassName="space-y-6"
          >
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
              onClick={() => navigate('/dashboard/super-admin/admins')}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Create Admin
            </Button>
          </div>
        </form>
      </Section>
    </>
  );
};

export default AdminCreatePage;
