"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdmin } from '../../../../context/AdminContext';
import { Loader } from '../../../../components/Loader';
import { ErrorMessage } from '../../../../components/ErrorMessage';

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { users, fetchUsers, updateUser } = useAdmin();
  const existing = users.find((u) => u.id === id);

  const [form, setForm] = useState({
    name: existing?.name || '',
    role: existing?.role || 'user',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!existing && id) {
      void fetchUsers();
    } else if (existing) {
      setForm({ name: existing.name, role: existing.role, password: '' });
    }
  }, [existing, id, fetchUsers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError(null);
    try {
      setLoading(true);
      await updateUser(id, { name: form.name, role: form.role as 'admin' | 'user', password: form.password || undefined });
      router.push('/admin/users');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update user';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!existing && loading) return <Loader />;

  return (
    <section>
      <h2>Edit User</h2>
      <form className="auth-card__form" onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" type="text" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Role
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <label>
          Reset Password (optional)
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Leave blank to keep current"
          />
        </label>
        <ErrorMessage message={error || undefined} />
        <button className="btn primary full" type="submit" disabled={loading}>
          {loading ? <Loader /> : 'Save'}
        </button>
      </form>
    </section>
  );
}
