import React from 'react';

/**
 * ConfirmDialogコンポーネントのProps
 */
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

/**
 * 確認ダイアログコンポーネント（スケルトン）
 * Phase 2で実装予定
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = '削除',
  cancelLabel = 'キャンセル',
}) => {
  // Phase 2で実装予定: モーダルダイアログの表示、アクセシビリティ対応
  if (!isOpen) {
    return null;
  }

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
      <h2 id="confirm-dialog-title">{title}</h2>
      <p>{message}</p>
      <div>
        <button type="button" onClick={onCancel}>
          {cancelLabel}
        </button>
        <button type="button" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </div>
  );
};
