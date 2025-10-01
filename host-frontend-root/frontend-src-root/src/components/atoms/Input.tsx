import React from 'react';
import styles from './Input.module.css';

export interface InputProps {
  value: string;
  placeholder?: string;
  name?: string;
  id?: string;
  type?: 'text' | 'email' | 'password';
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const Input = ({
  value,
  placeholder,
  name,
  id,
  type = 'text',
  onChange,
  disabled = false,
  ...props
}: InputProps) => {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      name={name}
      id={id}
      onChange={onChange}
      disabled={disabled}
      className={styles.input}
      {...props}
    />
  );
};

export default Input;
