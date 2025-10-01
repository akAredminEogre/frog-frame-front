import React from 'react';
import styles from './TextArea.module.css';

export interface TextAreaProps {
  value: string;
  placeholder?: string;
  name?: string;
  id?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  rows?: number;
}

const TextArea = ({
  value,
  placeholder,
  name,
  id,
  onChange,
  disabled = false,
  rows = 3,
  ...props
}: TextAreaProps) => {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      name={name}
      id={id}
      onChange={onChange}
      disabled={disabled}
      rows={rows}
      className={styles.textarea}
      {...props}
    />
  );
};

export default TextArea;
