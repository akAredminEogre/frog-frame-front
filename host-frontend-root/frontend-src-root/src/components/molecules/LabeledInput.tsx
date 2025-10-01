import React from 'react';
import Input from 'src/components/atoms/Input';
import Description from 'src/components/atoms/Description';
import styles from './InputSection.module.css';

export interface LabeledInputProps {
  label: string;
  value: string;
  name: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description?: string;
}

const LabeledInput = ({
  label,
  value,
  name,
  placeholder,
  onChange,
  description,
  ...props
}: LabeledInputProps) => {
  const inputId = `input-${name}`;
  
  return (
    <div className={styles.inputSection}>
      <div className={styles.labelRow}>
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      </div>
      <div className={styles.inputWrapper}>
        <Input
          id={inputId}
          value={value}
          placeholder={placeholder}
          name={name}
          onChange={onChange}
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

export default LabeledInput;
