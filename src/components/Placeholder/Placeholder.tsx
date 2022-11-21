import { useLoginAtomValue } from '@/atoms/login';
import styles from './placeholder.module.css';

export type PlaceholderProps = {
  className?: string;
  children: React.ReactNode;
};

function getClassName(className?: string) {
  const classes = [styles.placeHolder];
  if (className) classes.push(className);
  return classes.join(' ');
}

export default function Placeholder({ children, className }: PlaceholderProps) {
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
