import React from 'react';
import { Card, NavbarColorPicker } from '@/components/ui';
import { ErrorBoundary } from '@/components/common';
import DashboardLayout from '@/layouts/DashboardLayout';

const SettingsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="container-responsive py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your account preferences and settings
          </p>
        </div>

        {/* Settings Content */}
        <ErrorBoundary>
          <div className="space-y-8">
            {/* Navbar Color Settings */}
            <NavbarColorPicker />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Profile Settings */}
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Profile Settings
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Update Profile
                  </button>
                </div>
              </Card>

              {/* Security Settings */}
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Security Settings
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                    Change Password
                  </button>
                </div>
              </Card>

              {/* Notification Settings */}
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Notification Settings
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Email Notifications
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive notifications via email
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded"
                      defaultChecked
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        SMS Notifications
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive notifications via SMS
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Transaction Alerts
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Get notified about transactions
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded"
                      defaultChecked
                    />
                  </div>
                </div>
              </Card>

              {/* Privacy Settings */}
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Privacy Settings
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Profile Visibility
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Make your profile visible to other users
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Data Analytics
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Allow data to be used for analytics
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded"
                      defaultChecked
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Marketing Emails
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive marketing and promotional emails
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </ErrorBoundary>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
