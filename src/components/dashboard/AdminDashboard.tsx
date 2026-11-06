import React, { useState } from 'react';
import { DashboardSection, QuickActions, RecentActivity } from '../common';
import {
  Button,
  ChartContainer,
  BarChartComponent,
  LineChartComponent,
} from '@/components/ui';
import {
  Users,
  PiggyBank,
  Building2,
  Clock,
  TrendingUp,
  Gem,
  CreditCard,
  UserCheck,
  FileText,
  Settings,
  BarChart3,
  Calendar,
  Activity,
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  // Chart filter state
  const [chartFilter, setChartFilter] = useState<
    '15days' | 'week' | 'month' | 'year'
  >('month');

  // Banking stats data
  const statsData = [
    {
      title: 'Members Count',
      value: '12,847',
      icon: <Users className="w-6 h-6" />,
      iconBgColor: 'bg-blue-100 dark:bg-blue-900/20',
      iconColor: 'text-blue-600',
      change: { value: '+245', type: 'increase' as const },
    },
    {
      title: 'SB Accounts',
      value: '8,923',
      icon: <PiggyBank className="w-6 h-6" />,
      iconBgColor: 'bg-green-100 dark:bg-green-900/20',
      iconColor: 'text-green-600',
      change: { value: '+156', type: 'increase' as const },
    },
    {
      title: 'Current Account',
      value: '2,341',
      icon: <Building2 className="w-6 h-6" />,
      iconBgColor: 'bg-purple-100 dark:bg-purple-900/20',
      iconColor: 'text-purple-600',
      change: { value: '+89', type: 'increase' as const },
    },
    {
      title: 'RD Account',
      value: '3,567',
      icon: <Clock className="w-6 h-6" />,
      iconBgColor: 'bg-orange-100 dark:bg-orange-900/20',
      iconColor: 'text-orange-600',
      change: { value: '+234', type: 'increase' as const },
    },
    {
      title: 'FD Account',
      value: '1,892',
      icon: <TrendingUp className="w-6 h-6" />,
      iconBgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
      iconColor: 'text-indigo-600',
      change: { value: '+67', type: 'increase' as const },
    },
    {
      title: 'MIS Account',
      value: '1,456',
      icon: <CreditCard className="w-6 h-6" />,
      iconBgColor: 'bg-cyan-100 dark:bg-cyan-900/20',
      iconColor: 'text-cyan-600',
      change: { value: '+123', type: 'increase' as const },
    },
    {
      title: 'Pigmy Account',
      value: '4,123',
      icon: <PiggyBank className="w-6 h-6" />,
      iconBgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
      iconColor: 'text-emerald-600',
      change: { value: '+178', type: 'increase' as const },
    },
    {
      title: 'Individual Loan',
      value: '2,847',
      icon: <UserCheck className="w-6 h-6" />,
      iconBgColor: 'bg-red-100 dark:bg-red-900/20',
      iconColor: 'text-red-600',
      change: { value: '+45', type: 'increase' as const },
    },
    {
      title: 'Gold Loan',
      value: '1,234',
      icon: <Gem className="w-6 h-6" />,
      iconBgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      iconColor: 'text-yellow-600',
      change: { value: '+34', type: 'increase' as const },
    },
    {
      title: 'Group Loan',
      value: '567',
      icon: <Users className="w-6 h-6" />,
      iconBgColor: 'bg-teal-100 dark:bg-teal-900/20',
      iconColor: 'text-teal-600',
      change: { value: '+23', type: 'increase' as const },
    },
  ];

  // Quick actions data
  const quickActions = [
    {
      id: 'account-management',
      title: 'Account Management',
      description: 'Manage all account types and transactions',
      icon: <PiggyBank className="w-6 h-6" />,
      onClick: () => {
        // Navigate to account management
      },
    },
    {
      id: 'loan-management',
      title: 'Loan Management',
      description: 'Process and manage loan applications',
      icon: <CreditCard className="w-6 h-6" />,
      onClick: () => {
        // Navigate to loan management
      },
    },
    {
      id: 'customer-management',
      title: 'Customer Management',
      description: 'Manage customer profiles and accounts',
      icon: <Users className="w-6 h-6" />,
      onClick: () => {
        // Navigate to customer management
      },
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      description: 'View detailed reports and analytics',
      icon: <BarChart3 className="w-6 h-6" />,
      onClick: () => {
        // Navigate to reports
      },
    },
    {
      id: 'transactions',
      title: 'Transaction History',
      description: 'View and manage all transactions',
      icon: <FileText className="w-6 h-6" />,
      onClick: () => {
        // Navigate to transactions
      },
    },
    {
      id: 'system-settings',
      title: 'System Settings',
      description: 'Configure banking system settings',
      icon: <Settings className="w-6 h-6" />,
      onClick: () => {
        // Navigate to system settings
      },
    },
  ];

  // Recent activities data
  const recentActivities = [
    {
      id: '1',
      title: 'New SB Account Created',
      description: 'Account opened for Priya Sharma (Account #SB123456)',
      time: '15 minutes ago',
      icon: <PiggyBank className="w-5 h-5" />,
      status: 'success' as const,
    },
    {
      id: '2',
      title: 'Individual Loan Approved',
      description: '₹5,00,000 loan approved for Rajesh Kumar',
      time: '1 hour ago',
      icon: <UserCheck className="w-5 h-5" />,
      status: 'info' as const,
    },
    {
      id: '3',
      title: 'FD Account Matured',
      description: 'Fixed Deposit #FD789012 matured for ₹2,50,000',
      time: '2 hours ago',
      icon: <TrendingUp className="w-5 h-5" />,
      status: 'success' as const,
    },
    {
      id: '4',
      title: 'Gold Loan Application',
      description: 'New gold loan application received from Sunita Devi',
      time: '3 hours ago',
      icon: <Gem className="w-5 h-5" />,
      status: 'warning' as const,
    },
    {
      id: '5',
      title: 'Group Loan Disbursed',
      description: '₹10,00,000 group loan disbursed to 25 members',
      time: '4 hours ago',
      icon: <Users className="w-5 h-5" />,
      status: 'success' as const,
    },
    {
      id: '6',
      title: 'RD Account Closure',
      description: 'Recurring Deposit #RD345678 closed by customer',
      time: '5 hours ago',
      icon: <Clock className="w-5 h-5" />,
      status: 'info' as const,
    },
  ];

  // Chart data based on filter
  const getChartData = () => {
    const baseData = {
      depositOverview: {
        '15days': [
          { type: 'SB Accounts', amount: 4500000, color: '#10b981' },
          { type: 'Current Account', amount: 2800000, color: '#8b5cf6' },
          { type: 'RD Account', amount: 3200000, color: '#f59e0b' },
          { type: 'FD Account', amount: 6800000, color: '#6366f1' },
          { type: 'MIS Account', amount: 2100000, color: '#06b6d4' },
          { type: 'Pigmy Account', amount: 1900000, color: '#059669' },
        ],
        week: [
          { type: 'SB Accounts', amount: 18500000, color: '#10b981' },
          { type: 'Current Account', amount: 12200000, color: '#8b5cf6' },
          { type: 'RD Account', amount: 15800000, color: '#f59e0b' },
          { type: 'FD Account', amount: 28900000, color: '#6366f1' },
          { type: 'MIS Account', amount: 8900000, color: '#06b6d4' },
          { type: 'Pigmy Account', amount: 7600000, color: '#059669' },
        ],
        month: [
          { type: 'SB Accounts', amount: 78500000, color: '#10b981' },
          { type: 'Current Account', amount: 52200000, color: '#8b5cf6' },
          { type: 'RD Account', amount: 65800000, color: '#f59e0b' },
          { type: 'FD Account', amount: 128900000, color: '#6366f1' },
          { type: 'MIS Account', amount: 38900000, color: '#06b6d4' },
          { type: 'Pigmy Account', amount: 35600000, color: '#059669' },
        ],
        year: [
          { type: 'SB Accounts', amount: 945000000, color: '#10b981' },
          { type: 'Current Account', amount: 622000000, color: '#8b5cf6' },
          { type: 'RD Account', amount: 758000000, color: '#f59e0b' },
          { type: 'FD Account', amount: 1589000000, color: '#6366f1' },
          { type: 'MIS Account', amount: 489000000, color: '#06b6d4' },
          { type: 'Pigmy Account', amount: 456000000, color: '#059669' },
        ],
      },
      loanOverview: {
        '15days': [
          { type: 'Individual Loan', amount: 2500000, color: '#ef4444' },
          { type: 'Gold Loan', amount: 1800000, color: '#f59e0b' },
          { type: 'Group Loan', amount: 1200000, color: '#14b8a6' },
        ],
        week: [
          { type: 'Individual Loan', amount: 10500000, color: '#ef4444' },
          { type: 'Gold Loan', amount: 7800000, color: '#f59e0b' },
          { type: 'Group Loan', amount: 5200000, color: '#14b8a6' },
        ],
        month: [
          { type: 'Individual Loan', amount: 45500000, color: '#ef4444' },
          { type: 'Gold Loan', amount: 33800000, color: '#f59e0b' },
          { type: 'Group Loan', amount: 22500000, color: '#14b8a6' },
        ],
        year: [
          { type: 'Individual Loan', amount: 545000000, color: '#ef4444' },
          { type: 'Gold Loan', amount: 408000000, color: '#f59e0b' },
          { type: 'Group Loan', amount: 275000000, color: '#14b8a6' },
        ],
      },
      transactionVolume: {
        '15days': [
          { day: 'Day 1', transactions: 245, amount: 1200000 },
          { day: 'Day 2', transactions: 289, amount: 1450000 },
          { day: 'Day 3', transactions: 312, amount: 1680000 },
          { day: 'Day 4', transactions: 278, amount: 1420000 },
          { day: 'Day 5', transactions: 334, amount: 1890000 },
          { day: 'Day 6', transactions: 298, amount: 1560000 },
          { day: 'Day 7', transactions: 367, amount: 2100000 },
          { day: 'Day 8', transactions: 289, amount: 1450000 },
          { day: 'Day 9', transactions: 356, amount: 1980000 },
          { day: 'Day 10', transactions: 312, amount: 1680000 },
          { day: 'Day 11', transactions: 378, amount: 2250000 },
          { day: 'Day 12', transactions: 345, amount: 1950000 },
          { day: 'Day 13', transactions: 298, amount: 1560000 },
          { day: 'Day 14', transactions: 367, amount: 2100000 },
          { day: 'Day 15', transactions: 389, amount: 2350000 },
        ],
        week: [
          { day: 'Mon', transactions: 1678, amount: 8900000 },
          { day: 'Tue', transactions: 1923, amount: 10200000 },
          { day: 'Wed', transactions: 2156, amount: 11800000 },
          { day: 'Thu', transactions: 1834, amount: 9500000 },
          { day: 'Fri', transactions: 2234, amount: 12800000 },
          { day: 'Sat', transactions: 1456, amount: 7200000 },
          { day: 'Sun', transactions: 1234, amount: 6100000 },
        ],
        month: [
          { day: 'Week 1', transactions: 12890, amount: 68500000 },
          { day: 'Week 2', transactions: 14567, amount: 78200000 },
          { day: 'Week 3', transactions: 13456, amount: 72800000 },
          { day: 'Week 4', transactions: 15678, amount: 84500000 },
        ],
        year: [
          { day: 'Q1', transactions: 45678, amount: 245000000 },
          { day: 'Q2', transactions: 52345, amount: 289000000 },
          { day: 'Q3', transactions: 49876, amount: 275000000 },
          { day: 'Q4', transactions: 56789, amount: 315000000 },
        ],
      },
    };
    return baseData;
  };

  const chartData = getChartData();

  // Filter buttons
  const filterButtons = [
    { key: '15days' as const, label: '15 Days' },
    { key: 'week' as const, label: 'Week' },
    { key: 'month' as const, label: 'Month' },
    { key: 'year' as const, label: 'Year' },
  ];

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else {
      return `₹${(amount / 1000).toFixed(0)}K`;
    }
  };

  // Chart data preparation functions
  const getDepositChartData = () => {
    return chartData.depositOverview[chartFilter].map(item => ({
      name: item.type,
      amount: item.amount,
      fill: item.color,
    }));
  };

  const getLoanChartData = () => {
    return chartData.loanOverview[chartFilter].map(item => ({
      name: item.type,
      amount: item.amount,
      fill: item.color,
    }));
  };

  const getTransactionChartData = () => {
    return chartData.transactionVolume[chartFilter].map(item => ({
      name: item.day,
      transactions: item.transactions,
      amount: item.amount,
    }));
  };

  const transactionLines = [
    {
      dataKey: 'transactions',
      stroke: '#aa394e',
      strokeWidth: 3,
      dot: { fill: '#aa394e', strokeWidth: 2, r: 4 },
      name: 'Transactions',
      yAxisId: 'left',
    },
    {
      dataKey: 'amount',
      stroke: '#10b981',
      strokeWidth: 3,
      dot: { fill: '#10b981', strokeWidth: 2, r: 4 },
      name: 'Amount',
      yAxisId: 'right',
    },
  ];

  return (
    <div className="min-h-screen ">
      <div className="mx-auto px-4 sm:px-6 lg:px-2 pb-6">
        {/* Banking Overview Stats */}
        <DashboardSection title="Banking Overview">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {statsData.map(stat => (
              <div
                key={stat.title}
                className={`${stat.iconBgColor} ${stat.iconColor} p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-white/50`}>
                    {stat.icon}
                  </div>
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${stat.iconColor} mb-1`}>
                    {stat.value}
                  </h3>
                  <p
                    className={`text-sm font-medium ${stat.iconColor} opacity-75`}
                  >
                    {stat.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        {/* Charts Section */}
        <div className="mt-8">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            {filterButtons.map(filter => (
              <Button
                key={filter.key}
                variant={chartFilter === filter.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartFilter(filter.key)}
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                {filter.label}
              </Button>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Deposit Overview Chart */}
            <ChartContainer
              title="Deposit Overview"
              icon={TrendingUp}
              iconColor="text-green-600"
            >
              <BarChartComponent
                data={getDepositChartData()}
                height={300}
                angle={-45}
              />
            </ChartContainer>

            {/* Loan Overview Chart */}
            <ChartContainer
              title="Loan Overview"
              icon={CreditCard}
              iconColor="text-red-600"
            >
              <BarChartComponent
                data={getLoanChartData()}
                height={300}
                angle={-45}
              />
            </ChartContainer>

            {/* Transaction Volume Chart */}
            <ChartContainer
              title="Transaction Volume"
              icon={Activity}
              iconColor="text-blue-600"
            >
              <LineChartComponent
                data={getTransactionChartData()}
                lines={transactionLines}
                height={300}
                angle={-45}
                rightYAxisFormatter={formatCurrency}
              />
            </ChartContainer>
          </div>
        </div>

        {/* Quick Actions and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <QuickActions
            title="Quick Actions"
            actions={quickActions}
            columns={2}
          />
          <RecentActivity
            title="Recent Banking Activities"
            activities={recentActivities}
            maxItems={6}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
