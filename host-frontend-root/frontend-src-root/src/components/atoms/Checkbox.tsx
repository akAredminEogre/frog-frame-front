import React from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps {
  checked: boolean;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

const Checkbox = ({
  checked,
  name,
  onChange,
  disabled = false,
  children,
  ...props
}: CheckboxProps) => {
  return (
    <label className={styles.checkboxContainer}>
      <input
        type="checkbox"
        checked={checked}
        name={name}
        onChange={onChange}
        disabled={disabled}
        className={styles.checkbox}
        {...props}
      />
      {children && <span className={styles.label}>{children}</span>}
    </label>
  );
};

export default Checkbox;
