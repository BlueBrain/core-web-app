import React from 'react';
import { useLoginAtomValue } from '@/atoms/login';
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
  const login = useLoginAtomValue();
  return (
    <div className={getClassName(className)}>
      {children}
      <br />
      {login && (
        <ul>
          <li>{login.displayname}</li>
          <li>{login.username}</li>
        </ul>
      )}
    </div>
  );
}
PlaceHolder.defaultProps = defaultProps;
