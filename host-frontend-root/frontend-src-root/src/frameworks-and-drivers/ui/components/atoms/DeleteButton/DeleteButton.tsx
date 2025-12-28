import React from 'react';

import { Button } from 'src/components/atoms/Button';

/**
 * DeleteButtonコンポーネントのProps
 */
export interface DeleteButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

/**
 * ルール削除用のゴミ箱アイコンボタン（スケルトン）
 * Phase 2で実装予定: ゴミ箱アイコンの表示、アクセシビリティ対応
 *
 * 既存のButtonコンポーネントをラップして一貫性を保つ
 * (SaveButton, CancelButtonと同様のパターン)
 */
export const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  // Phase 2で実装予定: ゴミ箱アイコンの表示、aria-label対応
  return (
    <Button onClick={onClick} disabled={disabled} variant="secondary">
      {/* Phase 2でゴミ箱アイコンを追加 */}
      削除
    </Button>
  );
};
