import React from 'react';

type Props = {
  message?: string;
};

export const ErrorMessage = ({ message }: Props) => {
  if (!message) return null;
  return (
    <div className="error-box">
      {message}
      <style jsx>{`
        .error-box {
          padding: 10px 12px;
          border-radius: 10px;
          background: rgba(255, 99, 132, 0.12);
          color: #ff6b81;
          border: 1px solid rgba(255, 99, 132, 0.25);
          font-weight: 600;
          font-size: 0.95rem;
        }
      `}</style>
    </div>
  );
};
