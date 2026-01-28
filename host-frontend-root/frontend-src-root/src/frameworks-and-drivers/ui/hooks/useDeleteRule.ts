import { useCallback, useMemo, useState } from 'react';

import { container } from 'src/frameworks-and-drivers/di/container';
import { IDeleteRuleControllerFactory } from 'src/interface-adapters/factories/IDeleteRuleControllerFactory';

export interface UseDeleteRuleResult {
  deletingIds: Set<number>;
  deleteTargetId: number | null;
  deleteError: { ruleId: number; message: string } | null;
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
  const [deleteError, setDeleteError] = useState<{ ruleId: number; message: string } | null>(null);

  const deleteController = useMemo(() => {
    const factory = container.resolve<IDeleteRuleControllerFactory>('IDeleteRuleControllerFactory');
    return factory.create(
      (ruleId: number) => {
        onDeleteSuccess(ruleId);
      },
      (ruleId: number, message: string) => {
        setDeleteError({ ruleId, message });
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

    await deleteController.deleteRule(ruleId);

    setDeletingIds((prev) => {
      const next = new Set(prev);
      next.delete(ruleId);
      return next;
    });
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
