import { useSession } from 'next-auth/react';
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
  const { data: session } = useSession();

  return (
    <div className={getClassName(className)}>
      {children}
      <br />
      {session?.user && (
        <ul>
          <li>{session.user.name}</li>
          <li>{session.user.username}</li>
        </ul>
      )}
    </div>
  );
}
