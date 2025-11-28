import { container } from 'src/infrastructure/di/container';

import React, { useEffect, useState } from 'react';

import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { GetAllRewriteRulesUseCase } from 'src/application/usecases/rule/GetAllRewriteRulesUseCase';
import { OpenRuleEditPageUseCase } from 'src/application/usecases/rule/OpenRuleEditPageUseCase';
import { ErrorMessage } from 'src/components/molecules/ErrorMessage';
import { LoadingMessage } from 'src/components/molecules/LoadingMessage';
import { EmptyStateMessage } from 'src/components/organisms/EmptyStateMessage';
import { RulesTable } from 'src/components/organisms/RulesTable';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

export const RulesListPage: React.FC = () => {
  const [rules, setRules] = useState<RewriteRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleEdit = async (ruleId: string | number) => {
    const chromeTabsService = container.resolve<IChromeTabsService>('IChromeTabsService');
    const openRuleEditPageUseCase = new OpenRuleEditPageUseCase(chromeTabsService);
    await openRuleEditPageUseCase.execute(ruleId);
  };

  if (loading) {
    return <LoadingMessage />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="container">
      <h1>保存されたルール一覧</h1>
      
      {rules.length === 0 ? (
        <EmptyStateMessage />
      ) : (
        <RulesTable rules={rules} onEditRule={handleEdit} />
      )}
      
      <div className="footer">
        <p>合計 {rules.length} 件のルールが保存されています</p>
      </div>
    </div>
  );
};