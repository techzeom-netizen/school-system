import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/common';
import Section from '@/components/common/Section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  Database,
  FileText,
  Save,
  Globe,
  CheckCircle,
} from 'lucide-react';

const SystemSettings: React.FC = () => {
  const [globalSettings, setGlobalSettings] = useState({
    platformName: 'Sangamam Banking Platform',
    defaultLanguage: 'en',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    currency: 'INR',
    maxLoginAttempts: 5,
    sessionTimeout: 30,
  });

  const [securitySettings, setSecuritySettings] = useState({
    requireTwoFactor: false,
    passwordMinLength: 8,
    passwordRequireSpecialChars: true,
    passwordRequireNumbers: true,
    passwordRequireUppercase: true,
    accountLockoutDuration: 15,
    enableAuditLog: true,
    enableIpWhitelist: false,
  });

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    backupRetention: 30,
    backupLocation: '/backups',
    enableCloudBackup: false,
    cloudProvider: 'aws',
    lastBackup: '2024-01-20 03:00:00',
  });

  const handleSaveGlobal = () => {
    // eslint-disable-next-line no-console
    console.log('Saving global settings:', globalSettings);
    // Here you would save to backend
  };

  const handleSaveSecurity = () => {
    // eslint-disable-next-line no-console
    console.log('Saving security settings:', securitySettings);
    // Here you would save to backend
  };

  const handleSaveBackup = () => {
    // eslint-disable-next-line no-console
    console.log('Saving backup settings:', backupSettings);
    // Here you would save to backend
  };

  const runBackup = () => {
    // eslint-disable-next-line no-console
    console.log('Running manual backup...');
    // Here you would trigger backup
  };

  return (
    <Section title="System Settings" menuId="system-settings" showBreadcrumbs>
      <p className="text-sm text-gray-600 pb-3">
        Configure platform-wide settings and policies
      </p>

      <Tabs defaultValue="global" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="global" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Global
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Backup
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Audit
          </TabsTrigger>
        </TabsList>

        {/* Global Settings */}
        <TabsContent value="global" className="space-y-6">
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase text-gray-700">
              <Globe className="h-4 w-4" />
              Global Platform Settings
            </div>
            <p className="text-sm text-gray-500">
              Configure platform-wide settings and preferences
            </p>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Platform Name"
                name="platformName"
                value={globalSettings.platformName}
                onChange={value =>
                  setGlobalSettings(prev => ({
                    ...prev,
                    platformName: value,
                  }))
                }
              />
              <FormField
                label="Default Language"
                name="defaultLanguage"
                type="select"
                value={globalSettings.defaultLanguage}
                onChange={value =>
                  setGlobalSettings(prev => ({
                    ...prev,
                    defaultLanguage: value,
                  }))
                }
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'hi', label: 'Hindi' },
                  { value: 'kn', label: 'Kannada' },
                  { value: 'ta', label: 'Tamil' },
                  { value: 'te', label: 'Telugu' },
                ]}
              />
              <FormField
                label="Timezone"
                name="timezone"
                type="select"
                value={globalSettings.timezone}
                onChange={value =>
                  setGlobalSettings(prev => ({
                    ...prev,
                    timezone: value,
                  }))
                }
                options={[
                  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
                  { value: 'UTC', label: 'UTC' },
                  {
                    value: 'America/New_York',
                    label: 'America/New_York (EST)',
                  },
                ]}
              />
              <FormField
                label="Currency"
                name="currency"
                type="select"
                value={globalSettings.currency}
                onChange={value =>
                  setGlobalSettings(prev => ({
                    ...prev,
                    currency: value,
                  }))
                }
                options={[
                  { value: 'INR', label: 'Indian Rupee (₹)' },
                  { value: 'USD', label: 'US Dollar ($)' },
                  { value: 'EUR', label: 'Euro (€)' },
                ]}
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSaveGlobal}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Global Settings
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase text-gray-700">
              <Shield className="h-4 w-4" />
              Security Policies
            </div>
            <p className="text-sm text-gray-500">
              Configure security settings and authentication policies
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium">
                    Require Two-Factor Authentication
                  </label>
                  <p className="text-sm text-gray-500">
                    Force 2FA for all admin accounts
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={securitySettings.requireTwoFactor}
                  onChange={e =>
                    setSecuritySettings(prev => ({
                      ...prev,
                      requireTwoFactor: e.target.checked,
                    }))
                  }
                  className="h-4 w-4"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Minimum Password Length"
                  name="passwordMinLength"
                  type="number"
                  value={securitySettings.passwordMinLength.toString()}
                  onChange={value =>
                    setSecuritySettings(prev => ({
                      ...prev,
                      passwordMinLength: parseInt(value, 10) || 0,
                    }))
                  }
                  min="4"
                />
                <FormField
                  label="Account Lockout Duration (minutes)"
                  name="accountLockoutDuration"
                  type="number"
                  value={securitySettings.accountLockoutDuration.toString()}
                  onChange={value =>
                    setSecuritySettings(prev => ({
                      ...prev,
                      accountLockoutDuration: parseInt(value, 10) || 0,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Require Special Characters
                  </label>
                  <input
                    type="checkbox"
                    checked={securitySettings.passwordRequireSpecialChars}
                    onChange={e =>
                      setSecuritySettings(prev => ({
                        ...prev,
                        passwordRequireSpecialChars: e.target.checked,
                      }))
                    }
                    className="h-4 w-4"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Require Numbers</label>
                  <input
                    type="checkbox"
                    checked={securitySettings.passwordRequireNumbers}
                    onChange={e =>
                      setSecuritySettings(prev => ({
                        ...prev,
                        passwordRequireNumbers: e.target.checked,
                      }))
                    }
                    className="h-4 w-4"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Require Uppercase Letters
                  </label>
                  <input
                    type="checkbox"
                    checked={securitySettings.passwordRequireUppercase}
                    onChange={e =>
                      setSecuritySettings(prev => ({
                        ...prev,
                        passwordRequireUppercase: e.target.checked,
                      }))
                    }
                    className="h-4 w-4"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium">
                    Enable Audit Logging
                  </label>
                  <p className="text-sm text-gray-500">
                    Log all system activities
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={securitySettings.enableAuditLog}
                  onChange={e =>
                    setSecuritySettings(prev => ({
                      ...prev,
                      enableAuditLog: e.target.checked,
                    }))
                  }
                  className="h-4 w-4"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSaveSecurity}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Security Settings
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Backup Settings */}
        <TabsContent value="backup" className="space-y-6">
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase text-gray-700">
              <Database className="h-4 w-4" />
              Backup & Recovery
            </div>
            <p className="text-sm text-gray-500">
              Configure automatic backups and recovery options
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium">
                    Enable Automatic Backups
                  </label>
                  <p className="text-sm text-gray-500">
                    Automatically backup system data
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={backupSettings.autoBackup}
                  onChange={e =>
                    setBackupSettings(prev => ({
                      ...prev,
                      autoBackup: e.target.checked,
                    }))
                  }
                  className="h-4 w-4"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Backup Frequency"
                  name="backupFrequency"
                  type="select"
                  value={backupSettings.backupFrequency}
                  onChange={value =>
                    setBackupSettings(prev => ({
                      ...prev,
                      backupFrequency: value,
                    }))
                  }
                  options={[
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'monthly', label: 'Monthly' },
                  ]}
                />
                <FormField
                  label="Retention Period (days)"
                  name="backupRetention"
                  type="number"
                  value={backupSettings.backupRetention.toString()}
                  onChange={value =>
                    setBackupSettings(prev => ({
                      ...prev,
                      backupRetention: parseInt(value, 10) || 0,
                    }))
                  }
                />
              </div>

              <FormField
                label="Backup Location"
                name="backupLocation"
                value={backupSettings.backupLocation}
                onChange={value =>
                  setBackupSettings(prev => ({
                    ...prev,
                    backupLocation: value,
                  }))
                }
              />

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium">
                    Enable Cloud Backup
                  </label>
                  <p className="text-sm text-gray-500">
                    Store backups in cloud storage
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={backupSettings.enableCloudBackup}
                  onChange={e =>
                    setBackupSettings(prev => ({
                      ...prev,
                      enableCloudBackup: e.target.checked,
                    }))
                  }
                  className="h-4 w-4"
                />
              </div>

              {backupSettings.enableCloudBackup && (
                <FormField
                  label="Cloud Provider"
                  name="cloudProvider"
                  type="select"
                  value={backupSettings.cloudProvider}
                  onChange={value =>
                    setBackupSettings(prev => ({
                      ...prev,
                      cloudProvider: value,
                    }))
                  }
                  options={[
                    { value: 'aws', label: 'Amazon Web Services' },
                    { value: 'gcp', label: 'Google Cloud Platform' },
                    { value: 'azure', label: 'Microsoft Azure' },
                  ]}
                />
              )}

              <div className="rounded-lg bg-green-50 p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">
                    Last Backup
                  </span>
                </div>
                <p className="text-green-700 mt-1">
                  {backupSettings.lastBackup}
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={runBackup}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Run Manual Backup
              </Button>
              <Button
                onClick={handleSaveBackup}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Backup Settings
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Audit Trail */}
        <TabsContent value="audit" className="space-y-6">
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase text-gray-700">
              <FileText className="h-4 w-4" />
              Audit Logs
            </div>
            <p className="text-sm text-gray-500">
              View and manage system audit logs
            </p>
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Audit Logs
              </h3>
              <p className="text-gray-500">
                Audit log viewer and management features coming soon...
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Section>
  );
};

export default SystemSettings;
