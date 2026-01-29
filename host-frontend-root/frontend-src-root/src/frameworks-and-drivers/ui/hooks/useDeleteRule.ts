import { useCallback, useMemo, useState } from 'react';

import { container } from 'src/frameworks-and-drivers/di/container';
import { IDeleteRuleControllerFactory } from 'src/interface-adapters/factories/IDeleteRuleControllerFactory';

export interface UseDeleteRuleResult {
  deletingIds: Set<number>;
  deleteTargetId: number | null;
  deleteError: string | null;
  handleDelete: (ruleId: number) => void;
  confirmDelete: () => Promise<void>;
  cancelDelete: () => void;
  dismissDeleteError: () => void;
}

/**
 * ルール削除に関するState管理とロジックを提供するカスタムフック
 *
 * @param onDeleteSuccess - 削除成功時にrulesのStateを更新するコールバック
 */
export const useDeleteRule = (
  onDeleteSuccess: (ruleId: number) => void
): UseDeleteRuleResult => {
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteController = useMemo(() => {
    const factory = container.resolve<IDeleteRuleControllerFactory>('IDeleteRuleControllerFactory');
    return factory.create(
      (ruleId: number) => {
        onDeleteSuccess(ruleId);
      },
      (formattedMessage: string) => {
        setDeleteError(formattedMessage);
      }
    );
  }, [onDeleteSuccess]);

  const handleDelete = useCallback((ruleId: number) => {
    if (deletingIds.has(ruleId)) {
      return;
    }
    setDeleteError(null);
    setDeleteTargetId(ruleId);
  }, [deletingIds]);

  const confirmDelete = useCallback(async () => {
    if (deleteTargetId === null || deletingIds.has(deleteTargetId)) {
      return;
    }

    const ruleId = deleteTargetId;
    setDeleteTargetId(null);
    setDeletingIds((prev) => new Set(prev).add(ruleId));

    try {
      await deleteController.deleteRule(ruleId);
    } catch {
      // エラーは onError コールバック経由で deleteError State に通知済み
      // void confirmDelete() で呼び出されるため、ここで握りつぶして未処理のPromise拒否を防ぐ
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(ruleId);
        return next;
      });
    }
  }, [deleteTargetId, deletingIds, deleteController]);

  const cancelDelete = useCallback(() => {
    setDeleteTargetId(null);
  }, []);

  const dismissDeleteError = useCallback(() => {
    setDeleteError(null);
  }, []);

  return {
    deletingIds,
    deleteTargetId,
    deleteError,
    handleDelete,
    confirmDelete,
    cancelDelete,
    dismissDeleteError,
  };
};
