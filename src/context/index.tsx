import React from 'react';
import { AuthProvider } from './AuthContext';
import { AdminProvider } from './AdminContext';
import { TestProvider } from './TestContext';
import { ToastProvider } from '../components/ToastProvider';

export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>
    <AuthProvider>
      <AdminProvider>
        <TestProvider>{children}</TestProvider>
      </AdminProvider>
    </AuthProvider>
  </ToastProvider>
);
