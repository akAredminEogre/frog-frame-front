import 'src/frameworks-and-drivers/ui/pages/rules/style.css';

import { useEffect, useState } from 'react';

import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { GetAllRewriteRulesUseCase } from 'src/application/usecases/rule/GetAllRewriteRulesUseCase';
import { OpenRuleEditPageUseCase } from 'src/application/usecases/rule/OpenRuleEditPageUseCase';
import ErrorMessage from 'src/components/molecules/ErrorMessage/ErrorMessage';
import LoadingMessage from 'src/components/molecules/LoadingMessage/LoadingMessage';
import EmptyStateMessage from 'src/components/organisms/EmptyStateMessage/EmptyStateMessage';
import RulesTable from 'src/components/organisms/RulesTable/RulesTable';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { container } from 'src/frameworks-and-drivers/di/container';
import { ToggleRuleActiveController } from 'src/interface-adapters/controllers/ToggleRuleActiveController';

function RulesApp() {
  const [rules, setRules] = useState<RewriteRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleToggle = async (ruleId: number, isActive: boolean) => {
    setRules((prevRules) =>
      prevRules.map((rule) =>
        rule.id === ruleId ? rule.withActive(isActive) : rule
      )
    );

    const toggleController = container.resolve(ToggleRuleActiveController);
    await toggleController.toggleActive(ruleId);
  };

  return (
    <div className="container">
      <h1>保存されたルール一覧</h1>

      {rules.length === 0 ? (
        <EmptyStateMessage />
      ) : (
        <RulesTable rules={rules} onEdit={handleEdit} onToggle={handleToggle} />
      )}
      
      <div className="footer">
        <p>合計 {rules.length} 件のルールが保存されています</p>
      </div>
    </div>
  );
}

export default RulesApp;
