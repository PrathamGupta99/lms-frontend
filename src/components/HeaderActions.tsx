import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export const HeaderActions = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <div className="nav-links">
      {isAuthenticated ? (
        <>
          {isAdmin ? <Link href="/admin">Admin</Link> : <Link href="/tests">Tests</Link>}
          <button className="linkish" onClick={logout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </>
      )}
    </div>
  );
};
