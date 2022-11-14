import IconPlus from '@/components/icons/plus';
import Link from 'next/link';
import React from 'react';
import Styles from './simple-panel.module.css';

const defaultProps = {
  className: '',
};
export type SimplePanelProps = {
  className?: string;
  title: string;
  link: string;
  children: React.ReactNode;
} & typeof defaultProps;

function getClassName(className: string) {
  const classes = [Styles.simplePanel];
  if (className) classes.push(className);
  return classes.join(' ');
}

export default function SimplePanel({ className, title, link, children }: SimplePanelProps) {
  return (
    <Link className={getClassName(className)} href={link}>
      <header>
        <div>{title}</div>
        <IconPlus />
      </header>
      <div>{children}</div>
    </Link>
  );
}
SimplePanel.defaultProps = defaultProps;
