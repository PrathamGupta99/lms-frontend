"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdmin } from '../../../../context/AdminContext';
import { ErrorMessage } from '../../../../components/ErrorMessage';
import { Loader } from '../../../../components/Loader';

export default function EditTestPage() {
  const { testId } = useParams<{ testId: string }>();
  const router = useRouter();
  const { tests, fetchTests, updateTest } = useAdmin();
  const existing = tests.find((t) => t.id === testId);

  const [form, setForm] = useState({ name: existing?.name || '', description: existing?.description || '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!existing && testId) {
      void fetchTests();
    } else if (existing) {
      setForm({ name: existing.name, description: existing.description || '' });
    }
  }, [existing, testId, fetchTests]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testId) return;
    setError(null);
    try {
      setLoading(true);
      await updateTest(testId, form);
      router.push('/admin/tests');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update test';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!existing && loading) return <Loader />;

  return (
    <section>
      <h2>Edit Test</h2>
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
          {loading ? <Loader /> : 'Save'}
        </button>
      </form>
    </section>
  );
}
