import { ToastNotification } from 'src/frameworks-and-drivers/ui/components/atoms/ToastNotification';
import { ConfirmDialog } from 'src/frameworks-and-drivers/ui/components/organisms/ConfirmDialog';

export interface DeleteRuleUIProps {
  isDeleteDialogOpen: boolean;
  deleteError: { ruleId: number; message: string } | null;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  onCloseDeleteError: () => void;
}

export function DeleteRuleUI({
  isDeleteDialogOpen,
  deleteError,
  onConfirmDelete,
  onCancelDelete,
  onCloseDeleteError,
}: DeleteRuleUIProps) {
  return (
    <>
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="ルールの削除"
        message="このルールを削除しますか？"
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
        confirmLabel="削除"
        cancelLabel="キャンセル"
      />

      <ToastNotification
        message={
          deleteError 
            ? `ルール ${deleteError.ruleId} の削除処理中にエラーが発生しました: ${deleteError.message}` 
            : ''
        }
        type="error"
        isVisible={deleteError !== null}
        onClose={onCloseDeleteError}
      />
    </>
  );
}