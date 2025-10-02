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
      {children && <span className={styles.label}>{children}</span>}
      <input
        type="checkbox"
        checked={checked}
        name={name}
        onChange={onChange}
        disabled={disabled}
        className={styles.checkbox}
        {...props}
      />
    </label>
  );
};

export default Checkbox;
