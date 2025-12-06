"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../../../../context/AdminContext';
import { Loader } from '../../../../components/Loader';
import { ErrorMessage } from '../../../../components/ErrorMessage';

export default function NewUserPage() {
  const router = useRouter();
  const { createUser } = useAdmin();
  const [form, setForm] = useState({
    email: '',
    name: '',
    password: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      await createUser(form);
      router.push('/admin/users');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create user';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>Create User</h2>
      <form className="auth-card__form" onSubmit={handleSubmit}>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Name
          <input name="name" type="text" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Role
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <ErrorMessage message={error || undefined} />
        <button className="btn primary full" type="submit" disabled={loading}>
          {loading ? <Loader /> : 'Create'}
        </button>
      </form>
    </section>
  );
}
