"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '../../../context/AdminContext';
import { Loader } from '../../../components/Loader';
import { ErrorMessage } from '../../../components/ErrorMessage';

export default function AdminUsersPage() {
  const { users, fetchUsers, deleteUser } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await fetchUsers();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load users';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [fetchUsers]);

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await deleteUser(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete user';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="table-header">
        <h2>Users</h2>
        <Link className="btn primary" href="/admin/users/new">
          New User
        </Link>
      </div>
      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}
      <div className="table">
        <div className="table-row head">
          <span>Email</span>
          <span>Name</span>
          <span>Role</span>
          <span>Actions</span>
        </div>
        {users.map((u) => (
          <div key={u.id} className="table-row">
            <span>{u.email}</span>
            <span>{u.name}</span>
            <span className="pill">{u.role}</span>
            <span className="actions">
              <Link href={`/admin/users/${u.id}`}>Edit</Link>
              <button className="linkish" onClick={() => handleDelete(u.id)}>
                Delete
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
