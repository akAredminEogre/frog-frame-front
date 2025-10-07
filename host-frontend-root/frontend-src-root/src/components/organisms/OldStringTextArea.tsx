import React from 'react';
import TextArea from 'src/components/atoms/TextArea';
import Checkbox from 'src/components/atoms/Checkbox';
import styles from 'src/components/organisms/RewriteRuleForm.module.css';

interface OldStringTextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isRegex: boolean;
  onRegexChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const OldStringTextArea: React.FC<OldStringTextAreaProps> = ({
  value,
  onChange,
  isRegex,
  onRegexChange
}) => {
  return (
    <>
      <div className={styles.labelWithCheckbox}>
        <label htmlFor="oldString" className={styles.label}>置換前:</label>
        <Checkbox
          checked={isRegex}
          onChange={onRegexChange}
          name="isRegex"
        >
          正規表現を使う
        </Checkbox>
      </div>
      <TextArea
        id="oldString"
        name="oldString"
        value={value}
        onChange={onChange}
        placeholder="置換したいテキストを入力"
        rows={3}
      />
    </>
  );
};

export default OldStringTextArea;
