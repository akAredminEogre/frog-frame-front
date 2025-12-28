import React from 'react';

/**
 * ToastNotificationコンポーネントのProps
 */
interface ToastNotificationProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

/**
 * トースト通知コンポーネント（スケルトン）
 * Phase 2で実装予定
 */
export const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  type,
  isVisible,
  onClose,
}) => {
  // Phase 2で実装予定: トースト表示、自動非表示、アニメーション
  if (!isVisible) {
    return null;
  }

  return (
    <div role="alert" aria-live="polite" data-type={type}>
      <span>{message}</span>
      <button type="button" onClick={onClose} aria-label="閉じる">
        &times;
      </button>
    </div>
  );
};
