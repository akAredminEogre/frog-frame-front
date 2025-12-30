import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import { usePreventScroll } from '@react-aria/overlays';

import styles from 'src/frameworks-and-drivers/ui/components/organisms/ConfirmDialog/ConfirmDialog.module.css';

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
 * React Aria (@react-aria/dialog, @react-aria/focus, @react-aria/overlays) を使用した
 * WAI-ARIA Dialog Modal Patternに準拠したアクセシビリティ実装（ADR-007）
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
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // 連続クリック防止用の状態（視覚的フィードバック用）
  const [isProcessing, setIsProcessing] = useState(false);
  // 連続クリック防止用のref（即座に更新される、同期的なクリックガード用）
  const isProcessingRef = useRef(false);

  // ダイアログが開かれたときにisProcessingをリセット
  // （コンポーネントがアンマウントされずに再利用される場合の対策）
  useEffect(() => {
    if (isOpen) {
      setIsProcessing(false);
      isProcessingRef.current = false;
    }
  }, [isOpen]);

  // useIdで一意のIDを生成（複数ダイアログの同時レンダリング対応）
  const uniqueId = useId();
  const titleId = `confirm-dialog-title-${uniqueId}`;
  const messageId = `confirm-dialog-message-${uniqueId}`;

  // 連続クリック防止付きの確認ボタンハンドラ
  const handleConfirm = useCallback(() => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setIsProcessing(true);
    onConfirm();
  }, [onConfirm]);

  // 連続クリック防止付きのキャンセルハンドラ
  const handleCancel = useCallback(() => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setIsProcessing(true);
    onCancel();
  }, [onCancel]);

  // React Aria: usePreventScroll - 背景スクロールを無効化
  usePreventScroll({ isDisabled: !isOpen });

  // React Aria: useDialog - ダイアログのセマンティクス
  const { dialogProps } = useDialog(
    {
      'aria-labelledby': titleId,
      'aria-describedby': messageId,
      role: 'dialog',
    },
    dialogRef
  );

  // キーボードイベント処理（Escape キー）
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleCancel();
      }
    },
    [handleCancel]
  );

  // オーバーレイクリック処理
  const handleOverlayClick = useCallback(
    (event: React.MouseEvent) => {
      // ダイアログ本体をクリックした場合は何もしない
      if (dialogRef.current?.contains(event.target as Node)) {
        return;
      }
      handleCancel();
    },
    [handleCancel]
  );

  // 初期フォーカスの設定
  useEffect(() => {
    if (isOpen && cancelButtonRef.current) {
      // FocusScopeのautoFocusが効かない場合のフォールバック
      cancelButtonRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const dialogContent = (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      data-testid="confirm-dialog-overlay"
    >
      <FocusScope contain restoreFocus autoFocus>
        <div
          {...dialogProps}
          ref={dialogRef}
          className={styles.dialog}
          onKeyDown={handleKeyDown}
          aria-modal="true"
          data-testid="confirm-dialog"
        >
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <p id={messageId} className={styles.message}>
            {message}
          </p>
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
        </div>
      </FocusScope>
    </div>
  );

  // ポータルでdocument.bodyにレンダリング
  return createPortal(dialogContent, document.body);
};
