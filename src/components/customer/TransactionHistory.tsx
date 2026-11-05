import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const TransactionHistory: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Transaction History</h1>
        <p className="text-gray-600">
          View your transaction history and statements
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Coming soon - Transaction history features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            This component will include transaction history, statements, and
            transaction search functionality.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionHistory;
