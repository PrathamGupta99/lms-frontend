"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../../../../context/AdminContext';
import { ErrorMessage } from '../../../../components/ErrorMessage';
import { Loader } from '../../../../components/Loader';

export default function NewQuestionPage() {
  const router = useRouter();
  const { createQuestion } = useAdmin();
  const [form, setForm] = useState({
    questionText: '',
    options: ['',''],
    correctAnswerIndex: 0,
    difficulty: 5,
    weight: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'difficulty' || name === 'weight' || name === 'correctAnswerIndex' ? Number(value) : value }));
  };

  const handleOptionChange = (idx: number, value: string) => {
    setForm((prev) => {
      const next = [...prev.options];
      next[idx] = value;
      return { ...prev, options: next };
    });
  };

  const addOption = () => setForm((prev) => ({ ...prev, options: [...prev.options, ''] }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      await createQuestion(form);
      router.push('/admin/questions');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create question';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>Create Question</h2>
      <form className="auth-card__form" onSubmit={handleSubmit}>
        <label>
          Text
          <input name="questionText" type="text" value={form.questionText} onChange={handleChange} required />
        </label>
        <div className="options">
          {form.options.map((opt, idx) => (
            <input key={idx} type="text" value={opt} onChange={(e) => handleOptionChange(idx, e.target.value)} placeholder={`Option ${idx + 1}`} required />
          ))}
          <button type="button" className="btn ghost" onClick={addOption}>Add option</button>
        </div>
        <label>
          Correct Answer Index
          <input name="correctAnswerIndex" type="number" min={0} max={form.options.length - 1} value={form.correctAnswerIndex} onChange={handleChange} required />
        </label>
        <label>
          Difficulty (1-10)
          <input name="difficulty" type="number" min={1} max={10} value={form.difficulty} onChange={handleChange} required />
        </label>
        <label>
          Weight
          <input name="weight" type="number" min={0.1} step={0.1} value={form.weight} onChange={handleChange} required />
        </label>
        <ErrorMessage message={error || undefined} />
        <button className="btn primary full" type="submit" disabled={loading}>
          {loading ? <Loader /> : 'Create'}
        </button>
      </form>
    </section>
  );
}
