import React from 'react';

interface LoadingMessageProps {
  message?: string;
}

export const LoadingMessage: React.FC<LoadingMessageProps> = ({ 
  message = 'ルールを読み込んでいます...' 
}) => {
  return (
    <div className="container">
      <div className="loading">{message}</div>
    </div>
  );
};