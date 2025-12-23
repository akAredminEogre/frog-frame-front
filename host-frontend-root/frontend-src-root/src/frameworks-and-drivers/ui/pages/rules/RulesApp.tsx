import 'src/frameworks-and-drivers/ui/pages/rules/style.css';

import { useEffect, useMemo, useState } from 'react';

import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { GetAllRewriteRulesUseCase } from 'src/application/usecases/rule/GetAllRewriteRulesUseCase';
import { OpenRuleEditPageUseCase } from 'src/application/usecases/rule/OpenRuleEditPageUseCase';
import { ITabsGateway } from 'src/application-business-rules/ports/gateway/ITabsGateway';
import { ToggleRuleActiveInteractor } from 'src/application-business-rules/interactors/ToggleRuleActiveInteractor';
import ErrorMessage from 'src/components/molecules/ErrorMessage/ErrorMessage';
import LoadingMessage from 'src/components/molecules/LoadingMessage/LoadingMessage';
import EmptyStateMessage from 'src/components/organisms/EmptyStateMessage/EmptyStateMessage';
import RulesTable from 'src/components/organisms/RulesTable/RulesTable';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { container } from 'src/frameworks-and-drivers/di/container';
import { ToggleRuleActiveController } from 'src/interface-adapters/controllers/ToggleRuleActiveController';
import { ToggleRuleActivePresenter } from 'src/interface-adapters/presenters/ToggleRuleActivePresenter';

function RulesApp() {
  const [rules, setRules] = useState<RewriteRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set());
  const [toggleError, setToggleError] = useState<{ ruleId: number; message: string } | null>(null);

  const toggleController = useMemo(() => {
    const repository = container.resolve<IRewriteRuleRepository>('IRewriteRuleRepository');
    const tabsGateway = container.resolve<ITabsGateway>('ITabsGateway');
    const presenter = new ToggleRuleActivePresenter(
      (rule: RewriteRule) => {
        setRules((prevRules) =>
          prevRules.map((r) => (r.id === rule.id ? rule : r))
        );
      },
      (ruleId: number, message: string) => {
        setToggleError({ ruleId, message });
      }
    );
    const interactor = new ToggleRuleActiveInteractor(repository, tabsGateway, presenter);
    return new ToggleRuleActiveController(interactor);
  }, [setRules, setToggleError]);

  useEffect(() => {
    // TODO: ロジックをUseCaseに分離するタスクを追加
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
        <RulesTable rules={rules} onEdit={handleEdit} onToggle={handleToggle} togglingIds={togglingIds} />
      )}

      <div className="footer">
        <p>合計 {rules.length} 件のルールが保存されています</p>
      </div>
    </div>
  );
}

export default RulesApp;
