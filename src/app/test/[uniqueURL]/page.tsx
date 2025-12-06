"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTest } from '../../../context/TestContext';
import { useAuth } from '../../../context/AuthContext';
import { ErrorMessage } from '../../../components/ErrorMessage';
import { Loader } from '../../../components/Loader';

export default function UniqueTestPage() {
  const { uniqueURL } = useParams<{ uniqueURL: string }>();
  const router = useRouter();
  const { initFromUniqueUrl, startTest } = useTest();
  const { isAuthenticated, isAdmin, isNormalUser } = useAuth();

  const [testInfo, setTestInfo] = useState<{ testId: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const info = await initFromUniqueUrl(uniqueURL);
        setTestInfo(info);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load test';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    if (uniqueURL) {
      load();
    }
  }, [uniqueURL, initFromUniqueUrl]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/login`);
    }
  }, [loading, isAuthenticated, router]);

  const handleStart = async () => {
    if (!testInfo) return;
    try {
      setLoading(true);
      const started = await startTest(testInfo.testId);
      if (started?.sessionId) {
        router.push(`/test/session/${encodeURIComponent(started.sessionId)}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start test';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-card">
      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}
      {testInfo && (
        <>
          <p className="eyebrow">Adaptive test</p>
          <h1>{testInfo.name}</h1>
          <p className="muted small">Unique URL: {uniqueURL}</p>

          {!isAuthenticated && <Loader />}

          {isAuthenticated && isAdmin && (
            <ErrorMessage message="Admins cannot take tests. Use admin panel to preview." />
          )}

          {isAuthenticated && isNormalUser && (
            <button className="btn primary full" onClick={handleStart} disabled={loading}>
              {loading ? <Loader /> : 'Start Test'}
            </button>
          )}
        </>
      )}
    </section>
  );
}
