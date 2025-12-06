"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTest } from '../../../../context/TestContext';
import { useAuth } from '../../../../context/AuthContext';
import { ErrorMessage } from '../../../../components/ErrorMessage';
import { Loader } from '../../../../components/Loader';

export default function SessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const { currentQuestion, submitAnswer, status, summary } = useTest();
  const { isAdmin, isNormalUser, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    if (status === 'idle') {
      // If no session in context, redirect back to tests listing
      router.push('/tests');
    }
  }, [sessionId, status, router]);

  useEffect(() => {
    if (status === 'completed' && sessionId) {
      router.push(`/results/${sessionId}`);
    }
  }, [status, sessionId, router]);

  if (isAdmin) {
    return <ErrorMessage message="Admins cannot take tests." />;
  }
  if (!isAuthenticated) {
    router.push('/login');
    return <Loader />;
  }
  if (!isNormalUser) {
    return <ErrorMessage message="Please login as a normal user to take tests." />;
  }

  if (status === 'completed' && summary) {
    return (
      <section className="auth-card">
        <p className="eyebrow">Session complete</p>
        <h2>Score: {summary.score}</h2>
        <p className="muted small">Questions answered: {summary.totalQuestions}</p>
        <Loader />
      </section>
    );
  }

  if (!currentQuestion) {
    return <ErrorMessage message="No active session. Start a test from its unique URL." />;
  }

  const handleSubmit = async (answerIdx: number) => {
    try {
      setSubmitting(true);
      await submitAnswer(currentQuestion.id, answerIdx);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit answer';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-card">
      <p className="eyebrow">Question</p>
      <h2>{currentQuestion.questionText}</h2>
      <p className="muted small">
        Difficulty: {currentQuestion.difficulty} • Weight: {currentQuestion.weight}
      </p>
      {error && <ErrorMessage message={error} />}
      <div className="options">
        {currentQuestion.options.map((opt, idx) => (
          <button
            key={idx}
            className="btn ghost full"
            disabled={submitting || status === 'completed'}
            onClick={() => handleSubmit(idx)}
          >
            {opt}
          </button>
        ))}
      </div>
      {submitting && <Loader />}
    </section>
  );
}
