import { classNames } from '@/util/utils';
import styles from './icon.module.css';

export type IconProps = {
  className?: string;
};

export default function IconPause({ className }: IconProps) {
  return (
    <svg className={classNames(styles.icon, className)} viewBox="0 0 24 24">
      <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
    </svg>
  );
}
