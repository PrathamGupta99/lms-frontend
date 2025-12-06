import React from 'react';
import { AuthProvider } from './AuthContext';
import { AdminProvider } from './AdminContext';
import { TestProvider } from './TestContext';

export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <AdminProvider>
      <TestProvider>{children}</TestProvider>
    </AdminProvider>
  </AuthProvider>
);
