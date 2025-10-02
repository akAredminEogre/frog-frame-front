import React from 'react';
import Title from '../atoms/Title';
import NewStringTextArea from 'src/components/organisms/NewStringTextArea';
import OldStringTextArea from 'src/components/organisms/OldStringTextArea';
import URLPatternInput from 'src/components/organisms/URLPatternInput';
import SaveButton from '../molecules/SaveButton';
import styles from './RewriteRuleForm.module.css';

interface RewriteRule {
  oldString: string;
  newString: string;
  urlPattern: string;
  isRegex: boolean;
}

interface RewriteRuleFormProps {
  rule: RewriteRule;
  onRuleChange: (rule: RewriteRule) => void;
  onSave: () => void;
  isLoading?: boolean;
}

export const RewriteRuleForm: React.FC<RewriteRuleFormProps> = ({
  rule,
  onRuleChange,
  onSave,
  isLoading = false
}) => {
  
  const handleTextAreaChange = (field: keyof Pick<RewriteRule, 'oldString' | 'newString'>) => 
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onRuleChange({
        ...rule,
        [field]: e.target.value
      });
    };

  
  const handleInputChange = (field: keyof Pick<RewriteRule, 'urlPattern'>) => 
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

  return (
    <div className={styles.form}>
      <Title level={2}>fklf: Rewrite Rule</Title>
      
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
      </div>
    </div>
  );
};
