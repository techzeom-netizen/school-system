import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Home,
  CreditCard,
  History,
  ArrowRightLeft,
  Settings,
  LogOut,
  Bell,
  User,
} from 'lucide-react';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const customerMenuItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/customer', icon: Home },
    {
      id: 'accounts',
      label: 'My Accounts',
      href: '/customer/accounts',
      icon: CreditCard,
    },
    {
      id: 'transactions',
      label: 'Transactions',
      href: '/customer/transactions',
      icon: History,
    },
    {
      id: 'transfer',
      label: 'Transfer Money',
      href: '/customer/transfer',
      icon: ArrowRightLeft,
    },
    {
      id: 'settings',
      label: 'Settings',
      href: '/customer/settings',
      icon: Settings,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/customer') {
      return location.pathname === '/customer';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Customer Portal
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>

              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.firstName || 'Customer'}
                </span>
              </div>

              <Button variant="ghost" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {customerMenuItems.map(item => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <Link
                      to={item.href}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default CustomerLayout;
