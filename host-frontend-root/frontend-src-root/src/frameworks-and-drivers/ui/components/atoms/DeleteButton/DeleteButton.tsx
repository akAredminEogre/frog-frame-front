import React from 'react';

import styles from 'src/frameworks-and-drivers/ui/components/atoms/DeleteButton/DeleteButton.module.css';
import { TrashIcon } from 'src/frameworks-and-drivers/ui/components/atoms/DeleteButton/TrashIcon';

/**
 * DeleteButtonコンポーネントのProps
 */
export interface DeleteButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

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
      data-testid="delete-button"
    >
      <TrashIcon className={styles.icon} />
    </button>
  );
};
