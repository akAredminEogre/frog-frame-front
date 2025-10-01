import React from 'react';
import TextArea from 'src/components/atoms/TextArea';
import Description from 'src/components/atoms/Description';
import styles from './InputSection.module.css';

export interface LabeledTextAreaProps {
  label: string;
  value: string;
  name: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  description?: string;
  rows?: number;
}

const LabeledTextArea = ({
  label,
  value,
  name,
  placeholder,
  onChange,
  description,
  rows,
  ...props
}: LabeledTextAreaProps) => {
  const inputId = `textarea-${name}`;
  
  return (
    <div className={styles.inputSection}>
      <div className={styles.labelRow}>
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      </div>
      <div className={styles.inputWrapper}>
        <TextArea
          id={inputId}
          value={value}
          placeholder={placeholder}
          name={name}
          onChange={onChange}
          rows={rows}
          {...props}
        />
      </div>
      {description && (
        <Description size="small" variant="muted">
          {description}
        </Description>
      )}
    </div>
  );
};

export default LabeledTextArea;
