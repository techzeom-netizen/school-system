import React, { useState } from 'react';
import { Button } from '../ui';
import FormField from '../common/FormField';
import { LoginCredentials, LoginType } from '../../types';

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  type?: LoginType;
  initialValues?: Partial<LoginCredentials>;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
  type = 'Employee',
  initialValues,
}) => {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
    type,
    rememberMe: false,
    ...initialValues,
  });
  const [validationErrors, setValidationErrors] = useState<
    Partial<LoginCredentials>
  >({});

  const update = (field: 'email' | 'password', value: string) => {
    setFormData(previous => ({ ...previous, [field]: value }));
    setValidationErrors(previous => ({ ...previous, [field]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Partial<LoginCredentials> = {};
    if (!formData.email) nextErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nextErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) nextErrors.password = 'Password is required';
    else if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
    }
    setValidationErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) await onSubmit(formData);
  };

  return (
    <div className="w-full">
      {error && (
        <div
          className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Email Address"
          type="email"
          name="login-email"
          value={formData.email}
          onChange={value => update('email', value)}
          error={validationErrors.email}
          placeholder="Enter your email"
          required
        />
        <FormField
          label="Password"
          type="password"
          name="login-password"
          value={formData.password}
          onChange={value => update('password', value)}
          error={validationErrors.password}
          placeholder="Enter your password"
          required
        />
        <FormField
          label="Remember me"
          type="checkbox"
          name="login-remember"
          value={!!formData.rememberMe}
          onCheckboxChange={checked =>
            setFormData(previous => ({ ...previous, rememberMe: checked }))
          }
        />
        <Button
          type="submit"
          className="h-12 w-full text-base font-semibold"
          isLoading={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
