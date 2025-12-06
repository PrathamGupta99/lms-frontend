"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAdmin } from '../../../../../context/AdminContext';
import { Loader } from '../../../../../components/Loader';
import { ErrorMessage } from '../../../../../components/ErrorMessage';

export default function TestResultsPage() {
  const { testId } = useParams<{ testId: string }>();
  const { testResults, fetchTestResults } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await fetchTestResults(testId);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load results';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    if (testId) {
      void load();
    }
  }, [testId, fetchTestResults]);

  return (
    <section>
      <h2>Results</h2>
      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}
      <div className="table">
        <div className="table-row head">
          <span>User</span>
          <span>Role</span>
          <span>Score</span>
          <span>Completed</span>
        </div>
        {testResults.map((r) => (
          <div key={r.sessionId} className="table-row">
            <span>{r.user.email}</span>
            <span className="pill">{r.user.role}</span>
            <span>{r.score}</span>
            <span className="muted small">{r.completedAt}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
