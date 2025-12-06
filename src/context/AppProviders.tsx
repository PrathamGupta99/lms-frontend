import React from 'react';
import { AuthProvider } from './AuthContext';
import { TestProvider } from './TestContext';
import { AdminProvider } from './AdminContext';

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <AdminProvider>
        <TestProvider>{children}</TestProvider>
      </AdminProvider>
    </AuthProvider>
  );
};
