import React from 'react';

import styles from 'src/components/molecules/LoadingMessage/LoadingMessage.module.css';

interface LoadingMessageProps {
  message?: string;
}

const LoadingMessage: React.FC<LoadingMessageProps> = ({ 
  message = 'データを読み込み中...' 
}) => {
  return (
    <div className={styles.loadingMessage}>
      <div className={styles.spinner} />
      <p className={styles.message}>{message}</p>
    </div>
  );
};

export default LoadingMessage;