import React from 'react';

import styles from 'src/frameworks-and-drivers/ui/components/atoms/DeleteButton/DeleteButton.module.css';

/**
 * DeleteButtonコンポーネントのProps
 */
export interface DeleteButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

/**
 * ゴミ箱アイコンSVGコンポーネント
 * シンプルなゴミ箱のアウトラインアイコン
 */
const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

/**
 * ルール削除用のゴミ箱アイコンボタン
 * ゴミ箱アイコンを表示し、クリック時にonClickコールバックを呼び出す
 * アクセシビリティ対応: aria-label="ルールを削除"を設定
 */
export const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      className={styles.deleteButton}
      onClick={onClick}
      disabled={disabled}
      aria-label="ルールを削除"
    >
      <TrashIcon className={styles.icon} />
    </button>
  );
};
