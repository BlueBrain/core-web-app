import { classNames } from '@/util/utils';
import styles from './icon.module.css';

export type IconProps = {
  className?: string;
};

export default function IconPlay({ className }: IconProps) {
  return (
    <svg className={classNames(styles.icon, className)} viewBox="0 0 24 24">
      <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
    </svg>
  );
}
