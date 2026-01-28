import { useMemo, useState } from 'react';

import { container } from 'src/frameworks-and-drivers/di/container';
import { IDeleteRuleControllerFactory } from 'src/interface-adapters/factories/IDeleteRuleControllerFactory';

export interface UseDeleteRuleReturn {
  deletingIds: Set<number>;
  deleteTargetId: number | null;
  deleteError: { ruleId: number; message: string } | null;
  handleDelete: (ruleId: number) => void;
  confirmDelete: () => Promise<void>;
  cancelDelete: () => void;
  clearDeleteError: () => void;
}

export function useDeleteRule(onRuleDeleted: (ruleId: number) => void): UseDeleteRuleReturn {
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<{ ruleId: number; message: string } | null>(null);

  const deleteController = useMemo(() => {
    const factory = container.resolve<IDeleteRuleControllerFactory>('IDeleteRuleControllerFactory');
    return factory.create(
      onRuleDeleted,
      (ruleId: number, message: string) => {
        setDeleteError({ ruleId, message });
      }
    );
  }, [onRuleDeleted]);

  const handleDelete = (ruleId: number) => {
    if (deletingIds.has(ruleId)) {
      return;
    }
    setDeleteError(null);
    setDeleteTargetId(ruleId);
  };

  const confirmDelete = async () => {
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
  };

  const cancelDelete = () => {
    setDeleteTargetId(null);
  };

  const clearDeleteError = () => {
    setDeleteError(null);
  };

  return {
    deletingIds,
    deleteTargetId,
    deleteError,
    handleDelete,
    confirmDelete,
    cancelDelete,
    clearDeleteError,
  };
}