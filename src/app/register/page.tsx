"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { ErrorMessage } from '../../components/ErrorMessage';
import { Loader } from '../../components/Loader';

export default function RegisterPage() {
  const router = useRouter();
  const { registerAdmin, isAuthenticated, isAdmin } = useAuth();
  const [form, setForm] = useState({ email: '', name: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      await registerAdmin({ email: form.email, name: form.name, password: form.password });
      router.push('/admin');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated && isAdmin) {
    router.push('/admin');
  }

  return (
    <section className="auth-card">
      <div className="auth-card__header">
        <p className="eyebrow">Admin Registration</p>
        <h1>Create your admin account</h1>
        <p className="muted">Registering here creates an admin. Use it to manage users, tests, and questions.</p>
      </div>
      <form className="auth-card__form" onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" type="text" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>
        <label>
          Confirm Password
          <input name="confirm" type="password" value={form.confirm} onChange={handleChange} required />
        </label>
        <ErrorMessage message={error || undefined} />
        <button className="btn primary full" type="submit" disabled={loading}>
          {loading ? <Loader /> : 'Register as Admin'}
        </button>
      </form>
      <p className="muted small">
        Already have an admin account? <a href="/login">Login</a>
      </p>
    </section>
  );
}
