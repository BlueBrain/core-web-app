import React from 'react';
import Styles from './place-holder.module.css';

const defaultProps = {
  className: '',
};
export type PlaceHolderProps = {
  className?: string;
  children: React.ReactNode;
} & typeof defaultProps;

function getClassName(className: string) {
  const classes = [Styles.placeHolder];
  if (className) classes.push(className);
  return classes.join(' ');
}

export default function PlaceHolder({ children, className }: PlaceHolderProps) {
  return <div className={getClassName(className)}>{children}</div>;
}
PlaceHolder.defaultProps = defaultProps;
