import { useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type ApiError = {
  message: string;
  status?: number;
};

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function request<T>(
  path: string,
  method: HttpMethod,
  token?: string | null,
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${apiBase}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    const error: ApiError = {
      message: text || res.statusText,
      status: res.status,
    };
    throw error;
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export const useApiClient = () => {
  const { token } = useAuth();

  const get = useCallback(
    async <T>(path: string) => request<T>(path, 'GET', token),
    [token],
  );
  const post = useCallback(
    async <T>(path: string, body?: unknown) => request<T>(path, 'POST', token, body),
    [token],
  );
  const put = useCallback(
    async <T>(path: string, body?: unknown) => request<T>(path, 'PUT', token, body),
    [token],
  );
  const del = useCallback(
    async <T>(path: string) => request<T>(path, 'DELETE', token),
    [token],
  );

  return useMemo(
    () => ({
      get,
      post,
      put,
      del,
    }),
    [get, post, put, del],
  );
};
