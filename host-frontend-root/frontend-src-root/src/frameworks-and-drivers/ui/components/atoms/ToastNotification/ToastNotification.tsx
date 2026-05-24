import React from 'react';

import styles from 'src/frameworks-and-drivers/ui/components/atoms/ToastNotification/ToastNotification.module.css';

/**
 * ToastNotificationコンポーネントのProps
 */
export interface ToastNotificationProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

/**
 * トースト通知コンポーネント
 * 成功/エラーメッセージを画面下部に表示する
 * アクセシビリティ対応: role="alert", aria-live="polite"を設定
 */
export const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  type,
  isVisible,
  onClose,
}) => {
  if (!isVisible) {
    return null;
  }

  const toastClassName = `${styles.toast} ${styles[type]}`;

  return (
    <div
      role="alert"
      aria-live="polite"
      data-type={type}
      className={toastClassName}
    >
      <span className={styles.message}>{message}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="閉じる"
        className={styles.closeButton}
      >
        &times;
      </button>
    </div>
  );
};
