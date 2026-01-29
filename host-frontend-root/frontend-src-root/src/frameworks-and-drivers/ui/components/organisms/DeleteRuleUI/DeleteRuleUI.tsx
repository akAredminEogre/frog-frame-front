import React from 'react';

import { ToastNotification } from 'src/frameworks-and-drivers/ui/components/atoms/ToastNotification';
import { ConfirmDialog } from 'src/frameworks-and-drivers/ui/components/organisms/ConfirmDialog';

export interface DeleteRuleUIProps {
  deleteTargetId: number | null;
  deleteError: string | null;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  onDismissError: () => void;
}

/**
 * ルール削除に関するUI（確認ダイアログとエラーToast通知）を統合するコンポーネント
 */
export const DeleteRuleUI: React.FC<DeleteRuleUIProps> = ({
  deleteTargetId,
  deleteError,
  onConfirmDelete,
  onCancelDelete,
  onDismissError,
}) => {
  return (
    <>
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="ルールの削除"
        message="このルールを削除しますか？"
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
        confirmLabel="削除"
        cancelLabel="キャンセル"
      />

      <ToastNotification
        message={deleteError ?? ''}
        type="error"
        isVisible={deleteError !== null}
        onClose={onDismissError}
      />
    </>
  );
};
