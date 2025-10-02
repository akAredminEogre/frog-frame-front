import React, { useState, useEffect } from 'react';
import { RewriteRuleForm } from '../organisms/RewriteRuleForm';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { container } from 'src/infrastructure/di/container';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

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
        const loadedRule = await repository.getById(ruleId);
        
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
      
      // 更新されたルールエンティティを作成
      const updatedRule = new RewriteRule(
        ruleId,
        rule.oldString,
        rule.newString,
        rule.urlPattern,
        rule.isRegex
      );
      
      await repository.update(updatedRule);
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
        ruleId={ruleId}
      />
    </div>
  );
};
