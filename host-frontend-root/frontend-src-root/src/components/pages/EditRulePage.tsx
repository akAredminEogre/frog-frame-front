import React, { useState, useEffect } from 'react';
import { RewriteRuleForm } from '../organisms/RewriteRuleForm';
import { container } from 'src/infrastructure/di/container';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { LoadRewriteRuleForEditUseCase } from 'src/application/usecases/rule/LoadRewriteRuleForEditUseCase';
import { UpdateRewriteRuleUseCase } from 'src/application/usecases/rule/UpdateRewriteRuleUseCase';
import { RefreshAllTabsAfterRuleUpdateUseCase } from 'src/application/usecases/rule/RefreshAllTabsAfterRuleUpdateUseCase';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';

interface RewriteRuleFormData {
  oldString: string;
  newString: string;
  urlPattern: string;
  isRegex: boolean;
}

interface EditRulePageProps {
  ruleId?: string; // 編集対象のルールID（URLパラメータから取得想定）
}

export const EditRulePage: React.FC<EditRulePageProps> = ({ ruleId }) => {
  const [rule, setRule] = useState<RewriteRuleFormData>({
    oldString: '',
    newString: '',
    urlPattern: '',
    isRegex: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 編集対象のルールデータを読み込み
  useEffect(() => {
    const loadRule = async () => {
      if (!ruleId) return;
      
      setIsLoading(true);
      setError(null);
      try {
        const repository = container.resolve<IRewriteRuleRepository>('IRewriteRuleRepository');
        const loadUseCase = new LoadRewriteRuleForEditUseCase(repository);
        const loadedRule = await loadUseCase.execute(ruleId);
        
        if (loadedRule) {
          setRule({
            oldString: loadedRule.oldString,
            newString: loadedRule.newString,
            urlPattern: loadedRule.urlPattern || '',
            isRegex: loadedRule.isRegex
          });
        } else {
          setError(`Rule with ID "${ruleId}" not found`);
        }
      } catch (error) {
        console.error('Failed to load rule:', error);
        setError('Failed to load rule data');
      } finally {
        setIsLoading(false);
      }
    };

    loadRule();
  }, [ruleId]);

  const handleRuleChange = (updatedRule: RewriteRuleFormData) => {
    setRule(updatedRule);
  };

  const handleSave = async () => {
    if (!ruleId) return;
    
    setIsSaving(true);
    try {
      const repository = container.resolve<IRewriteRuleRepository>('IRewriteRuleRepository');
      const updateUseCase = new UpdateRewriteRuleUseCase(repository);
      
      // 更新されたルールエンティティを作成
      const updatedRule = new RewriteRule(
        ruleId,
        rule.oldString,
        rule.newString,
        rule.urlPattern,
        rule.isRegex
      );
      
      await updateUseCase.execute(updatedRule);
      
      // ルール更新後、該当タブの内容を更新（失敗してもルール保存は成功）
      try {
        const chromeTabsService = container.resolve<IChromeTabsService>('IChromeTabsService');
        const refreshTabsUseCase = new RefreshAllTabsAfterRuleUpdateUseCase(chromeTabsService);
        await refreshTabsUseCase.execute(updatedRule);
      } catch (refreshError) {
        console.warn('Failed to refresh tabs, but rule was saved successfully:', refreshError);
      }
      
      alert('Rule updated successfully!');
    } catch (error) {
      console.error('Failed to save rule:', error);
      alert('Failed to save rule');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Loading rule data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <RewriteRuleForm
        rule={rule}
        onRuleChange={handleRuleChange}
        onSave={handleSave}
        isLoading={isSaving}
        title="fklf: Edit Rewrite Rule"
      />
    </div>
  );
};
