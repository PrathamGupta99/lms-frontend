import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useApiClient } from '../lib/apiClient';

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
  startTest: (testId: string) => Promise<{ sessionId: string; testId: string } | void>;
  submitAnswer: (questionId: string, selectedAnswerIndex: number) => Promise<void>;
  reset: () => void;
};

const TestContext = createContext<TestContextType | undefined>(undefined);

export const TestProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, isNormalUser } = useAuth();
  const api = useApiClient();
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
    const data = await api.get<any>(`/tests/public/${uniqueURL}`);
    setState((prev) => ({ ...prev, currentTestId: data.testId }));
    return { testId: data.testId as string, name: data.name as string };
  }, [api]);

  const startTest = useCallback(
    async (testId: string) => {
      if (!token || !isNormalUser) {
        throw new Error('Only normal users can start tests.');
      }
      const data = await api.post<{ sessionId: string; testId: string; question: Question }>(
        `/tests/${testId}/start`,
      );
      setState({
        currentTestId: data.testId,
        currentSessionId: data.sessionId,
        currentQuestion: data.question,
        status: 'in-progress',
        summary: null,
      });
      return { sessionId: data.sessionId, testId: data.testId };
    },
    [api, token, isNormalUser],
  );

  const submitAnswer = useCallback(
    async (questionId: string, selectedAnswerIndex: number) => {
      if (!token || !state.currentSessionId || !state.currentTestId) {
        throw new Error('No active session');
      }
      const data = await api.post<any>(
        `/tests/${state.currentTestId}/sessions/${state.currentSessionId}/questions/${questionId}/answer`,
        { selectedAnswerIndex },
      );
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
    [api, state.currentSessionId, state.currentTestId, token],
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
