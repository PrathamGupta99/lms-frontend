"use client";
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useApiClient } from '../lib/apiClient';
import { useAuth } from './AuthContext';

type User = { id: string; email: string; name: string; role: 'admin' | 'user' };
type Question = { id: string; questionText: string; difficulty: number; weight: number };
type Test = { id: string; name: string; uniqueURL: string; createdAt?: string };
type TestPreview = { testId: string; uniqueURL: string; name: string; questions: any[] };
type TestResult = { sessionId: string; user: User; score: number; questionsCount: number; completedAt: string };

type AdminContextType = {
  users: User[];
  questions: Question[];
  tests: Test[];
  testResults: TestResult[];
  testPreview: TestPreview | null;
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
  createTest: (payload: { name: string; description?: string }) => Promise<void>;
  updateTest: (id: string, payload: { name?: string; description?: string }) => Promise<void>;
  fetchTestPreview: (testId: string) => Promise<void>;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);
export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useAuth();
  const api = useApiClient();
  const [users, setUsers] = useState<User[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testPreview, setTestPreview] = useState<TestPreview | null>(null);

  const fetchUsers = useCallback(async () => {
    const data = await api.get<any[]>('/admin/users');
    setUsers(
      (data as any[]).map((u) => ({
        id: u.id || u._id,
        email: u.email,
        name: u.name,
        role: u.role,
      })),
    );
  }, [api]);

  const createUser = useCallback(
    async (payload: { email: string; password: string; name: string; role: 'admin' | 'user' }) => {
      await api.post('/admin/users', payload);
      await fetchUsers();
    },
    [api, fetchUsers],
  );

  const updateUser = useCallback(
    async (id: string, payload: Partial<Omit<User, 'id' | 'email'>> & { password?: string }) => {
      await api.put(`/admin/users/${id}`, payload);
      await fetchUsers();
    },
    [api, fetchUsers],
  );

  const deleteUser = useCallback(
    async (id: string) => {
      await api.del(`/admin/users/${id}`);
      await fetchUsers();
    },
    [api, fetchUsers],
  );

  const fetchQuestions = useCallback(async () => {
    const data = await api.get<any>('/questions');
    setQuestions(
      (data.data || data || []).map((q: any) => ({
        id: q._id || q.id,
        questionText: q.questionText || q.question || '',
        difficulty: q.difficulty,
        weight: q.weight,
      })),
    );
  }, [api]);

  const createQuestion = useCallback(
    async (payload: {
      questionText: string;
      options: string[];
      correctAnswerIndex: number;
      difficulty: number;
      weight: number;
    }) => {
      await api.post('/questions', payload);
      await fetchQuestions();
    },
    [api, fetchQuestions],
  );

  const updateQuestion = useCallback(
    async (id: string, payload: Partial<Omit<Question, 'id'>>) => {
      await api.put(`/questions/${id}`, payload);
      await fetchQuestions();
    },
    [api, fetchQuestions],
  );

  const deleteQuestion = useCallback(
    async (id: string) => {
      await api.del(`/questions/${id}`);
      await fetchQuestions();
    },
    [api, fetchQuestions],
  );

  const fetchTests = useCallback(async () => {
    const data = await api.get<any[]>('/tests');
    setTests(
      (data as any[]).map((t) => ({
        id: t._id || t.id,
        name: t.name,
        uniqueURL: t.uniqueURL,
        createdAt: t.createdAt,
      })),
    );
  }, [api]);

  const createTest = useCallback(
    async (payload: { name: string; description?: string }) => {
      await api.post('/tests', payload);
      await fetchTests();
    },
    [api, fetchTests],
  );

  const updateTest = useCallback(
    async (id: string, payload: { name?: string; description?: string }) => {
      await api.put(`/tests/${id}`, payload);
      await fetchTests();
    },
    [api, fetchTests],
  );

  const fetchTestResults = useCallback(
    async (testId: string) => {
      const data = await api.get<any[]>(`/tests/${testId}/results`);
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
    [api],
  );

  const fetchTestPreview = useCallback(
    async (testId: string) => {
      const data = await api.get<any>(`/tests/${testId}/preview`);
      setTestPreview({
        testId: data.testId,
        uniqueURL: data.uniqueURL,
        name: data.name,
        questions:
          (data.questions || []).map((q: any) => ({
            ...q,
            questionText: q.questionText || q.question || '',
          })) ?? [],
      });
    },
    [api],
  );

  const value = useMemo<AdminContextType>(
    () => ({
      users,
      questions,
      tests,
      testResults,
      testPreview,
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
      createTest,
      updateTest,
      fetchTestPreview,
    }),
    [
      users,
      questions,
      tests,
      testResults,
      testPreview,
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
      createTest,
      updateTest,
      fetchTestPreview,
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
