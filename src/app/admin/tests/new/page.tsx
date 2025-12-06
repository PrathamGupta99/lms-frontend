"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../../../../context/AdminContext';
import { ErrorMessage } from '../../../../components/ErrorMessage';
import { Loader } from '../../../../components/Loader';

export default function NewTestPage() {
  const router = useRouter();
  const { createTest } = useAdmin();
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      await createTest(form);
      router.push('/admin/tests');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create test';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>Create Test</h2>
      <form className="auth-card__form" onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" type="text" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            style={{ borderRadius: 10, border: '1px solid var(--border)', padding: '10px' }}
          />
        </label>
        <ErrorMessage message={error || undefined} />
        <button className="btn primary full" type="submit" disabled={loading}>
          {loading ? <Loader /> : 'Create'}
        </button>
      </form>
    </section>
  );
}
