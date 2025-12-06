"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { ErrorMessage } from '../../../components/ErrorMessage';
import { Loader } from '../../../components/Loader';

type SessionResult = {
  sessionId: string;
  testId?: string;
  score: number;
  questionsAsked: {
    questionId: string;
    chosenAnswerIndex: number;
    isCorrect: boolean;
    difficultyAtTime: number;
    weight: number;
  }[];
};

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function ResultPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { token, isAuthenticated } = useAuth();
  const [result, setResult] = useState<SessionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiBase}/sessions/${sessionId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error('Failed to load result');
        const data = await res.json();
        setResult({
          sessionId: data.id || data.sessionId,
          score: data.score,
          questionsAsked: data.questionsAsked || [],
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load result';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    if (sessionId) {
      void load();
    }
  }, [sessionId, token]);

  if (!isAuthenticated) {
    return <ErrorMessage message="Please login to view results." />;
  }

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!result) return <ErrorMessage message="Result not found" />;

  return (
    <section className="auth-card">
      <p className="eyebrow">Results</p>
      <h2>Score: {result.score}</h2>
      <p className="muted small">Session: {result.sessionId}</p>
      <div className="options">
        {result.questionsAsked.map((q, idx) => (
          <div key={idx} className="result-row">
            <span>Q{idx + 1}</span>
            <span className={q.isCorrect ? 'pill' : 'pill pill-muted'}>
              {q.isCorrect ? 'Correct' : 'Wrong'}
            </span>
            <span className="muted small">Diff {q.difficultyAtTime}</span>
            <span className="muted small">Weight {q.weight}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
