import { FocusScope } from '@react-aria/focus';
import React, { ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';

import styles from 'src/frameworks-and-drivers/ui/components/molecules/ModalDialogBase/ModalDialogBase.module.css';

/**
 * ModalDialogBaseUIコンポーネントのProps
 */
export interface ModalDialogBaseUIProps {
  /** ダイアログのタイトル */
  title: string;
  /** ダイアログの説明文（任意） */
  description?: string;
  /** ダイアログのコンテンツ（ボタンなど） */
  children: ReactNode;
  /** タイトル要素のID（aria-labelledby用） */
  titleId: string;
  /** 説明文要素のID（aria-describedby用） */
  descriptionId: string;
  /** ダイアログ要素のref */
  dialogRef: RefObject<HTMLDivElement | null>;
  /** useDialogから取得したprops */
  dialogProps: React.HTMLAttributes<HTMLElement>;
  /** キーボードイベントハンドラ */
  onKeyDown: (event: React.KeyboardEvent) => void;
  /** オーバーレイクリックハンドラ */
  onOverlayClick: (event: React.MouseEvent) => void;
  /** ダイアログのカスタムクラス名 */
  dialogClassName?: string;
  /** data-testid（デフォルト: 'modal-dialog'） */
  testId?: string;
}

/**
 * ModalDialogBaseのPresentationalコンポーネント（ADR-009準拠）
 *
 * 純粋な表示のみを担当し、すべてのデータとハンドラをpropsで受け取る。
 * ビジネスロジックやReact Ariaフックの管理はContainer層で行う。
 */
export const ModalDialogBaseUI: React.FC<ModalDialogBaseUIProps> = ({
  title,
  description,
  children,
  titleId,
  descriptionId,
  dialogRef,
  dialogProps,
  onKeyDown,
  onOverlayClick,
  dialogClassName,
  testId = 'modal-dialog',
}) => {
  const dialogContent = (
    <div
      className={styles.overlay}
      onClick={onOverlayClick}
      data-testid={`${testId}-overlay`}
    >
      <FocusScope contain restoreFocus>
        <div
          {...dialogProps}
          ref={dialogRef}
          className={`${styles.dialog} ${dialogClassName || ''}`}
          onKeyDown={onKeyDown}
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
