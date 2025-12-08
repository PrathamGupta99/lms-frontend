"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorMessage } from '../../components/ErrorMessage';

export default function TestsLandingPage() {
  const router = useRouter();
  const [uniqueURL, setUniqueURL] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uniqueURL.trim()) {
      setError('Please enter a test URL slug.');
      return;
    }
    setError(null);
    router.push(`/test/${encodeURIComponent(uniqueURL.trim())}`);
  };

  return (
    <section className="auth-card">
      <p className="eyebrow">Start a test</p>
      <h2>Have a unique test link?</h2>
      <p className="muted small">Enter the unique URL slug provided by your admin to begin.</p>
      <form className="auth-card__form" onSubmit={handleSubmit}>
        <label>
          Unique URL
          <input
            type="text"
            value={uniqueURL}
            onChange={(e) => setUniqueURL(e.target.value)}
            placeholder="e.g. sample-test"
          />
        </label>
        <ErrorMessage message={error || undefined} />
        <button className="btn primary full" type="submit">
          Continue
        </button>
      </form>
    </section>
  );
}
