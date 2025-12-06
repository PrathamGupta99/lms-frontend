"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

type Toast = { id: number; message: string; type: 'success' | 'error' };

type ToastContextType = {
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error') => void;
  removeToast: (id: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: 'success' | 'error' = 'success') => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => removeToast(id), 3000);
    },
    [removeToast],
  );

  const value = useMemo(
    () => ({
      toasts,
      addToast,
      removeToast,
    }),
    [toasts, addToast, removeToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>
      <style jsx>{`
        .toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          display: grid;
          gap: 8px;
          z-index: 9999;
        }
        .toast {
          padding: 10px 14px;
          border-radius: 10px;
          color: #0b1021;
          font-weight: 700;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        .toast.success {
          background: #7bdcb5;
        }
        .toast.error {
          background: #ff6b81;
          color: #fff;
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
};
