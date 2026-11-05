import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  ArrowRightLeft,
  Eye,
  Download,
} from 'lucide-react';

const CustomerDashboard: React.FC = () => {
  // Mock customer data
  const accountData = {
    totalBalance: 125000,
    savingsBalance: 85000,
    checkingBalance: 40000,
    recentTransactions: [
      {
        id: 1,
        description: 'Salary Credit',
        amount: 50000,
        type: 'credit',
        date: '2024-01-15',
      },
      {
        id: 2,
        description: 'ATM Withdrawal',
        amount: 5000,
        type: 'debit',
        date: '2024-01-14',
      },
      {
        id: 3,
        description: 'Online Transfer',
        amount: 10000,
        type: 'debit',
        date: '2024-01-13',
      },
    ],
  };

  const quickActions = [
    {
      title: 'Transfer Money',
      description: 'Send money to other accounts',
      icon: ArrowRightLeft,
      href: '/customer/transfer',
    },
    {
      title: 'View Statements',
      description: 'Download account statements',
      icon: Download,
      href: '/customer/statements',
    },
    {
      title: 'Transaction History',
      description: 'View all transactions',
      icon: Eye,
      href: '/customer/transactions',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
        <p className="text-blue-100">
          Manage your accounts and banking services
        </p>
      </div>

      {/* Account Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{accountData.totalBalance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Savings Account
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{accountData.savingsBalance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Account ending in 1234
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Checking Account
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{accountData.checkingBalance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Account ending in 5678
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common banking tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickActions.map(action => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.title}
                    variant="outline"
                    className="w-full justify-start h-auto p-4"
                    onClick={() => {
                      // Navigate to action href
                      console.log(`Navigate to ${action.href}`);
                    }}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {action.description}
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest account activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accountData.recentTransactions.map(transaction => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div
                    className={`font-medium ${
                      transaction.type === 'credit'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'credit' ? '+' : '-'}₹
                    {transaction.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Transactions
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;
