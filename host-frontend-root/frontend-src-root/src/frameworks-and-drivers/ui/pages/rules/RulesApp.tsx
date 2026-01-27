import 'src/frameworks-and-drivers/ui/pages/rules/style.css';

import { useEffect, useMemo, useState } from 'react';

import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';
import { GetAllRewriteRulesUseCase } from 'src/application/usecases/rule/GetAllRewriteRulesUseCase';
import { OpenRuleEditPageUseCase } from 'src/application/usecases/rule/OpenRuleEditPageUseCase';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import ErrorMessage from 'src/components/molecules/ErrorMessage/ErrorMessage';
import LoadingMessage from 'src/components/molecules/LoadingMessage/LoadingMessage';
import EmptyStateMessage from 'src/components/organisms/EmptyStateMessage/EmptyStateMessage';
import RulesTable from 'src/components/organisms/RulesTable/RulesTable';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { container } from 'src/frameworks-and-drivers/di/container';
import { ToastNotification } from 'src/frameworks-and-drivers/ui/components/atoms/ToastNotification';
import { ConfirmDialog } from 'src/frameworks-and-drivers/ui/components/organisms/ConfirmDialog';
import { IDeleteRuleControllerFactory } from 'src/interface-adapters/factories/IDeleteRuleControllerFactory';
import { IToggleRuleActiveControllerFactory } from 'src/interface-adapters/factories/IToggleRuleActiveControllerFactory';

function RulesApp() {
  const [rules, setRules] = useState<RewriteRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [toggleError, setToggleError] = useState<{ ruleId: number; message: string } | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<{ ruleId: number; message: string } | null>(null);

  const toggleController = useMemo(() => {
    const factory = container.resolve<IToggleRuleActiveControllerFactory>('IToggleRuleActiveControllerFactory');
    return factory.create(
      (rule: RewriteRule) => {
        setRules((prevRules) =>
          prevRules.map((r) => (r.id === rule.id ? rule : r))
        );
      },
      (ruleId: number, message: string) => {
        setToggleError({ ruleId, message });
      }
    );
  }, []);

  const deleteController = useMemo(() => {
    const factory = container.resolve<IDeleteRuleControllerFactory>('IDeleteRuleControllerFactory');
    return factory.create(
      (ruleId: number) => {
        setRules((prevRules) => prevRules.filter((r) => r.id !== ruleId));
      },
      (ruleId: number, message: string) => {
        setDeleteError({ ruleId, message });
      }
    );
  }, []);

  useEffect(() => {
    const loadRules = async () => {
      try {
        setLoading(true);
        const repository = container.resolve<IRewriteRuleRepository>('IRewriteRuleRepository');
        const getAllRulesUseCase = new GetAllRewriteRulesUseCase(repository);
        const loadedRules = await getAllRulesUseCase.execute();
        setRules(loadedRules);
      } catch (err) {
        setError('ルールの読み込みに失敗しました: ' + (err instanceof Error ? err.message : String(err)));
      } finally {
        setLoading(false);
      }
    };

    loadRules();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <LoadingMessage message="ルールを読み込んでいます..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <ErrorMessage
          message={error}
          onRetry={() => {
            setError(null);
            setLoading(true);
            const loadRules = async () => {
              try {
                const repository = container.resolve<IRewriteRuleRepository>('IRewriteRuleRepository');
                const getAllRulesUseCase = new GetAllRewriteRulesUseCase(repository);
                const loadedRules = await getAllRulesUseCase.execute();
                setRules(loadedRules);
              } catch (err) {
                setError('ルールの読み込みに失敗しました: ' + (err instanceof Error ? err.message : String(err)));
              } finally {
                setLoading(false);
              }
            };
            loadRules();
          }}
        />
      </div>
    );
  }

  const handleEdit = async (ruleId: string | number) => {
    const chromeTabsService = container.resolve<IChromeTabsService>('IChromeTabsService');
    const openRuleEditPageUseCase = new OpenRuleEditPageUseCase(chromeTabsService);
    await openRuleEditPageUseCase.execute(ruleId);
  };

  const handleToggle = async (ruleId: number) => {
    if (togglingIds.has(ruleId)) {
      return;
    }

    setToggleError(null);
    setTogglingIds((prev) => new Set(prev).add(ruleId));

    await toggleController.toggleActive(ruleId);

    setTogglingIds((prev) => {
      const next = new Set(prev);
      next.delete(ruleId);
      return next;
    });
  };

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

  return (
    <div className="container">
      <h1>保存されたルール一覧</h1>

      {toggleError && (
        <ErrorMessage
          message={`ルール ${toggleError.ruleId} の切り替えに失敗しました: ${toggleError.message}`}
        />
      )}

      {rules.length === 0 ? (
        <EmptyStateMessage />
      ) : (
        <RulesTable
          rules={rules}
          onEdit={handleEdit}
          onToggle={handleToggle}
          onDelete={handleDelete}
          togglingIds={togglingIds}
          deletingIds={deletingIds}
        />
      )}

      <div className="footer" data-testid="rules-footer">
        <p>合計 {rules.length} 件のルールが保存されています</p>
      </div>

      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="ルールの削除"
        message="このルールを削除しますか？"
        onConfirm={() => {
          void confirmDelete();
        }}
        onCancel={cancelDelete}
        confirmLabel="削除"
        cancelLabel="キャンセル"
      />

      <ToastNotification
        message={deleteError ? `ルール ${deleteError.ruleId} の削除処理中にエラーが発生しました: ${deleteError.message}` : ''}
        type="error"
        isVisible={deleteError !== null}
        onClose={() => setDeleteError(null)}
      />
    </div>
  );
}

export default RulesApp;
