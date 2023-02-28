import React from 'react';
import styles from './button.module.css';

export interface ButtonProps {
  className?: string;
  onClick(this: void): void;
  children: React.ReactNode;
}

export default function Button({ className, onClick, children }: ButtonProps) {
  return (
    <button className={`${styles.button} ${className ?? ''}`} onClick={onClick} type="button">
      {children}
    </button>
  );
}
