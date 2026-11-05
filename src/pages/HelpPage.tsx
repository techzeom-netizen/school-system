import React from 'react';
import { Card } from '@/components/ui';
import { ErrorBoundary } from '@/components/common';
import DashboardLayout from '@/layouts/DashboardLayout';

const HelpPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Help & Support
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Get help and support for your banking needs
          </p>
        </div>

        {/* Help Content */}
        <ErrorBoundary>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* FAQ */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    How do I transfer money between accounts?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You can transfer money by going to the Transfer section in
                    your dashboard and selecting the accounts you want to
                    transfer between.
                  </p>
                </div>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    How do I view my transaction history?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Navigate to the Transactions page to view your complete
                    transaction history with filtering and search options.
                  </p>
                </div>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    How do I change my password?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Go to Settings &gt; Security Settings to change your
                    password. Make sure to use a strong password.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    How do I contact customer support?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You can contact our customer support team 24/7 through the
                    support chat or by calling our toll-free number.
                  </p>
                </div>
              </div>
            </Card>

            {/* Contact Support */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Contact Support
              </h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Phone Support
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      1-800-226-5437
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Available 24/7
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Live Chat
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Start a conversation
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Average response: 2 minutes
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Email Support
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      support@sangamambank.com
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Response within 24 hours
                    </p>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Start Live Chat
                </button>
              </div>
            </Card>
          </div>
        </ErrorBoundary>
      </div>
    </DashboardLayout>
  );
};

export default HelpPage;
