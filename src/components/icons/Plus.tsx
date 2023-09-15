import styles from './icon.module.css';

export type IconProps = {
  className?: string;
};

function getClassName(className?: string) {
  const classes = [styles.icon];
  if (className) classes.push(className);
  return classes.join(' ');
}

export default function IconPlus({ className }: IconProps) {
  return (
    <svg className={getClassName(className)} viewBox="0 0 24 24">
      <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
    </svg>
  );
}
