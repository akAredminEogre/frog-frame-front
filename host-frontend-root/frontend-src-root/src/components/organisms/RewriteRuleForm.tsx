import React from 'react';

import { RewriteRuleParams } from 'src/application/types/RewriteRuleParams';
import NewStringTextArea from 'src/components/organisms/NewStringTextArea';
import OldStringTextArea from 'src/components/organisms/OldStringTextArea';
import URLPatternInput from 'src/components/organisms/URLPatternInput';

import Title from '../atoms/Title';
import CancelButton from '../molecules/CancelButton';
import SaveButton from '../molecules/SaveButton';

import styles from './RewriteRuleForm.module.css';

interface RewriteRuleFormProps {
  rule: RewriteRuleParams;
  onRuleChange: (rule: RewriteRuleParams) => void;
  onSave: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  isLoadingData?: boolean;
  error?: string | null;
  title?: string; // カスタマイズ可能なタイトル
}

export const RewriteRuleForm: React.FC<RewriteRuleFormProps> = ({
  rule,
  onRuleChange,
  onSave,
  onCancel,
  isLoading = false,
  isLoadingData = false,
  error = null,
  title = "fklf: Rewrite Rule",
}) => {
  
  const handleTextAreaChange = (field: keyof Pick<RewriteRuleParams, 'oldString' | 'newString'>) => 
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onRuleChange({
        ...rule,
        [field]: e.target.value
      });
    };

  
  const handleInputChange = (field: keyof Pick<RewriteRuleParams, 'urlPattern'>) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onRuleChange({
        ...rule,
        [field]: e.target.value
      });
    };
  
  const handleRegexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onRuleChange({
      ...rule,
      isRegex: e.target.checked
    });
  };

  if (isLoadingData) {
    return <div>Loading rule data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.form}>
      <Title level={2}>{title}</Title>
      
      <div className={styles.section}>
        <OldStringTextArea
          value={rule.oldString}
          onChange={handleTextAreaChange('oldString')}
          isRegex={rule.isRegex}
          onRegexChange={handleRegexChange}
        />
      </div>

      <div className={styles.section}>
        <NewStringTextArea
          value={rule.newString}
          onChange={handleTextAreaChange('newString')}
        />
      </div>

      <div className={styles.section}>
        <URLPatternInput
          value={rule.urlPattern}
          onChange={handleInputChange('urlPattern')}
        />
      </div>

      <div className={styles.buttonSection}>
        <SaveButton
          onClick={onSave}
          isLoading={isLoading}
        />
        {onCancel && (
          <CancelButton
            onClick={onCancel}
            disabled={isLoading}
          />
        )}
      </div>
    </div>
  );
};
