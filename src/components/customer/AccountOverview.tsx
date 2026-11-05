import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const AccountOverview: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Accounts</h1>
        <p className="text-gray-600">View and manage your bank accounts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Overview</CardTitle>
          <CardDescription>
            Coming soon - Account management features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            This component will include account balances, account details, and
            account management features.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountOverview;
