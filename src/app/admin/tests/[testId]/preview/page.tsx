"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAdmin } from '../../../../../context/AdminContext';
import { Loader } from '../../../../../components/Loader';
import { ErrorMessage } from '../../../../../components/ErrorMessage';

type PreviewQuestion = {
  id: string;
  questionText: string;
  options: string[];
  difficulty: number;
  weight: number;
};

export default function TestPreviewPage() {
  const { testId } = useParams<{ testId: string }>();
  const { fetchTestPreview, testPreview } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await fetchTestPreview(testId);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load preview';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    if (testId) {
      void load();
    }
  }, [testId, fetchTestPreview]);

  const preview = testPreview;

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!preview) return <ErrorMessage message="No preview available" />;

  return (
    <section>
      <h2>Preview: {preview.name}</h2>
      <p className="muted small">Unique URL: {preview.uniqueURL}</p>
      <div className="table">
        <div className="table-row head">
          <span>Question</span>
          <span>Difficulty</span>
          <span>Weight</span>
          <span>Options</span>
        </div>
        {preview.questions.map((q: PreviewQuestion) => (
          <div key={q.id} className="table-row">
            <span className="muted small">{q.questionText}</span>
            <span>{q.difficulty}</span>
            <span>{q.weight}</span>
            <span className="muted small">{q.options.join(', ')}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
