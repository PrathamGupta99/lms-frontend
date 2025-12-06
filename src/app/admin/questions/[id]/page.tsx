"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdmin } from '../../../../context/AdminContext';
import { ErrorMessage } from '../../../../components/ErrorMessage';
import { Loader } from '../../../../components/Loader';

export default function EditQuestionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { questions, fetchQuestions, updateQuestion } = useAdmin();
  const existing = questions.find((q) => q.id === id);

  const [form, setForm] = useState({
    questionText: existing?.questionText || '',
    difficulty: existing?.difficulty || 5,
    weight: existing?.weight || 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!existing && id) {
      void fetchQuestions();
    } else if (existing) {
      setForm({
        questionText: existing.questionText,
        difficulty: existing.difficulty,
        weight: existing.weight,
      });
    }
  }, [existing, id, fetchQuestions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'difficulty' || name === 'weight' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError(null);
    try {
      setLoading(true);
      await updateQuestion(id, form);
      router.push('/admin/questions');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update question';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!existing && loading) return <Loader />;

  return (
    <section>
      <h2>Edit Question</h2>
      <form className="auth-card__form" onSubmit={handleSubmit}>
        <label>
          Text
          <input
            name="questionText"
            type="text"
            value={form.questionText}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Difficulty (1-10)
          <input
            name="difficulty"
            type="number"
            min={1}
            max={10}
            value={form.difficulty}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Weight
          <input
            name="weight"
            type="number"
            min={0.1}
            step={0.1}
            value={form.weight}
            onChange={handleChange}
            required
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
