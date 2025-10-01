import React from 'react';
import styles from './Description.module.css';

export interface DescriptionProps {
  children: React.ReactNode;
  size?: 'small' | 'medium';
  variant?: 'default' | 'muted';
  className?: string;
}

const Description = ({
  children,
  size = 'small',
  variant = 'muted',
  className,
  ...props
}: DescriptionProps) => {
  return (
    <div 
      className={`${styles.description} ${styles[size]} ${styles[variant]} ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Description;
