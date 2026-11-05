import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const CustomerManagement: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Customer Management</h1>
        <p className="text-gray-600">
          Manage customer accounts and information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
          <CardDescription>
            Coming soon - Customer management features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            This component will include customer enrollment, account management,
            and customer relationship features.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerManagement;
