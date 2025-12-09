import React from 'react';

import styles from 'src/components/molecules/ErrorMessage/ErrorMessage.module.css';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message = 'データの読み込みに失敗しました',
  onRetry
}) => {
  return (
    <div className={styles.errorMessage}>
      <div className={styles.icon}>⚠️</div>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button 
          className={styles.retryButton}
          onClick={onRetry}
          type="button"
        >
          再試行
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;