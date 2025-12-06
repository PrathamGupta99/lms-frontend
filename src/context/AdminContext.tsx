import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

type User = { id: string; email: string; name: string; role: 'admin' | 'user' };
type Question = { id: string; questionText: string; difficulty: number; weight: number };
type Test = { id: string; name: string; uniqueURL: string; createdAt?: string };
type TestResult = { sessionId: string; user: User; score: number; questionsCount: number; completedAt: string };

type AdminContextType = {
  users: User[];
  questions: Question[];
  tests: Test[];
  testResults: TestResult[];
  fetchUsers: () => Promise<void>;
  createUser: (payload: { email: string; password: string; name: string; role: 'admin' | 'user' }) => Promise<void>;
  updateUser: (id: string, payload: Partial<Omit<User, 'id' | 'email'>> & { password?: string }) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  fetchQuestions: () => Promise<void>;
  createQuestion: (payload: { questionText: string; options: string[]; correctAnswerIndex: number; difficulty: number; weight: number }) => Promise<void>;
  updateQuestion: (id: string, payload: Partial<Omit<Question, 'id'>>) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  fetchTests: () => Promise<void>;
  fetchTestResults: (testId: string) => Promise<void>;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);
const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const getAuthHeaders = (token: string | null) => (token ? { Authorization: `Bearer ${token}` } : undefined);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  const fetchUsers = useCallback(async () => {
    const res = await fetch(`${apiBase}/admin/users`, { headers: { ...getAuthHeaders(token) } });
    if (!res.ok) throw new Error('Failed to fetch users');
    const data = await res.json();
    setUsers(
      (data as any[]).map((u) => ({
        id: u.id || u._id,
        email: u.email,
        name: u.name,
        role: u.role,
      })),
    );
  }, [token]);

  const createUser = useCallback(
    async (payload: { email: string; password: string; name: string; role: 'admin' | 'user' }) => {
      const res = await fetch(`${apiBase}/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders(token) },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create user');
      await fetchUsers();
    },
    [token, fetchUsers],
  );

  const updateUser = useCallback(
    async (id: string, payload: Partial<Omit<User, 'id' | 'email'>> & { password?: string }) => {
      const res = await fetch(`${apiBase}/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders(token) },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update user');
      await fetchUsers();
    },
    [token, fetchUsers],
  );

  const deleteUser = useCallback(
    async (id: string) => {
      const res = await fetch(`${apiBase}/admin/users/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders(token) },
      });
      if (!res.ok) throw new Error('Failed to delete user');
      await fetchUsers();
    },
    [token, fetchUsers],
  );

  const fetchQuestions = useCallback(async () => {
    const res = await fetch(`${apiBase}/questions`, { headers: { ...getAuthHeaders(token) } });
    if (!res.ok) throw new Error('Failed to fetch questions');
    const data = await res.json();
    setQuestions(
      (data.data || data || []).map((q: any) => ({
        id: q._id || q.id,
        questionText: q.questionText,
        difficulty: q.difficulty,
        weight: q.weight,
      })),
    );
  }, [token]);

  const createQuestion = useCallback(
    async (payload: {
      questionText: string;
      options: string[];
      correctAnswerIndex: number;
      difficulty: number;
      weight: number;
    }) => {
      const res = await fetch(`${apiBase}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders(token) },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create question');
      await fetchQuestions();
    },
    [token, fetchQuestions],
  );

  const updateQuestion = useCallback(
    async (id: string, payload: Partial<Omit<Question, 'id'>>) => {
      const res = await fetch(`${apiBase}/questions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders(token) },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update question');
      await fetchQuestions();
    },
    [token, fetchQuestions],
  );

  const deleteQuestion = useCallback(
    async (id: string) => {
      const res = await fetch(`${apiBase}/questions/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders(token) },
      });
      if (!res.ok) throw new Error('Failed to delete question');
      await fetchQuestions();
    },
    [token, fetchQuestions],
  );

  const fetchTests = useCallback(async () => {
    const res = await fetch(`${apiBase}/tests`, { headers: { ...getAuthHeaders(token) } });
    if (!res.ok) throw new Error('Failed to fetch tests');
    const data = await res.json();
    setTests(
      (data as any[]).map((t) => ({
        id: t._id || t.id,
        name: t.name,
        uniqueURL: t.uniqueURL,
        createdAt: t.createdAt,
      })),
    );
  }, [token]);

  const fetchTestResults = useCallback(
    async (testId: string) => {
      const res = await fetch(`${apiBase}/tests/${testId}/results`, {
        headers: { ...getAuthHeaders(token) },
      });
      if (!res.ok) throw new Error('Failed to fetch test results');
      const data = await res.json();
      setTestResults(
        (data as any[]).map((r) => ({
          sessionId: r.sessionId,
          user: r.user,
          score: r.score,
          questionsCount: r.questionsCount,
          completedAt: r.completedAt,
        })),
      );
    },
    [token],
  );

  const value = useMemo<AdminContextType>(
    () => ({
      users,
      questions,
      tests,
      testResults,
      fetchUsers,
      createUser,
      updateUser,
      deleteUser,
      fetchQuestions,
      createQuestion,
      updateQuestion,
      deleteQuestion,
      fetchTests,
      fetchTestResults,
    }),
    [
      users,
      questions,
      tests,
      testResults,
      fetchUsers,
      createUser,
      updateUser,
      deleteUser,
      fetchQuestions,
      createQuestion,
      updateQuestion,
      deleteQuestion,
      fetchTests,
      fetchTestResults,
    ],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = (): AdminContextType => {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return ctx;
};
