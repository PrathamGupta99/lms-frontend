import React from 'react';

export const Loader = () => {
  return (
    <div className="loader">
      <div className="spinner" />
      <span>Loading...</span>
      <style jsx>{`
        .loader {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--muted, #8891a7);
        }
        .spinner {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-top-color: var(--accent, #7bdcb5);
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
