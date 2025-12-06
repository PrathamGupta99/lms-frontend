import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';

type Question = {
  id: string;
  questionText: string;
  options: string[];
  difficulty: number;
  weight: number;
};

type TestState = {
  currentTestId: string | null;
  currentSessionId: string | null;
  currentQuestion: Question | null;
  status: 'idle' | 'in-progress' | 'completed';
  summary: { score: number; totalQuestions: number } | null;
};

type TestContextType = TestState & {
  initFromUniqueUrl: (uniqueURL: string) => Promise<{ testId: string; name: string }>;
  startTest: (testId: string) => Promise<void>;
  submitAnswer: (questionId: string, selectedAnswerIndex: number) => Promise<void>;
  reset: () => void;
};

const TestContext = createContext<TestContextType | undefined>(undefined);

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const getAuthHeaders = (token: string | null) =>
  token ? { Authorization: `Bearer ${token}` } : undefined;

export const TestProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, isNormalUser } = useAuth();
  const [state, setState] = useState<TestState>({
    currentTestId: null,
    currentSessionId: null,
    currentQuestion: null,
    status: 'idle',
    summary: null,
  });

  const reset = useCallback(() => {
    setState({
      currentTestId: null,
      currentSessionId: null,
      currentQuestion: null,
      status: 'idle',
      summary: null,
    });
  }, []);

  useEffect(() => {
    if (!isNormalUser) {
      reset();
    }
  }, [isNormalUser, reset]);

  const initFromUniqueUrl = useCallback(async (uniqueURL: string) => {
    const res = await fetch(`${apiBase}/tests/public/${uniqueURL}`);
    if (!res.ok) {
      throw new Error('Test not found');
    }
    const data = await res.json();
    setState((prev) => ({ ...prev, currentTestId: data.testId }));
    return { testId: data.testId as string, name: data.name as string };
  }, []);

  const startTest = useCallback(
    async (testId: string) => {
      if (!token || !isNormalUser) {
        throw new Error('Only normal users can start tests.');
      }
      const res = await fetch(`${apiBase}/tests/${testId}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(token),
        },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to start test');
      }
      const data = (await res.json()) as {
        sessionId: string;
        testId: string;
        question: Question;
      };
      setState({
        currentTestId: data.testId,
        currentSessionId: data.sessionId,
        currentQuestion: data.question,
        status: 'in-progress',
        summary: null,
      });
    },
    [token, isNormalUser],
  );

  const submitAnswer = useCallback(
    async (questionId: string, selectedAnswerIndex: number) => {
      if (!token || !state.currentSessionId || !state.currentTestId) {
        throw new Error('No active session');
      }
      const res = await fetch(
        `${apiBase}/tests/${state.currentTestId}/sessions/${state.currentSessionId}/questions/${questionId}/answer`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(token),
          },
          body: JSON.stringify({ selectedAnswerIndex }),
        },
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to submit answer');
      }
      const data = await res.json();
      if (data.completed) {
        setState((prev) => ({
          ...prev,
          status: 'completed',
          summary: { score: data.score, totalQuestions: data.totalQuestions },
          currentQuestion: null,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          currentQuestion: data.question,
          status: 'in-progress',
        }));
      }
    },
    [state.currentSessionId, state.currentTestId, token],
  );

  const value = useMemo<TestContextType>(
    () => ({
      ...state,
      initFromUniqueUrl,
      startTest,
      submitAnswer,
      reset,
    }),
    [state, initFromUniqueUrl, startTest, submitAnswer, reset],
  );

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
};

export const useTest = (): TestContextType => {
  const ctx = useContext(TestContext);
  if (!ctx) {
    throw new Error('useTest must be used within TestProvider');
  }
  return ctx;
};
