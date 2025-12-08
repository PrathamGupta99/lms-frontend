"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '../../../context/AdminContext';
import { Loader } from '../../../components/Loader';
import { ErrorMessage } from '../../../components/ErrorMessage';

export default function AdminQuestionsPage() {
  const { questions, fetchQuestions, deleteQuestion } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await fetchQuestions();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load questions';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [fetchQuestions]);

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await deleteQuestion(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete question';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="table-header">
        <h2>Questions</h2>
        <Link className="btn primary" href="/admin/questions/new">
          New Question
        </Link>
      </div>
      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}
      <div className="table">
        <div className="table-row head">
          <span>Text</span>
          <span>Difficulty</span>
          <span>Weight</span>
          <span>Actions</span>
        </div>
        {questions.map((q) => (
          <div key={q.id} className="table-row">
            <span className="muted small">{(q.questionText || '').slice(0, 60)}...</span>
            <span>{q.difficulty}</span>
            <span>{q.weight}</span>
            <span className="actions">
              <Link href={`/admin/questions/${q.id}`}>Edit</Link>
              <button className="linkish" onClick={() => handleDelete(q.id)}>
                Delete
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
