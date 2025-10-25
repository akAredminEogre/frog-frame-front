import React from 'react';

import styles from './Title.module.css';

interface TitleProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

const Title = ({
  level = 2,
  children,
  className,
  ...props
}: TitleProps) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <Tag 
      className={`${styles.title} ${styles[`level${level}`]} ${className || ''}`}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Title;
