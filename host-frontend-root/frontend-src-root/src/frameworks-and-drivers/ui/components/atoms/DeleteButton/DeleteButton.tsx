import React from 'react';

/**
 * DeleteButtonコンポーネントのProps
 */
export interface DeleteButtonProps {
  onClick: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}

/**
 * ルール削除用のゴミ箱アイコンボタン（スケルトン）
 * Phase 2で実装予定
 */
export const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick,
  disabled = false,
  ariaLabel = 'ルールを削除',
}) => {
  // Phase 2で実装予定: ゴミ箱アイコンの表示、クリックイベント通知
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {/* Phase 2でアイコンを追加 */}
      Delete
    </button>
  );
};
