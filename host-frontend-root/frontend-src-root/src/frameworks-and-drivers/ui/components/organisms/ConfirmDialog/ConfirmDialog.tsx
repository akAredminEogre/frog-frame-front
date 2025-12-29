import React, { useCallback, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

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
 * WAI-ARIA Dialog Modal Patternに準拠したアクセシビリティを実装（ADR-007）
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
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<Element | null>(null);

  // useIdで一意のIDを生成（複数ダイアログの同時レンダリング対応）
  const uniqueId = useId();
  const titleId = `confirm-dialog-title-${uniqueId}`;
  const messageId = `confirm-dialog-message-${uniqueId}`;

  // 初期フォーカスと復帰フォーカスの管理
  useEffect(() => {
    if (isOpen) {
      // 現在のフォーカス要素を保存
      previousActiveElementRef.current = document.activeElement;
      // キャンセルボタン（最初のフォーカス可能要素）にフォーカス
      cancelButtonRef.current?.focus();
      // 背景スクロールを無効化
      document.body.style.overflow = 'hidden';
    } else {
      // 背景スクロールを復元
      document.body.style.overflow = '';
      // フォーカスを元の要素に戻す
      if (previousActiveElementRef.current instanceof HTMLElement) {
        previousActiveElementRef.current.focus();
      }
    }

    return () => {
      // コンポーネントがアンマウントされた場合にも背景スクロールとフォーカスを復元
      document.body.style.overflow = '';
      if (previousActiveElementRef.current instanceof HTMLElement) {
        previousActiveElementRef.current.focus();
      }
    };
  }, [isOpen]);

  // キーボードイベント処理
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
        return;
      }

      // フォーカストラップの実装
      if (event.key === 'Tab') {
        const focusableElements = [cancelButtonRef.current, confirmButtonRef.current].filter(
          (el): el is HTMLButtonElement => el !== null
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          // Shift+Tab: 最初の要素から最後の要素へ
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: 最後の要素から最初の要素へ
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [onCancel]
  );

  // オーバーレイクリック処理
  const handleOverlayClick = useCallback(
    (event: React.MouseEvent) => {
      // ダイアログ本体をクリックした場合は何もしない
      if (dialogRef.current?.contains(event.target as Node)) {
        return;
      }
      onCancel();
    },
    [onCancel]
  );

  if (!isOpen) {
    return null;
  }

  const dialogContent = (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      data-testid="confirm-dialog-overlay"
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
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
            onClick={onCancel}
            data-testid="confirm-dialog-cancel-button"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            className={`${styles.button} ${styles.confirmButton}`}
            onClick={onConfirm}
            data-testid="confirm-dialog-confirm-button"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );

  // ポータルでdocument.bodyにレンダリング
  return createPortal(dialogContent, document.body);
};
