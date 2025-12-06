"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '../../../context/AdminContext';
import { Loader } from '../../../components/Loader';
import { ErrorMessage } from '../../../components/ErrorMessage';

export default function AdminTestsPage() {
  const { tests, fetchTests, fetchTestResults } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await fetchTests();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load tests';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [fetchTests]);

  const handleViewResults = async (id: string) => {
    try {
      setLoading(true);
      await fetchTestResults(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load results';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="table-header">
        <h2>Tests</h2>
        <Link className="btn primary" href="/admin/tests/new">
          New Test
        </Link>
      </div>
      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}
      <div className="table">
        <div className="table-row head">
          <span>Name</span>
          <span>Unique URL</span>
          <span>Created</span>
          <span>Actions</span>
        </div>
        {tests.map((t) => (
          <div key={t.id} className="table-row">
            <span>{t.name}</span>
            <span className="muted small">{t.uniqueURL}</span>
            <span className="muted small">{t.createdAt ? new Date(t.createdAt).toLocaleString() : '-'}</span>
            <span className="actions">
              <Link href={`/admin/tests/${t.id}`}>Edit</Link>
              <Link href={`/admin/tests/${t.id}/results`} onClick={() => handleViewResults(t.id)}>
                Results
              </Link>
              <Link href={`/admin/tests/${t.id}/preview`}>Preview</Link>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
