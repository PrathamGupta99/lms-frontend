"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { ErrorMessage } from '../../components/ErrorMessage';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      router.push('/login');
    }
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated || !isAdmin) {
    return <ErrorMessage message="Admins only. Please login as an admin." />;
  }

  return (
    <section className="auth-card">
      <div className="admin-nav">
        <Link href="/admin/users">Users</Link>
        <Link href="/admin/questions">Questions</Link>
        <Link href="/admin/tests">Tests & Results</Link>
      </div>
      <div>{children}</div>
    </section>
  );
}
