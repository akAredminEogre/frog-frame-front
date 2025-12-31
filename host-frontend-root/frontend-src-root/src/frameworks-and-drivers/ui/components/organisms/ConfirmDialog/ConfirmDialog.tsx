import React, { useMemo } from 'react';

import { ModalDialogBase } from 'src/frameworks-and-drivers/ui/components/molecules/ModalDialogBase';
import styles from 'src/frameworks-and-drivers/ui/components/organisms/ConfirmDialog/ConfirmDialog.module.css';
import {
  useInitialFocus,
  useProcessingGuard,
} from 'src/frameworks-and-drivers/ui/hooks';

/**
 * ConfirmDialogコンポーネントのProps
 */
export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

/**
 * 確認ダイアログコンポーネント
 *
 * ModalDialogBaseを使用したWAI-ARIA Dialog Modal Patternに準拠した実装（ADR-007）。
 * ダイアログの共通機能（ARIA属性、フォーカス管理、キーボード操作等）は
 * ModalDialogBaseに委譲し、確認ダイアログ固有のUI（ボタン配置）のみを実装。
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
  // 連続クリック防止
  const { isProcessing, guardedHandler } = useProcessingGuard(isOpen);

  // 初期フォーカス設定（キャンセルボタンにフォーカス）
  const cancelButtonRef = useInitialFocus<HTMLButtonElement>(isOpen);

  // ガード済みハンドラをメモ化（レンダリングごとの再生成を防止）
  const handleCancel = useMemo(
    () => guardedHandler(onCancel),
    [guardedHandler, onCancel]
  );
  const handleConfirm = useMemo(
    () => guardedHandler(onConfirm),
    [guardedHandler, onConfirm]
  );

  return (
    <ModalDialogBase
      isOpen={isOpen}
      onClose={handleCancel}
      title={title}
      description={message}
      idPrefix="confirm-dialog"
      testId="confirm-dialog"
    >
      <div className={styles.buttonContainer}>
        <button
          ref={cancelButtonRef}
          type="button"
          className={`${styles.button} ${styles.cancelButton}`}
          onClick={handleCancel}
          disabled={isProcessing}
          data-testid="confirm-dialog-cancel-button"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          className={`${styles.button} ${styles.confirmButton}`}
          onClick={handleConfirm}
          disabled={isProcessing}
          data-testid="confirm-dialog-confirm-button"
        >
          {confirmLabel}
        </button>
      </div>
    </ModalDialogBase>
  );
};
