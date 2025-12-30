import { useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import { usePreventScroll } from '@react-aria/overlays';
import React, { ReactNode, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

import styles from 'src/frameworks-and-drivers/ui/components/molecules/ModalDialogBase/ModalDialogBase.module.css';
import { useDialogIds } from 'src/frameworks-and-drivers/ui/hooks';

/**
 * ModalDialogBaseコンポーネントのProps
 */
export interface ModalDialogBaseProps {
  /** ダイアログが開いているかどうか */
  isOpen: boolean;
  /** ダイアログを閉じるハンドラ（Escapeキー、オーバーレイクリック時に呼ばれる） */
  onClose: () => void;
  /** ダイアログのタイトル */
  title: string;
  /** ダイアログの説明文（任意） */
  description?: string;
  /** ダイアログのコンテンツ（ボタンなど） */
  children: ReactNode;
  /** ID生成用の接頭辞（デフォルト: 'modal-dialog'） */
  idPrefix?: string;
  /** ダイアログのカスタムクラス名 */
  dialogClassName?: string;
  /** data-testid（デフォルト: 'modal-dialog'） */
  testId?: string;
}

/**
 * ADR-007準拠のモーダルダイアログベースコンポーネント
 *
 * WAI-ARIA Dialog Modal Patternに準拠した以下の機能を提供：
 * - ARIA属性（role="dialog", aria-modal, aria-labelledby, aria-describedby, tabIndex={-1}）
 * - フォーカストラップ（FocusScope contain）
 * - フォーカス復元（FocusScope restoreFocus）
 * - 背景スクロール無効化（usePreventScroll）
 * - Escapeキーでダイアログを閉じる
 * - オーバーレイクリックでダイアログを閉じる
 * - ポータルレンダリング（createPortal）
 *
 * @example
 * ```tsx
 * <ModalDialogBase
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   title="確認"
 *   description="本当に削除しますか？"
 * >
 *   <button onClick={handleCancel}>キャンセル</button>
 *   <button onClick={handleConfirm}>削除</button>
 * </ModalDialogBase>
 * ```
 */
export const ModalDialogBase: React.FC<ModalDialogBaseProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  idPrefix = 'modal-dialog',
  dialogClassName,
  testId = 'modal-dialog',
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // ARIA用ID生成（ADR-007 1.1準拠）
  const { titleId, descriptionId } = useDialogIds(idPrefix);

  // React Aria: usePreventScroll - 背景スクロールを無効化
  usePreventScroll({ isDisabled: !isOpen });

  // React Aria: useDialog - ダイアログのセマンティクス
  const { dialogProps } = useDialog(
    {
      'aria-labelledby': titleId,
      'aria-describedby': description ? descriptionId : undefined,
      role: 'dialog',
    },
    dialogRef
  );

  // キーボードイベント処理（Escape キー）
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    },
    [onClose]
  );

  // オーバーレイクリック処理
  const handleOverlayClick = useCallback(
    (event: React.MouseEvent) => {
      // ダイアログ本体をクリックした場合は何もしない
      if (dialogRef.current?.contains(event.target as Node)) {
        return;
      }
      onClose();
    },
    [onClose]
  );

  if (!isOpen) {
    return null;
  }

  const dialogContent = (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      data-testid={`${testId}-overlay`}
    >
      <FocusScope contain restoreFocus>
        <div
          {...dialogProps}
          ref={dialogRef}
          className={`${styles.dialog} ${dialogClassName || ''}`}
          onKeyDown={handleKeyDown}
          aria-modal="true"
          tabIndex={-1}
          data-testid={testId}
        >
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          {description && (
            <p id={descriptionId} className={styles.description}>
              {description}
            </p>
          )}
          {children}
        </div>
      </FocusScope>
    </div>
  );

  // ポータルでdocument.bodyにレンダリング
  return createPortal(dialogContent, document.body);
};
