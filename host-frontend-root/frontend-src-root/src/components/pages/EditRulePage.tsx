import React, { useState, useEffect } from 'react';
import { RewriteRuleForm } from '../organisms/RewriteRuleForm';
import { container } from 'src/infrastructure/di/container';
import { LoadRewriteRuleForEditUseCase } from 'src/application/usecases/rule/LoadRewriteRuleForEditUseCase';
import { UpdateRewriteRuleUseCase } from 'src/application/usecases/rule/UpdateRewriteRuleUseCase';
import { CloseCurrentWindowUseCase } from 'src/application/usecases/window/CloseCurrentWindowUseCase';
import { RewriteRuleParams } from 'src/application/types/RewriteRuleParams';

interface EditRulePageProps {
  ruleId?: string; // 編集対象のルールID（URLパラメータから取得想定、numberに変換して使用）
}

export const EditRulePage: React.FC<EditRulePageProps> = ({ ruleId }) => {
  const [rule, setRule] = useState<RewriteRuleParams>({
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
        const loadUseCase = container.resolve(LoadRewriteRuleForEditUseCase);
        const loadedRule = await loadUseCase.execute(Number(ruleId));
        
        if (loadedRule) {
          setRule(loadedRule);
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

  const handleRuleChange = (updatedRule: RewriteRuleParams) => {
    setRule(updatedRule);
  };

  const handleSave = async () => {
    if (!ruleId) return;
    
    setIsSaving(true);
    try {
      const updateUseCase = container.resolve(UpdateRewriteRuleUseCase);
      await updateUseCase.execute(Number(ruleId), rule);
      
      alert('Rule updated successfully!');
    } catch (error) {
      console.error('Failed to save rule:', error);
      alert('Failed to save rule');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async () => {
    const closeWindowUseCase = container.resolve(CloseCurrentWindowUseCase);
    await closeWindowUseCase.execute();
  };

  return (
    <div>
      <RewriteRuleForm
        rule={rule}
        onRuleChange={handleRuleChange}
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={isSaving}
        isLoadingData={isLoading}
        error={error}
        title="fklf: Edit Rewrite Rule"
      />
    </div>
  );
};
